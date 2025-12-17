import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePip } from '@/contexts/PipContext';
import './FloatingPlayer.scss';

const FloatingPlayer = () => {
  const navigate = useNavigate();
  const { isPipActive, pipVideoUrl, pipAnimeInfo, deactivatePip } = usePip();
  const [position, setPosition] = useState({ bottom: 20, right: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const floatingRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!floatingRef.current) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newRight = Math.max(10, position.right - deltaX);
      const newBottom = Math.max(10, position.bottom - deltaY);

      setPosition({ right: newRight, bottom: newBottom });
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.floating-player__controls')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleClose = () => {
    deactivatePip();
  };

  const handleExpand = () => {
    if (pipAnimeInfo) {
      navigate(`/watch/${pipAnimeInfo.animeId}/${pipAnimeInfo.episodeId}`);
      deactivatePip();
    }
  };

  if (!isPipActive) return null;

  return (
    <div
      ref={floatingRef}
      className={`floating-player ${isDragging ? 'floating-player--dragging' : ''}`}
      style={{ bottom: `${position.bottom}px`, right: `${position.right}px` }}
      onMouseDown={handleMouseDown}
    >
      <div className="floating-player__video">
        <div ref={iframeRef} className="floating-player__iframe-container">
          <iframe
            src={pipVideoUrl}
            allow="autoplay; fullscreen; picture-in-picture"
            frameBorder="0"
            title="Floating Video Player"
          />
        </div>
      </div>

      <div className="floating-player__controls">
        <button
          className="floating-player__btn floating-player__btn--expand"
          onClick={handleExpand}
          title="Развернуть"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 14H5V19H10V17H7V14ZM5 10H7V7H10V5H5V10ZM17 17H14V19H19V14H17V17ZM14 5V7H17V10H19V5H14Z" fill="white"/>
          </svg>
        </button>
        <button
          className="floating-player__btn floating-player__btn--close"
          onClick={handleClose}
          title="Закрыть"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {pipAnimeInfo && (
        <div className="floating-player__info">
          <span className="floating-player__title">{pipAnimeInfo.episodeTitle}</span>
        </div>
      )}
    </div>
  );
};

export default FloatingPlayer;
