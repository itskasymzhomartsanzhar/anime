import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoPlayer.scss';

const VideoPlayer = ({ videoUrl, onOpenAudioMenu, onOpenSubtitleMenu }) => {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [qualities, setQualities] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [currentSubtitleTrack, setCurrentSubtitleTrack] = useState(-1); // -1 means off
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showCenterButton, setShowCenterButton] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const controlsTimeoutRef = useRef(null);
  const centerButtonTimeoutRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Extract video ID from URL
  const getVideoId = (url) => {
    const match = url.match(/\/embed\/([^/?]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(videoUrl);

  // Expose control functions to parent via callbacks
  useEffect(() => {
    if (onOpenAudioMenu) {
      onOpenAudioMenu(() => {
        setShowSettings(true);
        setShowAudioMenu(true);
        setShowQualityMenu(false);
        setShowSpeedMenu(false);
        setShowSubtitleMenu(false);
      });
    }
  }, [onOpenAudioMenu]);

  useEffect(() => {
    if (onOpenSubtitleMenu) {
      onOpenSubtitleMenu(() => {
        setShowSettings(true);
        setShowSubtitleMenu(true);
        setShowQualityMenu(false);
        setShowSpeedMenu(false);
        setShowAudioMenu(false);
      });
    }
  }, [onOpenSubtitleMenu]);

  useEffect(() => {
    // Listen for native fullscreen changes
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      console.log(isCurrentlyFullscreen);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!videoId) return;

    let timeUpdateInterval = null;

    // Load Kinescope Player API
    const script = document.createElement('script');
    script.src = 'https://player.kinescope.io/latest/iframe.player.js';
    script.async = true;

    script.onload = () => {
      // Wait for ref to be available in DOM
      if (!iframeRef.current) {
        console.error('Iframe ref is not available');
        return;
      }

      window.Kinescope.IframePlayer.create(iframeRef.current, {
        url: `https://kinescope.io/embed/${videoId}`,
        size: { width: '100%', height: '100%' },
        behaviour: {
          localStorage: false,
          autoPlay: false,
          loop: false,
          muted: false,
          preload: 'metadata',
        },
        ui: {
          mainPlayButton: false,  // Убираем нативную кнопку
          playButton: false,
          volumeButton: false,
          progressBar: false,
          timeIndicator: false,
          settingsButton: false,
          fullscreenButton: false,
          cast: true,  // Включаем встроенную кнопку Chromecast
          watermark: false
        }
      }).then(async (player) => {
        playerRef.current = player;

        // Функция для получения длительности с повторными попытками
        const fetchDuration = async (maxAttempts = 10) => {
          for (let i = 0; i < maxAttempts; i++) {
            const dur = await player.getDuration();
            console.log(`Attempt ${i + 1}: Duration =`, dur);
            if (dur && dur > 0) {
              setDuration(dur);
              console.log('✓ Duration set successfully:', dur);
              return dur;
            }
            // Ждём 300ms между попытками
            await new Promise(resolve => setTimeout(resolve, 300));
          }
          console.warn('Failed to get duration after', maxAttempts, 'attempts');
          return 0;
        };

        // Запускаем получение длительности в фоне
        fetchDuration();

        const loadQualities = async () => {
          try {
            console.log('=== Loading video data ===');

            // Wait a bit for video metadata to load
            await new Promise(resolve => setTimeout(resolve, 500));

            // Get duration and time
            const dur = await player.getDuration();
            console.log('Duration from loadQualities:', dur);
            if (dur && dur > 0) {
              setDuration(dur);
            }

            const time = await player.getCurrentTime();
            console.log('Current time from loadQualities:', time);
            setCurrentTime(time || 0);

            // Get qualities
            const qualityList = await player.getVideoQualityList();
            console.log('Available qualities:', qualityList);


            if (Array.isArray(qualityList) && qualityList.length > 0) {
              const filteredQualities = qualityList.filter(
                (q) => q !== 'auto' && q?.id !== 'auto'
              );

              console.log('Filtered qualities:', filteredQualities);
              setQualities(filteredQualities);
            } else {
              console.log('No qualities available, will try again on Playing event');
            }

            const currentQuality = await player.getVideoQuality();
            console.log('Current quality:', currentQuality);

            if (typeof currentQuality === 'string') {
              setQuality(currentQuality);
            } else if (currentQuality?.id) {
              setQuality(currentQuality.id);
            } else {
              setQuality('auto');
            }

            // Get audio tracks
            try {
              const audioTrackList = await player.getAudioTracks();
              console.log('Available audio tracks:', audioTrackList);
              if (Array.isArray(audioTrackList) && audioTrackList.length > 0) {
                setAudioTracks(audioTrackList);
                const currentAudio = await player.getCurrentAudioTrack();
                console.log('Current audio track:', currentAudio);
                if (typeof currentAudio === 'number') {
                  setCurrentAudioTrack(currentAudio);
                }
              }
            } catch (error) {
              console.log('Audio tracks not available:', error);
            }

            // Get subtitle tracks
            try {
              const subtitleTrackList = await player.getTextTracks();
              console.log('Available subtitle tracks:', subtitleTrackList);
              if (Array.isArray(subtitleTrackList) && subtitleTrackList.length > 0) {
                setSubtitleTracks(subtitleTrackList);
                const currentSubtitle = await player.getCurrentTextTrack();
                console.log('Current subtitle track:', currentSubtitle);
                if (typeof currentSubtitle === 'number') {
                  setCurrentSubtitleTrack(currentSubtitle);
                }
              }
            } catch (error) {
              console.log('Subtitle tracks not available:', error);
            }

            console.log('=== Video data loaded ===');
          } catch (error) {
            console.error('Error loading video data:', error);
          }
        };

        // Try to load qualities immediately
        loadQualities();

        // Event listeners
        let qualitiesLoaded = false;
        player.on('Playing', async () => {
          // Load qualities on first play
          if (!qualitiesLoaded) {
            await loadQualities();
            qualitiesLoaded = true;
          }

          setIsPlaying(true);
          setIsBuffering(false);
          setShowCenterButton(true);
          setShowControls(true);

          // Get duration when video starts playing
          const dur = await player.getDuration();
          console.log('Duration on Playing event:', dur);
          if (dur && dur > 0) {
            setDuration(dur);
          }

          // Auto-hide controls after 3 seconds when video starts playing
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
          if (centerButtonTimeoutRef.current) {
            clearTimeout(centerButtonTimeoutRef.current);
          }

          controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
            setShowCenterButton(false);
          }, 3000);
        });

        player.on('Pause', () => {
          setIsPlaying(false);
          setShowCenterButton(true);
          setShowControls(true);

          // Clear auto-hide timers when paused
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
          if (centerButtonTimeoutRef.current) {
            clearTimeout(centerButtonTimeoutRef.current);
          }
        });

        player.on('Ended', () => {
          setIsPlaying(false);
          setShowCenterButton(true);
          setShowControls(true);

          // Clear auto-hide timers when ended
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
          if (centerButtonTimeoutRef.current) {
            clearTimeout(centerButtonTimeoutRef.current);
          }
        });

        let durationFetched = false;
        player.on('TimeUpdate', async (time) => {
          console.log('TimeUpdate event, time:', time);
          setCurrentTime(time);

          // Получаем длительность при первом TimeUpdate, если еще не получили
          if (!durationFetched) {
            const dur = await player.getDuration();
            console.log('Duration on first TimeUpdate:', dur);
            if (dur && dur > 0) {
              setDuration(dur);
              durationFetched = true;
            }
          }
        });

        // Fallback: обновляем currentTime через интервал
        timeUpdateInterval = setInterval(async () => {
          if (playerRef.current) {
            try {
              const time = await playerRef.current.getCurrentTime();
              setCurrentTime(time);
            } catch (error) {
              console.error('Error getting current time:', error);
            }
          }
        }, 100); // Обновляем каждые 100ms

        player.on('DurationChange', async () => {
          const dur = await player.getDuration();
          console.log('DurationChange event, duration:', dur);
          if (dur && dur > 0) {
            setDuration(dur);
          }
        });

        player.on('VolumeChange', (vol) => {
          setVolume(vol);
          setIsMuted(vol === 0);
        });

        player.on('QualityChanged', async () => {
          const currentQuality = await player.getVideoQuality();
          setQuality(currentQuality?.id || 'auto');
        });

        player.on('Seeking', () => {
          setIsBuffering(true);
        });

        player.on('Seeked', () => {
          setIsBuffering(false);
        });

        player.on('Waiting', () => {
          setIsBuffering(true);
        });
      });
    };

    document.body.appendChild(script);

    return () => {
      if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      if (centerButtonTimeoutRef.current) {
        clearTimeout(centerButtonTimeoutRef.current);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [videoId]);

  const handlePlayPause = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e, progressBar) => {
    if (!playerRef.current || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || (e.changedTouches && e.changedTouches[0]?.clientX);
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const time = pos * duration;

    playerRef.current.seekTo(time);
    setCurrentTime(time);
  };

  const handleProgressMouseDown = (e) => {
    const progressBar = e.currentTarget;

    const handleMouseMove = (moveEvent) => {
      handleSeek(moveEvent, progressBar);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    handleSeek(e, progressBar);
  };

  const handleProgressTouch = (e) => {
    // Only handle direct touches on progress bar, not on handle
    if (e.target.closest('.video-player__progress-handle')) {
      return;
    }

    e.preventDefault();
    const progressBar = e.currentTarget;
    handleSeek(e, progressBar);
  };

  const handleHandleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const progressBar = e.currentTarget.closest('.video-player__progress');
    if (!progressBar) return;

    isDraggingRef.current = true;

    // Clear any existing hide timeouts when starting drag
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
    if (centerButtonTimeoutRef.current) {
      clearTimeout(centerButtonTimeoutRef.current);
      centerButtonTimeoutRef.current = null;
    }

    const progressBarInner = progressBar.querySelector('.video-player__progress-bar');
    const timeDisplay = document.querySelector('.video-player__time');

    const handleMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      moveEvent.preventDefault();
      if (!duration) return;

      const rect = progressBar.getBoundingClientRect();
      const clientX = moveEvent.clientX || (moveEvent.touches?.[0]?.clientX);
      if (!clientX) return;

      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const time = pos * duration;
      dragTimeRef.current = time;

      // Cancel previous frame to prevent queuing
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use RAF for smooth 60fps updates
      animationFrameRef.current = requestAnimationFrame(() => {
        // Direct DOM manipulation - fastest possible
        if (progressBarInner) {
          progressBarInner.style.width = `${pos * 100}%`;
        }
        if (timeDisplay) {
          const h = Math.floor(time / 3600);
          const m = Math.floor((time % 3600) / 60);
          const s = Math.floor(time % 60);
          const formatted = h > 0
            ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
            : `${m}:${s.toString().padStart(2, '0')}`;

          const dh = Math.floor(duration / 3600);
          const dm = Math.floor((duration % 3600) / 60);
          const ds = Math.floor(duration % 60);
          const durationFormatted = dh > 0
            ? `${dh}:${dm.toString().padStart(2, '0')}:${ds.toString().padStart(2, '0')}`
            : `${dm}:${ds.toString().padStart(2, '0')}`;

          timeDisplay.innerHTML = `${formatted} <span class="video-player__time-duration">/ ${durationFormatted}</span>`;
        }
      });
    };

    const handleEnd = () => {
      isDraggingRef.current = false;

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Sync React state and seek video only once at the end
      if (dragTimeRef.current !== undefined) {
        setCurrentTime(dragTimeRef.current);
        if (playerRef.current) {
          playerRef.current.seekTo(dragTimeRef.current);
        }
      }

      // Restart auto-hide timer after dragging ends
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
          setShowCenterButton(false);
        }, 3000);
      }

      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    // Trigger initial update
    handleMove(e);
  };

  const handleVolumeChange = (e) => {
    if (!playerRef.current) return;

    const vol = parseFloat(e.target.value);
    playerRef.current.setVolume(vol);
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;

    if (isMuted || volume === 0) {
      playerRef.current.setVolume(0.5);
      setVolume(0.5);
      setIsMuted(false);
    } else {
      playerRef.current.setVolume(0);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleQualityChange = (newQuality) => {
    if (!playerRef.current) return;

    playerRef.current.setVideoQuality(newQuality);
    setQuality(newQuality);
    setShowQualityMenu(false);
    setShowSettings(false);
  };

  const handleSpeedChange = (rate) => {
    if (!playerRef.current) return;

    playerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    setShowSettings(false);
  };

  const handleAudioTrackChange = async (trackIndex) => {
    if (!playerRef.current) return;

    try {
      // Kinescope API для смены аудиодорожки
      await playerRef.current.setAudioTrack(trackIndex);
      setCurrentAudioTrack(trackIndex);
      setShowAudioMenu(false);
      setShowSettings(false);
    } catch (error) {
      console.error('Error changing audio track:', error);
    }
  };

  const handleSubtitleTrackChange = async (trackIndex) => {
    if (!playerRef.current) return;

    try {
      if (trackIndex === -1) {
        // Отключить субтитры
        await playerRef.current.disableTextTrack();
      } else {
        // Включить выбранную дорожку субтитров
        await playerRef.current.enableTextTrack(trackIndex);
      }
      setCurrentSubtitleTrack(trackIndex);
      setShowSubtitleMenu(false);
      setShowSettings(false);
    } catch (error) {
      console.error('Error changing subtitle track:', error);
    }
  };

  const toggleFullscreen = async () => {
    try {
      // Try using Kinescope API first (works best on mobile)
      if (playerRef.current && playerRef.current.requestFullscreen) {
        try {
          await playerRef.current.requestFullscreen();
          console.log('Toggled fullscreen via Kinescope API');
          return;
        } catch (kinescopeError) {
          console.log('Kinescope fullscreen not available, trying native API:', kinescopeError);
        }
      }

      // Fallback to native fullscreen API
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      const playerContainer = document.querySelector('.video-player');

      if (!isCurrentlyFullscreen) {
        // Enter fullscreen
        if (playerContainer.requestFullscreen) {
          await playerContainer.requestFullscreen();
        } else if (playerContainer.webkitRequestFullscreen) {
          // iOS Safari and older Chrome
          await playerContainer.webkitRequestFullscreen();
        } else if (playerContainer.webkitEnterFullscreen) {
          // iOS video element
          await playerContainer.webkitEnterFullscreen();
        } else if (playerContainer.mozRequestFullScreen) {
          await playerContainer.mozRequestFullScreen();
        } else if (playerContainer.msRequestFullscreen) {
          await playerContainer.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          // iOS Safari
          await document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const handlePictureInPicture = async () => {
    try {
      // Пытаемся активировать Picture-in-Picture через Kinescope API
      if (playerRef.current) {
        // Проверяем поддержку PiP в Kinescope
        try {
          await playerRef.current.requestPictureInPicture();
          console.log('Picture-in-Picture activated via Kinescope');
        } catch (pipError) {
          console.log('Kinescope PiP not available, trying native browser PiP');

          // Fallback: попытка использовать нативный браузерный PiP
          const iframe = document.querySelector('.video-player__iframe iframe');
          if (iframe && iframe.contentWindow) {
            const video = iframe.contentWindow.document.querySelector('video');
            if (video && document.pictureInPictureEnabled) {
              await video.requestPictureInPicture();
              console.log('Picture-in-Picture activated via browser API');
            }
          }
        }

        // После активации PiP переходим на главную страницу
        setTimeout(() => {
          navigate('/');
        }, 300);
      }
    } catch (error) {
      console.error('Error enabling Picture-in-Picture:', error);
      // Даже если PiP не сработал, переходим на главную
      navigate('/');
    }
  };

  const skipBackward = () => {
    if (!playerRef.current) return;
    const newTime = Math.max(0, currentTime - 10);
    playerRef.current.seekTo(newTime);
  };

  const skipForward = () => {
    if (!playerRef.current) return;
    const newTime = Math.min(duration, currentTime + 10);
    playerRef.current.seekTo(newTime);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleUserActivity = () => {
    // Show controls immediately on movement/touch
    setShowControls(true);
    setShowCenterButton(true);

    // Clear any existing hide timeouts
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (centerButtonTimeoutRef.current) {
      clearTimeout(centerButtonTimeoutRef.current);
    }

    // Don't hide controls if dragging progress bar
    if (isDraggingRef.current) {
      return;
    }

    // Hide controls after 3 seconds of no activity (only if playing)
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowCenterButton(false);
      }, 3000);
    }
  };

  const handleVideoClick = (e) => {
    // Don't toggle if clicking on controls or buttons
    if (
      e.target.closest('.video-player__controls') ||
      e.target.closest('.video-player__center-button') ||
      e.target.closest('.video-player__center-controls') ||
      e.target.closest('.video-player__nav-button') ||
      e.target.closest('.video-player__settings')
    ) {
      return;
    }

    // If controls are visible, hide them
    if (showControls) {
      setShowControls(false);
      setShowCenterButton(false);

      // Clear any pending timeouts
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (centerButtonTimeoutRef.current) {
        clearTimeout(centerButtonTimeoutRef.current);
      }
    } else {
      // If controls are hidden, show them
      setShowControls(true);
      setShowCenterButton(true);

      // Auto-hide after 3 seconds if playing
      if (isPlaying) {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
          setShowCenterButton(false);
        }, 3000);
      }
    }
  };

  const getQualityLabel = (q) => {
    if (!q || q === 'auto') return 'Авто';
    // q может быть объектом {id, label, height} или строкой
    if (typeof q === 'object' && q.label) return q.label;
    if (typeof q === 'object' && q.height) return q.height + 'p';
    return q + 'p';
  };

  if (!videoId) {
    return <div className="video-player__error">Неверный URL видео</div>;
  }

  return (
    <div
      className="video-player"
      onMouseMove={handleUserActivity}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false);
          setShowCenterButton(false);
        }
      }}
    >
      {/* Kinescope Iframe */}
      <div ref={iframeRef} className="video-player__iframe"></div>

      {/* Click overlay to capture clicks */}
      <div
        className="video-player__click-overlay"
        onClick={handleVideoClick}
        onTouchEnd={(e) => {
          // Only handle if not touching a button
          if (
            !e.target.closest('.video-player__controls') &&
            !e.target.closest('.video-player__center-button') &&
            !e.target.closest('.video-player__center-controls') &&
            !e.target.closest('.video-player__nav-button') &&
            !e.target.closest('.video-player__settings')
          ) {
            e.preventDefault(); // Prevent onClick from firing after touchend
            handleVideoClick(e);
          }
        }}
      />

      {/* Top Left PiP Button
      {showControls && (
        <button
          className="video-player__pip-btn"
          onClick={handlePictureInPicture}
          title="Картинка в картине"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 7H22V21H8V18H5V4H19V7ZM10 18H20V9H10V18ZM7 6V16H17V18H8C7.73478 18 7.48043 17.8946 7.29289 17.7071C7.10536 17.5196 7 17.2652 7 17V6Z" fill="white"/>
          </svg>
        </button>
      )}
 */}
      {/* Top Right Buttons */}
      {showControls && (
        <div className="video-player__top-buttons">
          {/* Chromecast Button */}
          <button
            className="video-player__settings-btn-top"
            onClick={() => {
              // Kinescope не поддерживает Chromecast API
              // Можно добавить кастомную реализацию через Google Cast SDK
              alert('Функция Chromecast находится в разработке');
            }}
            title="Трансляция на Chromecast"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M1 18V21H4C4 19.34 2.66 18 1 18ZM1 14V16C3.76 16 6 18.24 6 21H8C8 17.13 4.87 14 1 14ZM1 10V12C5.97 12 10 16.03 10 21H12C12 14.92 7.07 10 1 10ZM21 3H3C1.9 3 1 3.9 1 5V8H3V5H21V19H14V21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3Z" fill="white"/>
            </svg>
          </button>

          {/* Settings Button */}
          <button
            className="video-player__settings-btn-top"
            onClick={() => {
              setShowSettings(!showSettings);
              setShowQualityMenu(false);
              setShowSpeedMenu(false);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowSettings(!showSettings);
              setShowQualityMenu(false);
              setShowSpeedMenu(false);
            }}
            title="Настройки"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.83999 2.4 9.64999 2.57 9.60999 2.81L9.24999 5.35C8.65999 5.59 8.11999 5.92 7.62999 6.29L5.23999 5.33C5.01999 5.25 4.76999 5.33 4.64999 5.55L2.73999 8.87C2.61999 9.08 2.65999 9.34 2.85999 9.48L4.88999 11.06C4.83999 11.36 4.79999 11.69 4.79999 12C4.79999 12.31 4.81999 12.64 4.86999 12.94L2.83999 14.52C2.65999 14.66 2.60999 14.93 2.71999 15.13L4.63999 18.45C4.75999 18.67 5.00999 18.74 5.22999 18.67L7.61999 17.71C8.11999 18.09 8.64999 18.41 9.23999 18.65L9.59999 21.19C9.64999 21.43 9.83999 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.39999 13.98 8.39999 12C8.39999 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="white"/>
            </svg>
          </button>
        </div>
      )}

      {/* Center Controls */}
      {showCenterButton && (
        <div className="video-player__center-controls" onTouchStart={handleUserActivity}>
          {/* Previous Episode Button */}
          <button
            className="video-player__nav-button video-player__nav-button--prev"
            onClick={() => {
              // TODO: Implement previous episode functionality
              console.log('Previous episode');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Previous episode');
            }}
            aria-label="Предыдущая серия"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M6 6H8V18H6V6ZM9.5 12L18 6V18L9.5 12Z" fill="white"/>
            </svg>
          </button>

          {/* Play/Pause Button */}
          <button
            className="video-player__center-button"
            onClick={handlePlayPause}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePlayPause();
            }}
            aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
          >
            {!isPlaying ? (
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" fill="white"/>
              </svg>
            ) : (
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="white"/>
              </svg>
            )}
          </button>

          {/* Next Episode Button */}
          <button
            className="video-player__nav-button video-player__nav-button--next"
            onClick={() => {
              // TODO: Implement next episode functionality
              console.log('Next episode');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Next episode');
            }}
            aria-label="Следующая серия"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M16 18H18V6H16V18ZM6 18L14.5 12L6 6V18Z" fill="white"/>
            </svg>
          </button>
        </div>
      )}

      {/* Custom Controls */}
      <div
        className={`video-player__controls ${showControls ? 'video-player__controls--visible' : ''}`}
        onTouchStart={(e) => {
          // Don't trigger on progress bar touches as it has its own handlers
          if (e.target.closest('.video-player__progress')) {
            return;
          }
          handleUserActivity();
        }}
      >
        <div className="video-player__bottom">
          <div className="video-player__left">
             {/* Bottom Controls 
            <button className="video-player__btn" onClick={handlePlayPause}>
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="white"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
              )}
            </button>

            <button className="video-player__btn video-player__btn--skip" onClick={skipBackward}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V1L7 6L12 11V7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13H4C4 17.42 7.58 21 12 21C16.42 21 20 17.42 20 13C20 8.58 16.42 5 12 5Z" fill="white"/>
              </svg>
              <span className="video-player__skip-text">10</span>
            </button>

            <button className="video-player__btn video-player__btn--skip" onClick={skipForward}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V1L17 6L12 11V7C8.69 7 6 9.69 6 13C6 16.31 8.69 19 12 19C15.31 19 18 16.31 18 13H20C20 17.42 16.42 21 12 21C7.58 21 4 17.42 4 13C4 8.58 7.58 5 12 5Z" fill="white"/>
              </svg>
              <span className="video-player__skip-text">10</span>
            </button>

            <button className="video-player__btn" onClick={toggleMute}>
              {isMuted || volume === 0 ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V10.18L16.45 12.63C16.48 12.43 16.5 12.22 16.5 12ZM19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.63 14.91 21 13.5 21 12C21 7.72 18.01 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.52C15.58 18.04 14.83 18.45 14 18.7V20.76C15.38 20.45 16.63 19.81 17.68 18.96L19.73 21L21 19.73L12 10.73L4.27 3ZM12 4L9.91 6.09L12 8.18V4Z" fill="white"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z" fill="white"/>
                </svg>
              )}
            </button>а

            <input
              type="range"
              className="video-player__volume-slider"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
            />
*/}
            {/* Time */}
            <span className="video-player__time" title={`Raw: ${currentTime} / ${duration}`}>
              {formatTime(currentTime)} <span className="video-player__time-duration">/ {formatTime(duration)}</span>
            </span>
          </div>

          <div className="video-player__right">
            {/* Fullscreen */}
            <button
              className="video-player__btn video-player__btn--fullscreen"
              onClick={(e) => {
                console.log('Fullscreen button clicked');
                e.stopPropagation();
                toggleFullscreen();
              }}
              onTouchEnd={(e) => {
                console.log('Fullscreen button touched');
                e.preventDefault();
                e.stopPropagation();
                toggleFullscreen();
              }}
            >
              {isFullscreen ? (
                // Exit fullscreen icon
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 16H8V19H10V14H5V16ZM8 8H5V10H10V5H8V8ZM14 19H16V16H19V14H14V19ZM16 8V5H14V10H19V8H16Z" fill="white"/>
                </svg>
              ) : (
                // Enter fullscreen icon
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 14H5V19H10V17H7V14ZM5 10H7V7H10V5H5V10ZM17 17H14V19H19V14H17V17ZM14 5V7H17V10H19V5H14Z" fill="white"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="video-player__progress"
          onClick={(e) => handleSeek(e, e.currentTarget)}
          onMouseDown={handleProgressMouseDown}
          onTouchEnd={handleProgressTouch}
        >
          <div
            className="video-player__progress-bar"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div
              className="video-player__progress-handle"
              onMouseDown={handleHandleMouseDown}
              onTouchStart={handleHandleMouseDown}
            ></div>
          </div>
        </div>
      </div>

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="video-player__buffering">
          <div className="video-player__spinner"></div>
        </div>
      )}

      {/* Settings Modal */}
      <div className={`video-player__settings-modal ${showSettings ? 'video-player__settings-modal--visible' : ''}`}>
        <div className="video-player__settings-content">
          <div className="video-player__settings-header">
            <h3>Настройки видео</h3>
            <button
              onClick={() => {
                setShowSettings(false);
                setShowQualityMenu(false);
                setShowSpeedMenu(false);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSettings(false);
                setShowQualityMenu(false);
                setShowSpeedMenu(false);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"/>
              </svg>
            </button>
          </div>

          {!showQualityMenu && !showSpeedMenu && !showAudioMenu && !showSubtitleMenu && (
            <div className="video-player__main-menu">
              <button
                className="video-player__settings-item"
                onClick={() => setShowQualityMenu(true)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQualityMenu(true);
                }}
              >
                <span>Качество видео</span>
                <div className="video-player__settings-value">
                  <span>{getQualityLabel(quality)}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="white"/>
                  </svg>
                </div>
              </button>

              <button
                className="video-player__settings-item"
                onClick={() => setShowSpeedMenu(true)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSpeedMenu(true);
                }}
              >
                <span>Скорость воспроизведения</span>
                <div className="video-player__settings-value">
                  <span>{playbackRate}x</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="white"/>
                  </svg>
                </div>
              </button>


            </div>
          )}

          {showQualityMenu && (
            <div className="video-player__submenu">
              <button
                className="video-player__back-btn"
                onClick={() => setShowQualityMenu(false)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQualityMenu(false);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="white"/>
                </svg>
                Качество видео
              </button>

              <button
                className={`video-player__settings-item ${quality === 'auto' ? 'video-player__settings-item--active' : ''}`}
                onClick={() => handleQualityChange('auto')}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleQualityChange('auto');
                }}
              >
                Авто
                {quality === 'auto' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#FF6B35"/>
                  </svg>
                )}
              </button>

              {qualities.map((q) => {
                const qId = typeof q === 'object' ? q.id : q;
                const qLabel = typeof q === 'object' ? (q.label || `${q.height}p`) : `${q}p`;
                return (
                  <button
                    key={qId}
                    className={`video-player__settings-item ${quality === qId ? 'video-player__settings-item--active' : ''}`}
                    onClick={() => handleQualityChange(qId)}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQualityChange(qId);
                    }}
                  >
                    {qLabel}
                    {quality === qId && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#FF6B35"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {showSpeedMenu && (
            <div className="video-player__submenu">
              <button
                className="video-player__back-btn"
                onClick={() => setShowSpeedMenu(false)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSpeedMenu(false);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="white"/>
                </svg>
                Скорость воспроизведения
              </button>

              {playbackRates.map((rate) => (
                <button
                  key={rate}
                  className={`video-player__settings-item ${playbackRate === rate ? 'video-player__settings-item--active' : ''}`}
                  onClick={() => handleSpeedChange(rate)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSpeedChange(rate);
                  }}
                >
                  {rate === 1 ? 'Обычная' : `${rate}x`}
                  {playbackRate === rate && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#FF6B35"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {showAudioMenu && (
            <div className="video-player__submenu">
              <button
                className="video-player__back-btn"
                onClick={() => setShowAudioMenu(false)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAudioMenu(false);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="white"/>
                </svg>
                Аудиодорожка
              </button>

              {audioTracks.length > 0 ? (
                audioTracks.map((track, index) => (
                  <button
                    key={index}
                    className={`video-player__settings-item ${currentAudioTrack === index ? 'video-player__settings-item--active' : ''}`}
                    onClick={() => handleAudioTrackChange(index)}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAudioTrackChange(index);
                    }}
                  >
                    {track.label || `Дорожка ${index + 1}`}
                    {currentAudioTrack === index && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#FF6B35"/>
                      </svg>
                    )}
                  </button>
                ))
              ) : (
                <div className="video-player__settings-item" style={{ opacity: 0.5, cursor: 'default' }}>
                  Нет доступных дорожек
                </div>
              )}
            </div>
          )}

          {showSubtitleMenu && (
            <div className="video-player__submenu">
              <button
                className="video-player__back-btn"
                onClick={() => setShowSubtitleMenu(false)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSubtitleMenu(false);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="white"/>
                </svg>
                Субтитры
              </button>

              <button
                className={`video-player__settings-item ${currentSubtitleTrack === -1 ? 'video-player__settings-item--active' : ''}`}
                onClick={() => handleSubtitleTrackChange(-1)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubtitleTrackChange(-1);
                }}
              >
                Выключено
                {currentSubtitleTrack === -1 && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#FF6B35"/>
                  </svg>
                )}
              </button>

              {subtitleTracks.map((track, index) => (
                <button
                  key={index}
                  className={`video-player__settings-item ${currentSubtitleTrack === index ? 'video-player__settings-item--active' : ''}`}
                  onClick={() => handleSubtitleTrackChange(index)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubtitleTrackChange(index);
                  }}
                >
                  {track.label || `Субтитры ${index + 1}`}
                  {currentSubtitleTrack === index && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#FF6B35"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
