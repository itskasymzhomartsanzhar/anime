import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EpisodePreview.scss';
import placeholder from '@/assets/placeholder.jpg';

const EpisodePreview = ({ episodes = [] }) => {
  const navigate = useNavigate();
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showEpisodeMenu, setShowEpisodeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleEpisodeClick = (animeId, episodeId) => {
    navigate(`/watch/${animeId}/${episodeId}`);
  };

  const handleEpisodeMenuClick = (episode, event) => {
    event.stopPropagation();
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    setMenuPosition({
      top: rect.top + window.scrollY,
      left: rect.left - 200 + rect.width
    });

    setSelectedEpisode(episode);
    setShowEpisodeMenu(true);
  };

  const handleMarkAsViewed = () => {
    // TODO: Implement mark as viewed logic
    console.log('Mark as viewed:', selectedEpisode);
    setShowEpisodeMenu(false);
  };

  const handleShare = () => {
    // TODO: Implement share logic
    console.log('Share:', selectedEpisode);
    setShowEpisodeMenu(false);
  };

  const handleCloseMenu = () => {
    setShowEpisodeMenu(false);
    setSelectedEpisode(null);
  };

  useEffect(() => {
    if (!showEpisodeMenu) return;

    const handleScroll = () => {
      setShowEpisodeMenu(false);
      setSelectedEpisode(null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showEpisodeMenu]);

  if (!episodes || episodes.length === 0) {
    return null;
  }

  return (
    <>
      <div className="episode-preview">
        {episodes.map((episode) => (
          <div
            key={episode.id}
            className="episode-preview__item"
            onClick={() => handleEpisodeClick(episode.animeId, episode.id)}
          >
            <div className="episode-preview__video">
              <img src={episode.thumbnail || placeholder} alt="Episode Preview" />
            </div>
            <div className="episode-preview__details">
              <div className='episode-preview__info'>
                <img
                  src={episode.animeImage || placeholder}
                  alt="Episode Preview"
                  className='episode-preview__image'
                />
                <div>
                  <h2 className="episode-preview__title">{episode.title}</h2>
                  <h5 className="episode-preview__description">
                    {episode.animeName} | {episode.daysAgo} {episode.daysAgo === 1 ? 'день' : 'дня'} назад
                  </h5>
                </div>
              </div>
              <button
                className="episode-preview__dots"
                /*onClick={(e) => handleEpisodeMenuClick(episode, e)}*/
              >
                <div className="episode-preview__dot"></div>
                <div className="episode-preview__dot"></div>
                <div className="episode-preview__dot"></div>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Episode Menu Popup */}
      {showEpisodeMenu && (
        <>
          <div className="episode-preview__overlay" onClick={handleCloseMenu}></div>
          <div
            className="episode-preview__popup-menu"
            style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
          >
            <button className="episode-preview__menu-item" onClick={handleMarkAsViewed}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Просмотренно
            </button>
            <button className="episode-preview__menu-item" onClick={handleShare}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 6L12 2L8 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Поделиться
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default EpisodePreview;
