import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '@/components/organisms/Menu/Menu.jsx';

import placeholder from '@/assets/placeholder.jpg';
import './Catalog.scss';

const Catalog = () => {
  const [activeTab, setActiveTab] = useState('top');
  const [selectedCategory, setSelectedCategory] = useState('Популярные');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const navigate = useNavigate();

  // Mock data
  const animeData = [
    { id: 1, name: 'Название', meta: 'Дубляж | Субтитры' },
    { id: 2, name: 'Название', meta: 'Дубляж | Субтитры' },
    { id: 3, name: 'Название', meta: 'Дубляж | Субтитры' },
    { id: 4, name: 'Название', meta: 'Дубляж | Субтитры' },
    { id: 5, name: 'Название', meta: 'Дубляж | Субтитры' },
    { id: 6, name: 'Название', meta: 'Дубляж | Субтитры' },
  ];

  const categories = ['Популярные', 'Категория1', 'Категория2', 'Категория3', 'Категория4'];
  const letters = ['#', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
  const seasons = ['Зима', 'Весна', 'Лето', 'Осень'];

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    navigate('/search');
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
  };

  const handleCloseYearModal = () => {
    setIsYearModalOpen(false);
  };

  return (
    <div className="catalog">
      <div className="catalog__header">
        <h1 className="catalog__title">Каталог Аниме</h1>
        <button className="catalog__search-btn" onClick={handleSearch} aria-label="Search">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="catalog__tabs">
        <button
          className={`catalog__tab ${activeTab === 'top' ? 'catalog__tab--active' : ''}`}
          onClick={() => setActiveTab('top')}
        >
          Топ Аниме
        </button>
        <button
          className={`catalog__tab ${activeTab === 'seasons' ? 'catalog__tab--active' : ''}`}
          onClick={() => setActiveTab('seasons')}
        >
          Все Сезоны
        </button>
        <button
          className={`catalog__tab ${activeTab === 'all' ? 'catalog__tab--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Все Аниме
        </button>
      </div>

      <div className="catalog__content">
        {/* Top Anime Tab */}
        {activeTab === 'top' && (
          <>
            <div className="catalog__filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`catalog__filter-btn ${
                    selectedCategory === category ? 'catalog__filter-btn--active' : ''
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="catalog__grid">
              {animeData.map((anime) => (
                <div key={anime.id} className="catalog__card" onClick={() => navigate(`/anime/${anime.id}`)}>
                  <div className="catalog__card-image" style={{ backgroundImage: `url(${placeholder})` }}>
                  </div>
                  <div className="catalog__card-info">
                    <h3 className="catalog__card-name">{anime.name}</h3>
                    <p className="catalog__card-meta">{anime.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* All Seasons Tab */}
        {activeTab === 'seasons' && (
          <>
            {!selectedYear ? (
              <div className="catalog__seasons">
                {years.map((year) => (
                  <div key={year} className="catalog__year-section">
                    <h2 className="catalog__year-title">{year}</h2>
                    <div className="catalog__season-filters">
                      {seasons.map((season) => (
                        <button
                          key={`${year}-${season}`}
                          className="catalog__season-btn"
                          onClick={() => {
                            setSelectedYear(year);
                            setSelectedSeason(season);
                          }}
                        >
                          {season}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="catalog__year-header">
                  <button className="catalog__year-nav" onClick={() => setSelectedYear(selectedYear - 1)}>
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.16667 17.4166L2.75 10.9999M2.75 10.9999L9.16667 4.58325M2.75 10.9999L19.25 10.9999" stroke="white" stroke-width="1.57143" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>

                  </button>
                  <h2 className="catalog__year-current">{selectedYear}</h2>
                  <button className="catalog__year-nav" onClick={() => setSelectedYear(selectedYear + 1)}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.8333 17.4166L19.25 10.9999M19.25 10.9999L12.8333 4.58325M19.25 10.9999L2.75 10.9999" stroke="white" stroke-width="1.57143" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                  </button>
                  <button className="catalog__year-close" onClick={() => setSelectedYear(null)}>
                    <svg width="22" height="22" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="catalog__grid">
                  {animeData.map((anime) => (
                    <div key={anime.id} className="catalog__card" onClick={() => navigate(`/anime/${anime.id}`)}>
                      <div className="catalog__card-image" style={{ backgroundImage: `url(${placeholder})` }}>
                      </div>
                      <div className="catalog__card-info">
                        <h3 className="catalog__card-name">{anime.name}</h3>
                        <p className="catalog__card-meta">{anime.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* All Anime Tab */}
        {activeTab === 'all' && (
          <>
            <div className="catalog__letters">
              {letters.map((letter) => (
                <button
                  key={letter}
                  className={`catalog__letter-btn ${
                    selectedLetter === letter ? 'catalog__letter-btn--active' : ''
                  }`}
                  onClick={() => setSelectedLetter(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
            <div className="catalog__list">
              {animeData.map((anime) => (
                <div key={anime.id} className="catalog__list-item">
                  <span className="catalog__list-name">{anime.name}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
            <Menu />
      
    </div>
  );
};

export default Catalog;
