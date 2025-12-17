import { useState, useEffect } from 'react';
import './SearchFilters.scss';

const SearchFilters = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [selectedSort, setSelectedSort] = useState(initialFilters?.sort || 'popular');
  const [selectedType, setSelectedType] = useState(initialFilters?.type || 'all');
  const [selectedGenres, setSelectedGenres] = useState(initialFilters?.genres || []);
  const sortOptions = [
    { id: 'popular', label: 'Популярные' },
    { id: 'title', label: 'Название' },
    { id: 'upload', label: 'Дата загрузки' },

    { id: 'recently', label: 'Недавно обновленные' },
  ];

  const typeOptions = [
    { id: 'all', label: 'Все' },
    { id: 'movie', label: 'Фильм' },
    { id: 'tv', label: 'Сериал' },
  ];

  const genreOptions = [
    { id: 'action', label: 'Экшен' },
    { id: 'adventure', label: 'Приключения' },
    { id: 'magic', label: 'Магия' },
    { id: 'isekai', label: 'Исекай' },
    { id: 'demons', label: 'Демоны' },
    { id: 'fantasy', label: 'Фэнтези' },
    { id: 'game', label: 'Игры' },
    { id: 'historical', label: 'Историческое' },
    { id: 'horror', label: 'Ужасы' },
    { id: 'vampire', label: 'Вампиры' },
    { id: 'military', label: 'Военное' },
    { id: 'psychological', label: 'Психологическое' },
    { id: 'school', label: 'Школьное' },
    { id: 'supernatural', label: 'Сверхъестественное' },
  ];

  const handleGenreToggle = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleReset = () => {
    setSelectedSort('popular');
    setSelectedType('all');
    setSelectedGenres([]);
  };

  const handleApply = () => {
    onApply({
      sort: selectedSort,
      type: selectedType,
      genres: selectedGenres,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-filters">
      <div className="search-filters__overlay" onClick={onClose} />
      <div className="search-filters__modal">
        <div className="search-filters__header">
          <h2 className="search-filters__title">Фильтры поиска</h2>
          <button
            className="search-filters__close"
            onClick={onClose}
            aria-label="Close filters"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="search-filters__content">
          <div className="search-filters__section">
            <h3 className="search-filters__section-title">Сортировка</h3>
            <div className="search-filters__options">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  className={`search-filters__option ${
                    selectedSort === option.id ? 'search-filters__option--active' : ''
                  }`}
                  onClick={() => setSelectedSort(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="search-filters__section">
            <h3 className="search-filters__section-title">Тип</h3>
            <div className="search-filters__options">
              {typeOptions.map((option) => (
                <button
                  key={option.id}
                  className={`search-filters__option ${
                    selectedType === option.id ? 'search-filters__option--active' : ''
                  }`}
                  onClick={() => setSelectedType(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="search-filters__section">
            <h3 className="search-filters__section-title">Жанры</h3>
            <div className="search-filters__options">
              {genreOptions.map((option) => (
                <button
                  key={option.id}
                  className={`search-filters__option ${
                    selectedGenres.includes(option.id) ? 'search-filters__option--active' : ''
                  }`}
                  onClick={() => handleGenreToggle(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="search-filters__footer">
          <button
            className="search-filters__button search-filters__button--secondary"
            onClick={handleReset}
          >
            Сбросить
          </button>
          <button
            className="search-filters__button search-filters__button--primary"
            onClick={handleApply}
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
