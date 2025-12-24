import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EpisodePreview from '@/components/organisms/EpisodePreview/EpisodePreview.jsx';
import VideoPlayer from '@/components/organisms/VideoPlayer/VideoPlayer.jsx';
import './Watch.scss';
import placeholder from '@/assets/placeholder.jpg';
const Watch = () => {
  const { id, episodeId } = useParams();
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Top');
  const [replyingTo, setReplyingTo] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});
  const [visibleRepliesCount, setVisibleRepliesCount] = useState({});
  const [likedComments, setLikedComments] = useState({});
  const [dislikedComments, setDislikedComments] = useState({});
  const [episodeLiked, setEpisodeLiked] = useState(false);
  const [episodeDisliked, setEpisodeDisliked] = useState(false);
  const [episodeStats, setEpisodeStats] = useState({
    likes: 652,
    dislikes: 0,
  });

  // Video player track controls
  const [openAudioMenuFunc, setOpenAudioMenuFunc] = useState(null);
  const [openSubtitleMenuFunc, setOpenSubtitleMenuFunc] = useState(null);
  const [trackInfo, setTrackInfo] = useState({
    audioTracks: [],
    currentAudioTrack: 0,
    subtitleTracks: [],
    currentSubtitleTrack: -1
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSubtitlesEnabled, setIsSubtitlesEnabled] = useState(false);

  // Callbacks for opening menus
  const handleOpenAudioMenu = useCallback((func) => {
    setOpenAudioMenuFunc(() => func);
  }, []);

  const handleOpenSubtitleMenu = useCallback((func) => {
    setOpenSubtitleMenuFunc(() => func);
  }, []);

  const handleTracksUpdate = useCallback((info) => {
    setTrackInfo(info);
  }, []);

  // Toggle audio track
  const handleToggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
  }, []);

  // Toggle subtitles
  const handleToggleSubtitles = useCallback(() => {
    setIsSubtitlesEnabled(prev => !prev);
  }, []);
const [commentsData, setCommentsData] = useState([
  {
    id: 1,
    userName: 'Alex',
    username: 'alex1',
    userAvatar: placeholder,
    text: 'Отличный пост, очень подробно расписано. Особенно понравился разбор кейса в конце.',
    daysAgo: 2,
    likes: 1240,
    dislikes: 3,
    comments: 4,
    stars: 320,
    replies: [
      {
        id: 11,
        userName: 'John',
        username: 'john1',
        userAvatar: placeholder,
        text: 'Согласен, кейс реально полезный. Я похожее применял в своём проекте.',
        daysAgo: 1,
        likes: 340,
        dislikes: 1,
        comments: 2,
        stars: 120,
        replies: [
          {
            id: 111,
            userName: 'Kate',
            username: 'kate1',

            userAvatar: placeholder,
            text: 'А можешь рассказать подробнее, в каком проекте использовал?',
            daysAgo: 1,
            likes: 98,
            dislikes: 0,
            comments: 0,
            stars: 45,
            replies: []
          },
          {
            id: 112,
            userName: 'John',
            username: 'john1',
            userAvatar: placeholder,
            text: 'Это был внутренний сервис для аналитики, в проде уже больше года.',
            daysAgo: 0,
            likes: 76,
            dislikes: 0,
            comments: 0,
            stars: 38,
            replies: []
          }
        ]
      },
      {
        id: 12,
        userName: 'Maria',
        username: 'maria1',
        userAvatar: placeholder,
        text: 'Спасибо за статью! Было бы круто увидеть продолжение.',
        daysAgo: 2,
        likes: 210,
        dislikes: 0,
        comments: 0,
        stars: 64,
        replies: []
      }
    ]
  },

  {
    id: 2,
    userName: 'Dmitry',
    username: 'Dmitry2',
    userAvatar: placeholder,
    text: 'Не со всем согласен. Некоторые моменты выглядят слишком упрощёнными.',
    daysAgo: 5,
    likes: 420,
    dislikes: 37,
    comments: 3,
    stars: 90,
    replies: [
      {
        id: 21,
        userName: 'Author',
        username: 'author',
        userAvatar: placeholder,
        text: 'Спасибо за фидбек. Мы специально упростили примеры для новичков.',
        daysAgo: 4,
        likes: 180,
        dislikes: 4,
        comments: 1,
        stars: 70,
        replies: [
          {
            id: 211,
            userName: 'Dmitry',
            username: 'dmirty2',
            userAvatar: placeholder,
            text: 'Тогда да, для начинающих это действительно подойдёт.',
            daysAgo: 3,
            likes: 95,
            dislikes: 1,
            comments: 0,
            stars: 42,
            replies: []
          }
        ]
      }
    ]
  },

  {
    id: 3,
    userName: 'Elena',
    username: 'elena1',

    userAvatar: placeholder,
    text: 'Коротко и по делу. Добавила в закладки.',
    daysAgo: 7,
    likes: 860,
    dislikes: 2,
    comments: 0,
    stars: 210,
    replies: []
  },

  {
    id: 4,
    userName: 'Sergey',
    username: 'sergey12',
    userAvatar: placeholder,
    text: 'Интересно, а это можно масштабировать под большой проект с микросервисами?',
    daysAgo: 10,
    likes: 530,
    dislikes: 6,
    comments: 2,
    stars: 150,
    replies: [
      {
        id: 41,
        userName: 'Author',
        userAvatar: placeholder,
        text: 'Да, но потребуется доработка архитектуры и кеширования.',
        daysAgo: 9,
        likes: 220,
        dislikes: 3,
        comments: 0,
        stars: 88,
        replies: []
      },
      {
        id: 42,
        userName: 'Max',
        userAvatar: placeholder,
        text: 'Мы так и сделали у себя — всё работает стабильно.',
        daysAgo: 8,
        likes: 140,
        dislikes: 1,
        comments: 0,
        stars: 60,
        replies: []
      }
    ]
  }
]);


  // Mock data
  const episodeData = {
    number: 123,
    title: 'Эпизод 123',
    views: 100,
    daysAgo: 1,
    animeName: 'Название аниме',
    videoUrl: 'https://kinescope.io/embed/vnHvcupinokE6j2zgs6hnd',
    description: 'Захватывающая история о приключениях героя в волшебном мире, полном опасностей и неожиданных поворотов сюжета. Каждая серия держит в напряжении до самого конца. Главный герой сталкивается с множеством испытаний на своём пути.',
  };

  const mockEpisodes = [
    {
      id: 124,
      animeId: id,
      title: 'Эпизод 124',
      animeName: 'Название аниме',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 1
    },
    {
      id: 125,
      animeId: id,
      title: 'Эпизод 125',
      animeName: 'Название аниме',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 2
    },
    {
      id: 126,
      animeId: id,
      title: 'Эпизод 126',
      animeName: 'Название аниме',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 3
    },
    {
      id: 127,
      animeId: id,
      title: 'Эпизод 127',
      animeName: 'Название аниме',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 4
    },
    {
      id: 128,
      animeId: id,
      title: 'Эпизод 128',
      animeName: 'Название аниме',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 5
    }
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleMoreOptions = () => {
    setShowDescription(!showDescription);
  };

  const handleEpisodeLike = () => {
    if (episodeLiked) {
      // Remove like
      setEpisodeStats(prev => ({ ...prev, likes: prev.likes - 1 }));
      setEpisodeLiked(false);
    } else {
      // Add like
      setEpisodeStats(prev => ({
        ...prev,
        likes: prev.likes + 1,
        dislikes: episodeDisliked ? prev.dislikes - 1 : prev.dislikes
      }));
      setEpisodeLiked(true);
      if (episodeDisliked) {
        setEpisodeDisliked(false);
      }
    }
  };

  const handleEpisodeDislike = () => {
    if (episodeDisliked) {
      // Remove dislike
      setEpisodeStats(prev => ({ ...prev, dislikes: prev.dislikes - 1 }));
      setEpisodeDisliked(false);
    } else {
      // Add dislike
      setEpisodeStats(prev => ({
        ...prev,
        dislikes: prev.dislikes + 1,
        likes: episodeLiked ? prev.likes - 1 : prev.likes
      }));
      setEpisodeDisliked(true);
      if (episodeLiked) {
        setEpisodeLiked(false);
      }
    }
  };

  const handleOpenCommentsModal = () => {
    setCommentsModalOpen(true);
  };

  const handleCloseCommentsModal = () => {
    setCommentsModalOpen(false);
    setReplyingTo(null);
    setNewComment('');
  };

  const handleLike = (commentId) => {
    const isCurrentlyLiked = likedComments[commentId];
    const isCurrentlyDisliked = dislikedComments[commentId];

    // Update comments data
    const updateLikes = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          let newLikes = comment.likes;

          if (isCurrentlyLiked) {
            // Remove like
            newLikes -= 1;
          } else {
            // Add like
            newLikes += 1;
            // If was disliked, also increment back the dislike count
            if (isCurrentlyDisliked) {
              comment.dislikes += 1;
            }
          }

          return { ...comment, likes: newLikes };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateLikes(comment.replies) };
        }
        return comment;
      });
    };

    setCommentsData(updateLikes(commentsData));

    // Update like state
    setLikedComments(prev => ({
      ...prev,
      [commentId]: !isCurrentlyLiked
    }));

    // Remove dislike if exists
    if (isCurrentlyDisliked) {
      setDislikedComments(prev => ({
        ...prev,
        [commentId]: false
      }));
    }
  };

  const handleDislike = (commentId) => {
    const isCurrentlyLiked = likedComments[commentId];
    const isCurrentlyDisliked = dislikedComments[commentId];

    // Update comments data
    const updateDislikes = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          let newDislikes = comment.dislikes;

          if (isCurrentlyDisliked) {
            // Remove dislike
            newDislikes -= 1;
          } else {
            // Add dislike
            newDislikes += 1;
            // If was liked, also decrement the like count
            if (isCurrentlyLiked) {
              comment.likes -= 1;
            }
          }

          return { ...comment, dislikes: newDislikes };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateDislikes(comment.replies) };
        }
        return comment;
      });
    };

    setCommentsData(updateDislikes(commentsData));

    // Update dislike state
    setDislikedComments(prev => ({
      ...prev,
      [commentId]: !isCurrentlyDisliked
    }));

    // Remove like if exists
    if (isCurrentlyLiked) {
      setLikedComments(prev => ({
        ...prev,
        [commentId]: false
      }));
    }
  };

  const handleReply = (commentId) => {
    // Find the comment to get username
    const findComment = (comments) => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          return comment;
        }
        if (comment.replies && comment.replies.length > 0) {
          const found = findComment(comment.replies);
          if (found) return found;
        }
      }
      return null;
    };

    const comment = findComment(commentsData);
    if (comment && comment.username) {
      setNewComment(`@${comment.username}: `);
    }
    setReplyingTo(commentId);
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    // If replying and the mention is removed, cancel reply mode
    if (replyingTo) {
      const findComment = (comments) => {
        for (const comment of comments) {
          if (comment.id === replyingTo) {
            return comment;
          }
          if (comment.replies && comment.replies.length > 0) {
            const found = findComment(comment.replies);
            if (found) return found;
          }
        }
        return null;
      };

      const comment = findComment(commentsData);
      if (comment && comment.username) {
        const expectedMention = `@${comment.username}: `;
        // If the mention is not at the start or has been modified, cancel reply mode
        if (!value.startsWith(expectedMention)) {
          setReplyingTo(null);
        }
      }
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      userName: 'Тестовый пользователь',
      username: 'currentuser',
      userAvatar: placeholder,
      text: newComment,
      daysAgo: 0,
      likes: 0,
      dislikes: 0,
      comments: 0,
      stars: 0,
      replies: []
    };

    if (replyingTo) {
      // Add as reply
      const addReply = (comments) => {
        return comments.map(c => {
          if (c.id === replyingTo) {
            return {
              ...c,
              replies: [...c.replies, comment],
              comments: c.comments + 1
            };
          }
          if (c.replies.length > 0) {
            return { ...c, replies: addReply(c.replies) };
          }
          return c;
        });
      };
      setCommentsData(addReply(commentsData));

      // Automatically expand replies for the parent comment
      setExpandedReplies(prev => ({
        ...prev,
        [replyingTo]: true
      }));

      // Update visible replies count to show the new reply
      setVisibleRepliesCount(prev => {
        const currentCount = prev[replyingTo] || 4;
        const findComment = (comments) => {
          for (const c of comments) {
            if (c.id === replyingTo) return c;
            if (c.replies.length > 0) {
              const found = findComment(c.replies);
              if (found) return found;
            }
          }
          return null;
        };
        const parentComment = findComment(commentsData);
        const newReplyCount = parentComment ? parentComment.replies.length + 1 : 1;

        return {
          ...prev,
          [replyingTo]: Math.max(currentCount, newReplyCount)
        };
      });
    } else {
      // Add as new comment
      setCommentsData([comment, ...commentsData]);
    }

    setNewComment('');
    setReplyingTo(null);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const getRepliesWord = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'ответов';
    }
    if (lastDigit === 1) {
      return 'ответ';
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'ответа';
    }
    return 'ответов';
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));

    if (!visibleRepliesCount[commentId]) {
      setVisibleRepliesCount(prev => ({
        ...prev,
        [commentId]: 4
      }));
    }
  };

  const loadMoreReplies = (commentId) => {
    setVisibleRepliesCount(prev => ({
      ...prev,
      [commentId]: (prev[commentId] || 4) + 4
    }));
  };

  const renderComment = (comment, depth = 0) => {
    const isExpanded = expandedReplies[comment.id];
    const visibleCount = visibleRepliesCount[comment.id] || 4;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const visibleReplies = hasReplies ? comment.replies.slice(0, visibleCount) : [];
    const hasMoreReplies = hasReplies && comment.replies.length > visibleCount;
    const showReplyButton = depth < 2;

    const commentClasses = [
      'comments-modal__comment',
      depth > 0 ? 'comments-modal__comment--reply' : '',
      hasReplies ? 'comments-modal__comment--has-replies' : '',
      hasReplies && isExpanded ? 'comments-modal__comment--expanded' : '',
      hasReplies && !isExpanded ? 'comments-modal__comment--collapsed' : ''
    ].filter(Boolean).join(' ');

    return (
    <div key={comment.id} className={commentClasses}>
        <div className="comments-modal__comment-content">
            <div className="comments-modal__comment-main">
              <div className="comments-modal__comment-avatar" style={{ backgroundImage: `url(${comment.userAvatar})` }}></div>
              <div className="comments-modal__info">
                <div className="comments-modal__comment-header">
                  <span className="comments-modal__comment-name">{comment.userName}</span>
                  <span className="comments-modal__comment-date">· {comment.daysAgo} {comment.daysAgo === 1 ? 'день' : comment.daysAgo >= 2 && comment.daysAgo <= 4 ? 'дня' : 'дней'} назад</span>
                </div>
              <p className="comments-modal__comment-text">{comment.text}</p>
              <div className="comments-modal__comment-actions">
                <button
                  className={`comments-modal__action-btn ${likedComments[comment.id] ? 'comments-modal__action-btn--active' : ''}`}
                  onClick={() => handleLike(comment.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5032 9H15C14.4477 9 14 8.55228 14 8V4.46584C14 3.10399 12.896 2 11.5342 2C11.2093 2 10.915 2.1913 10.7831 2.48812L7.26394 10.4061C7.10344 10.7673 6.74532 11 6.35013 11H4C2.89543 11 2 11.8954 2 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {formatNumber(comment.likes)}
                </button>
                <button
                  className={`comments-modal__action-btn ${dislikedComments[comment.id] ? 'comments-modal__action-btn--active' : ''}`}
                  onClick={() => handleDislike(comment.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H6.57377C5.09299 2 3.83379 3.08027 3.60863 4.54377L2.53167 11.5438C2.25209 13.3611 3.65819 15 5.49677 15H9C9.55228 15 10 15.4477 10 16V19.5342C10 20.896 11.104 22 12.4658 22C12.7907 22 13.085 21.8087 13.2169 21.5119L16.7361 13.5939C16.8966 13.2327 17.2547 13 17.6499 13H20C21.1046 13 22 12.1046 22 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="comments-modal__action-btn" onClick={() => handleReply(comment.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {formatNumber(comment.comments)}
                </button>

              
              </div>
              </div>
            </div>
            <div className="comments-modal__reply">

                {hasReplies && (
                  <div className="comments-modal__replies-container">
                    {!isExpanded ? (
                      <button
                        className="comments-modal__replies-toggle"
                        onClick={() => toggleReplies(comment.id)}
                      >

                        {comment.replies.length} {getRepliesWord(comment.replies.length)}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    ) : (
                      <>
                        <button
                          className="comments-modal__replies-toggle comments-modal__replies-toggle--expanded"
                          onClick={() => toggleReplies(comment.id)}
                        >
                          Скрыть ответы
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 15L12 8L19 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <div className="comments-modal__replies">
                          {visibleReplies.map(reply => renderComment(reply, depth + 1))}
                        </div>
                        {hasMoreReplies && (
                          <button
                            className="comments-modal__load-more"
                            onClick={() => loadMoreReplies(comment.id)}
                          >
                            Показать ещё {Math.min(4, comment.replies.length - visibleCount)} ответа
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
            </div>

        </div>
    </div>

    );
  };

  return (
    <div className="watch">

      {/* Video Player */}
      <div className="watch__player-container">
        <VideoPlayer
          videoUrl={episodeData.videoUrl}
          onOpenAudioMenu={handleOpenAudioMenu}
          onOpenSubtitleMenu={handleOpenSubtitleMenu}
          onTracksUpdate={handleTracksUpdate}
        />
      </div>
      {/* Episode Info */}
      <div className="watch__info">
        <div className="watch__header">
          <div className="watch__title-section">
            <h1 className="watch__episode-title">{episodeData.title}</h1>
            <div className="watch__meta">
              <span className="watch__views">{episodeData.views} просмотров</span>
              <span className="watch__separator">|</span>
              <span className="watch__date">{episodeData.daysAgo} {episodeData.daysAgo === 1 ? 'день' : episodeData.daysAgo >= 2 && episodeData.daysAgo <= 4 ? 'дня' : 'дней'} назад</span>
              <span className="watch__separator">|</span>

              <button className="watch__more-btn" onClick={handleMoreOptions}>
                Больше
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={showDescription ? 'watch__more-icon--open' : ''}
                >
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

        </div>

        {/* Description */}
        {showDescription && (
          <div className="watch__description">
            <p>{episodeData.description}</p>
          </div>
        )}

        {/* Anime Profile */}
        <div className="watch__profile">
          <div className="watch__avatar"></div>
          <span className="watch__anime-name">{episodeData.animeName}</span>
        </div>

        {/* Audio and Subtitle Track Buttons */}
        <div className="watch__track-buttons">
            <div className="watch__rating-btn">
            <button
              className={`watch__rating-btn-like ${episodeLiked ? 'watch__rating-btn-like--active' : ''}`}
              onClick={handleEpisodeLike}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5032 9H15C14.4477 9 14 8.55228 14 8V4.46584C14 3.10399 12.896 2 11.5342 2C11.2093 2 10.915 2.1913 10.7831 2.48812L7.26394 10.4061C7.10344 10.7673 6.74532 11 6.35013 11H4C2.89543 11 2 11.8954 2 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{episodeStats.likes}</span>
            </button>
            <div className="watch__rating-separator"></div>
            <button
              className={`watch__rating-btn-dislike ${episodeDisliked ? 'watch__rating-btn-dislike--active' : ''}`}
              onClick={handleEpisodeDislike}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H6.57377C5.09299 2 3.83379 3.08027 3.60863 4.54377L2.53167 11.5438C2.25209 13.3611 3.65819 15 5.49677 15H9C9.55228 15 10 15.4477 10 16V19.5342C10 20.896 11.104 22 12.4658 22C12.7907 22 13.085 21.8087 13.2169 21.5119L16.7361 13.5939C16.8966 13.2327 17.2547 13 17.6499 13H20C21.1046 13 22 12.1046 22 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <button
            className={`watch__track-button watch__track-button--audio ${isAudioEnabled ? 'watch__track-button--active' : ''}`}
            onClick={handleToggleAudio}
          >
            <svg width="13" height="16" viewBox="0 0 13 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M9.13885 3.2505C9.13885 1.77738 7.74663 0.583496 6.02774 0.583496C4.30885 0.583496 2.91663 1.77738 2.91663 3.2505V7.24983C2.91663 8.72294 4.30885 9.91683 6.02774 9.91683C7.74663 9.91683 9.13885 8.72294 9.13885 7.24983V3.2505Z" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.583313 6.80615C0.583313 7.52113 0.724138 8.2291 0.997746 8.88965C1.27136 9.5502 1.67239 10.1504 2.17795 10.656C2.68352 11.1615 3.28371 11.5626 3.94426 11.8362C4.60481 12.1098 5.31278 12.2506 6.02776 12.2506M6.02776 12.2506C6.74273 12.2506 7.45071 12.1098 8.11126 11.8362C8.77181 11.5626 9.372 11.1615 9.87756 10.656C10.3831 10.1504 10.7842 9.5502 11.0578 8.88965C11.3314 8.2291 11.4722 7.52113 11.4722 6.80615M6.02776 12.2506V14.5839M2.91665 14.5839H9.13887" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

            <span>{trackInfo.audioTracks[trackInfo.currentAudioTrack]?.label || 'Аудиодорожка'}</span>
          </button>
          <button
            className={`watch__track-button watch__track-button--subtitle ${isSubtitlesEnabled ? 'watch__track-button--active' : ''}`}
            onClick={handleToggleSubtitles}
          >
<svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.2C0 0.537259 0.537258 0 1.2 0H13.2C13.8627 0 14.4 0.537258 14.4 1.2V10.8C14.4 11.4627 13.8627 12 13.2 12H1.2C0.537258 12 0 11.4627 0 10.8V1.2ZM1.2 0.8C0.979086 0.8 0.8 0.979086 0.8 1.2V10.8C0.8 11.0209 0.979086 11.2 1.2 11.2H13.2C13.4209 11.2 13.6 11.0209 13.6 10.8V1.2C13.6 0.979086 13.4209 0.8 13.2 0.8H1.2Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.20001 4.4001C2.20001 3.95827 2.55818 3.6001 3.00001 3.6001H5.60001C6.04184 3.6001 6.40001 3.95827 6.40001 4.4001V5.4001H4.80001V5.2001H3.80001V6.8001H4.80001V6.4001H6.40001V7.6001C6.40001 8.04193 6.04184 8.4001 5.60001 8.4001H3.00001C2.55818 8.4001 2.20001 8.04193 2.20001 7.6001V4.4001Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 4.4001C8 3.95827 8.35817 3.6001 8.8 3.6001H11.4C11.8418 3.6001 12.2 3.95827 12.2 4.4001V5.4001H10.6V5.2001H9.6V6.8001H10.6V6.4001H12.2V7.6001C12.2 8.04193 11.8418 8.4001 11.4 8.4001H8.8C8.35817 8.4001 8 8.04193 8 7.6001V4.4001Z" fill="currentColor"/>
</svg>

            <span>{trackInfo.currentSubtitleTrack === -1 ? 'Субтитры' : (trackInfo.subtitleTracks[trackInfo.currentSubtitleTrack]?.label || 'Subtitles')}</span>
          </button>
        </div>

        <div className="watch__profile" style={{ display: 'none' }}>
          {/*
          <div className="watch__rating-btn">
            <button
              className={`watch__rating-btn-like ${episodeLiked ? 'watch__rating-btn-like--active' : ''}`}
              onClick={handleEpisodeLike}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5032 9H15C14.4477 9 14 8.55228 14 8V4.46584C14 3.10399 12.896 2 11.5342 2C11.2093 2 10.915 2.1913 10.7831 2.48812L7.26394 10.4061C7.10344 10.7673 6.74532 11 6.35013 11H4C2.89543 11 2 11.8954 2 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{episodeStats.likes}</span>
            </button>
            <div className="watch__rating-separator"></div>
            <button
              className={`watch__rating-btn-dislike ${episodeDisliked ? 'watch__rating-btn-dislike--active' : ''}`}
              onClick={handleEpisodeDislike}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H6.57377C5.09299 2 3.83379 3.08027 3.60863 4.54377L2.53167 11.5438C2.25209 13.3611 3.65819 15 5.49677 15H9C9.55228 15 10 15.4477 10 16V19.5342C10 20.896 11.104 22 12.4658 22C12.7907 22 13.085 21.8087 13.2169 21.5119L16.7361 13.5939C16.8966 13.2327 17.2547 13 17.6499 13H20C21.1046 13 22 12.1046 22 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          */}
        </div>



        <div className="watch__horizontal-hr"></div>

        {/* Comments */}
        <div className="watch__comments">
          <button
            className="watch__comments-header"
            onClick={handleOpenCommentsModal}
          >
            <span className='watch__comments-mainheader'>Комментарии <span className='watch__comments--gray'>{commentsData.length}</span></span>

            <svg width="15" height="21" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.125 9.75L5 12.875L1.875 9.75" stroke="#6C6C6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M1.875 6.25L5 3.125L8.125 6.25" stroke="#6C6C6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

          </button>

          <div className="watch__comments-preview">
            {commentsData.slice(0, 1).map((comment) => (
              <div key={comment.id} className="watch__comment">
                <div className="watch__comment-avatar" style={{ backgroundImage: `url(${comment.userAvatar})` }}></div>
                <p className="watch__comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="watch__horizontal-hr"></div>


      </div>
          <EpisodePreview episodes={mockEpisodes} />

      {/* Comments Modal */}
      {commentsModalOpen && (
        <div className="comments-modal">
          <div className="comments-modal__overlay" onClick={handleCloseCommentsModal}></div>
          <div className="comments-modal__content">
            <div className="comments-modal__header">
              <h2 className="comments-modal__title">Комментарии {commentsData.length}</h2>
              <button className="comments-modal__close" onClick={handleCloseCommentsModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="comments-modal__filters">
              <button
                className={`comments-modal__filter ${activeFilter === 'Top' ? 'comments-modal__filter--active' : ''}`}
                onClick={() => setActiveFilter('Top')}
              >
                Топ
              </button>
              <button
                className={`comments-modal__filter ${activeFilter === 'Newest' ? 'comments-modal__filter--active' : ''}`}
                onClick={() => setActiveFilter('Newest')}
              >
                Новые
              </button>

            </div>

            <div className="comments-modal__list">
              {commentsData.map(comment => renderComment(comment))}
            </div>

            <div className="comments-modal__input-wrapper">
              {replyingTo && (
                <div className="comments-modal__reply-indicator">
                  <span>Ответ на комментарий</span>
                  <button
                    className="comments-modal__reply-cancel"
                    onClick={() => {
                      setReplyingTo(null);
                      setNewComment('');
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
              <div className="comments-modal__input-container">
                <div className="comments-modal__input-avatar"></div>
                <input
                  type="text"
                  className="comments-modal__input"
                  placeholder="Добавить комментарий..."
                  value={newComment}
                  onChange={handleCommentChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                {newComment.trim() && (
                  <button className="comments-modal__send-btn" onClick={handleAddComment}>
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_13_106)">
                    <path d="M9.5 12.6666L12.6667 9.49998M12.6667 9.49998L9.5 6.33331M12.6667 9.49998L6.33333 9.49998M17.4167 9.49998C17.4167 13.8722 13.8723 17.4166 9.5 17.4166C5.12774 17.4166 1.58333 13.8722 1.58333 9.49998C1.58333 5.12773 5.12774 1.58331 9.5 1.58331C13.8723 1.58331 17.4167 5.12773 17.4167 9.49998Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_13_106">
                    <rect width="19" height="19" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>

                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
