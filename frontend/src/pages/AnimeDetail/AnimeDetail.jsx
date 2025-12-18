import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import placeholder from '@/assets/placeholder.jpg';
import './AnimeDetail.scss';

const AnimeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('season1');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Новые');
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showEpisodeMenu, setShowEpisodeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showRecapMenu, setShowRecapMenu] = useState(false);
  const [showWatchEpMenu, setShowWatchEpMenu] = useState(true); // По умолчанию активен WATCH EP
  const [recapFilter, setRecapFilter] = useState('New');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showStickyTitle, setShowStickyTitle] = useState(false);
  const titleRef = useRef(null);

  // Mock data
  const animeData = {
    title: 'Названиев две строки, пример текста',
    subtitle: 'Слоган/Краткое описание',
    rating: '14+',
    type: 'Аниме',
    score: '8.73',
    poster: placeholder,
    description: 'Захватывающая история о приключениях героя в волшебном мире, полном опасностей и неожиданных поворотов сюжета. Каждая серия держит в напряжении до самого конца.',
    contentRating: 'Нецензурная лексика, насилие',
    duration: '3 сезона, 125 эпизодов',
    genres: ['Экшен', 'Приключения', 'Магия', 'Исекай'],
    audio: 'Русский, Английский, Японский',
    subtitles: 'Русский, Английский',
  };

  const tabs = [
    { id: 'season1', label: 'Сезон 1' },
    { id: 'season2', label: 'Сезон 2' },
    { id: 'all-seasons', label: 'Все сезоны' },
    { id: 'movies', label: 'Фильмы' },
  ];

  const allSeasons = [
    { id: 'season1', name: 'Сезон 1', dub: 'Озвучка', sub: 'Субтитры', poster: placeholder },
    { id: 'season2', name: 'Сезон 2', dub: 'Озвучка', sub: 'Субтитры', poster: placeholder },
    { id: 'season3', name: 'Сезон 3', dub: 'Озвучка', sub: 'Субтитры', poster: placeholder },
    { id: 'season4', name: 'Сезон 4', dub: 'Озвучка', sub: 'Субтитры', poster: placeholder },
  ];

  const episodes = [
    { id: 1, number: 1, title: 'Название', duration: '24m', isViewed: false },
    { id: 2, number: 2, title: 'Название', duration: '24m', isViewed: true },
    { id: 3, number: 3, title: 'Название', duration: '24m left', isViewed: false },
  ];

  const filters = ['Новые', 'Старые', 'Похожие'];

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    navigate('/search');
  };

  const handleEpisodeMenuClick = (episode, event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    setMenuPosition({
      top: rect.top + window.scrollY,
      left: rect.left - 200 + rect.width // Position menu to the left of the button
    });

    setSelectedEpisode(episode);
    setShowEpisodeMenu(true);
  };

  const handleMarkAsViewed = () => {
    // TODO: Implement mark as viewed logic
    setShowEpisodeMenu(false);
  };

  const handleShare = () => {
    // TODO: Implement share logic
    setShowEpisodeMenu(false);
  };

  const handleCloseMenu = () => {
    setShowEpisodeMenu(false);
    setSelectedEpisode(null);
  };

  const handleSeasonClick = (seasonId) => {
    setActiveTab(seasonId);
  };

  // Отслеживание видимости заголовка
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Если заголовок НЕ видим, показываем sticky title
        setShowStickyTitle(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px', // Учитываем высоту хедера
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);

  return (
    <div className="anime-detail">
      {/* Header */}
      <div className={`anime-detail__header ${showStickyTitle ? 'anime-detail__header--with-shadow' : ''}`}>
        <button className="anime-detail__back-btn" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Sticky Title - появляется при скролле */}
        <h2 className={`anime-detail__sticky-title ${showStickyTitle ? 'anime-detail__sticky-title--visible' : ''}`}>
          {animeData.title.replace('\n', ' ')}
        </h2>

        <button className="anime-detail__search-btn" onClick={handleSearch}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Poster */}
      <div className="anime-detail__poster" style={{ backgroundImage: `url(${animeData.poster})` }}>
        <div className="anime-detail__poster-overlay">
          <h1 ref={titleRef} className="anime-detail__title">{animeData.title}</h1>
        </div>
      </div>

      {/* Info */}
      <div className="anime-detail__info">
        <div className="anime-detail__meta">
          <span className="anime-detail__rating">{animeData.rating}</span>
          <span className="anime-detail__separator">|</span>
          <span className="anime-detail__type">{animeData.type}</span>
          <span className="anime-detail__separator">|</span>
          <span className="anime-detail__score">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FF6B35" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {animeData.score}
          </span>
        </div>


        {/* Description */}
        <p className={`anime-detail__description ${isDescriptionExpanded ? 'anime-detail__description--expanded' : ''}`}>
          {animeData.description}
        </p>
        <button
          className="anime-detail__more-btn"
          onClick={() => setShowInfoModal(true)}
        >
          Показать больше
        </button>

        {/* Watch Buttons */}
        <div className="anime-detail__watch-buttons anime-detail__watch-buttons--inline">
          <button
            className={`anime-detail__watch-btn anime-detail__watch-btn--recap ${showRecapMenu ? 'anime-detail__watch-btn--active' : ''}`}
            onClick={() => {
              if (!showRecapMenu) {
                setShowRecapMenu(true);
                setShowWatchEpMenu(false);
              }
            }}
          >
            WATCH RECAP
          </button>

          <button
            className={`anime-detail__watch-btn anime-detail__watch-btn--ep ${showWatchEpMenu ? 'anime-detail__watch-btn--active' : ''}`}
            onClick={() => {
              if (!showWatchEpMenu) {
                setShowWatchEpMenu(true);
                setShowRecapMenu(false);
              }
            }}
          >
            WATCH EP
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Recap Content */}
        {showRecapMenu && (
          <div className="anime-detail__inline-content">
            <div className="anime-detail__inline-filters">
              <button
                className={`anime-detail__inline-filter-btn ${recapFilter === 'New' ? 'anime-detail__inline-filter-btn--active' : ''}`}
                onClick={() => setRecapFilter('New')}
              >
                Новые
              </button>
              <button
                className={`anime-detail__inline-filter-btn ${recapFilter === 'Old' ? 'anime-detail__inline-filter-btn--active' : ''}`}
                onClick={() => setRecapFilter('Old')}
              >
                Старые
              </button>
            </div>
          </div>
        )}
        {/* Watch EP Content */}
        {showWatchEpMenu && (
          <div className="anime-detail__inline-content">
            <div className="anime-detail__tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`anime-detail__tab ${activeTab === tab.id ? 'anime-detail__tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Season Info */}
            <div className="anime-detail__season-info">
              <h3 className="anime-detail__season-title">С1- Название сезона</h3>
              <p className="anime-detail__episode-count">Эпизод 21</p>
            </div>

            {/* Filters */}
            <div className="anime-detail__filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`anime-detail__filter-btn ${selectedFilter === filter ? 'anime-detail__filter-btn--active' : ''}`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}


      {/* Content based on active tab */}
      {activeTab === 'all-seasons' ? (
        // All Seasons Grid
        <div className="anime-detail__all-seasons">
          <div className="anime-detail__season-header">
            <h3>Название аниме: Все сезоны</h3>
            <p>{allSeasons.length} сезонов</p>
          </div>
          <div className="anime-detail__seasons-grid">
            {allSeasons.map((season) => (
              <div
                key={season.id}
                className="anime-detail__season-card"
                onClick={() => handleSeasonClick(season.id)}
              >
                <div className="anime-detail__season-poster" style={{ backgroundImage: `url(${season.poster})` }}></div>
                <div className="anime-detail__season-info-card">
                  <h4 className="anime-detail__season-name">{season.name}</h4>
                  <p className="anime-detail__season-lang">{season.dub} | {season.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Episode List for specific season
        <>


          {/* Episodes List */}
          <div className="anime-detail__episodes">
            {episodes.map((episode) => (
              <div key={episode.id} className="anime-detail__episode">
                <div className="anime-detail__episode-poster" style={{ backgroundImage: `url(${placeholder})` }}>
                  {episode.isViewed && <div className="anime-detail__episode-viewed"></div>}
                </div>
                <div className="anime-detail__episode-content">
                  <div className="anime-detail__episode-info">
                    <div className="anime-detail__episode-header">
                      <span className="anime-detail__episode-number">S1 E{episode.number}</span>
                    </div>
                    <h4 className="anime-detail__episode-title">{episode.number} - {episode.title}</h4>
                  </div>
                  <button
                    className="anime-detail__episode-menu"
                    onClick={(e) => handleEpisodeMenuClick(episode, e)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="5" r="1.5" fill="white"/>
                      <circle cx="12" cy="12" r="1.5" fill="white"/>
                      <circle cx="12" cy="19" r="1.5" fill="white"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Fixed Watch Button Container */}
      <div className="anime-detail__fixed-buttons">
        <button
          className="anime-detail__fixed-watch-btn"
          onClick={() => navigate(`/watch/${id}/1`)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="white" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          НАЧАТЬ ПРОСМОТР С1 Э1
        </button>

        <button
          className={`anime-detail__bookmark-btn ${isBookmarked ? 'anime-detail__bookmark-btn--active' : ''}`}
          onClick={() => setIsBookmarked(!isBookmarked)}
          title={isBookmarked ? 'Удалить из закладок' : 'Добавить в закладки'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" fill={isBookmarked ? 'white' : 'none'} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Episode Menu Popup */}
      {showEpisodeMenu && (
        <>
          <div className="anime-detail__overlay" onClick={handleCloseMenu}></div>
          <div
            className="anime-detail__popup-menu"
            style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
          >
            <button className="anime-detail__menu-item" onClick={handleMarkAsViewed}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Просмотренно
            </button>
            <button className="anime-detail__menu-item" onClick={handleShare}>
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

      {/* Info Modal */}
      {showInfoModal && (
        <div className="anime-detail__info-modal">
          <div className="anime-detail__modal-overlay" onClick={() => setShowInfoModal(false)}></div>
          <div className="anime-detail__modal-content">
            <div className="anime-detail__modal-header">
              <button className="anime-detail__modal-close" onClick={() => setShowInfoModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button> 
            </div>

            <div className="anime-detail__modal-body">
              <h2 className="anime-detail__modal-title">{animeData.title}</h2>

              <div className="anime-detail__modal-section">
                <h3 className="anime-detail__modal-section-title">Описание</h3>
                <p className="anime-detail__modal-text">{animeData.description}</p>
              </div>

              <div className="anime-detail__modal-section">
                <h3 className="anime-detail__modal-section-title">Рекомендации по контенту</h3>
                <div className="anime-detail__modal-badge">{animeData.rating}</div>
              </div>

              <div className="anime-detail__modal-section">
                <h3 className="anime-detail__modal-section-title">Продолжительность</h3>
                <p className="anime-detail__modal-text">{animeData.duration}</p>
              </div>

              <div className="anime-detail__modal-section">
                <h3 className="anime-detail__modal-section-title">Жанры</h3>
                <div className="anime-detail__modal-genres">
                  {animeData.genres.map((genre, index) => (
                    <span key={index} className="anime-detail__modal-genre">{genre}</span>
                  ))}
                </div>
              </div>

              <div className="anime-detail__modal-section">
                <h3 className="anime-detail__modal-section-title">Аудио</h3>
                <p className="anime-detail__modal-text">{animeData.audio}</p>
              </div>

              <div className="anime-detail__modal-section">
                <h3 className="anime-detail__modal-section-title">Субтитры</h3>
                <p className="anime-detail__modal-text">{animeData.subtitles}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetail;
