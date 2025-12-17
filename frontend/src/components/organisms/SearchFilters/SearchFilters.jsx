import { useState, useEffect } from 'react';
import './SearchFilters.scss';

const SearchFilters = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [selectedSort, setSelectedSort] = useState(initialFilters?.sort || 'popular');
  const [selectedType, setSelectedType] = useState(initialFilters?.type || 'all');
  const [selectedGenres, setSelectedGenres] = useState(initialFilters?.genres || []);
const sortOptions = [
  { id: 'title', label: 'Название' },          // 8
  { id: 'popular', label: 'Популярные' },      // 10
  { id: 'upload', label: 'Дата загрузки' },    // 13
  { id: 'recently', label: 'Недавно обновленные' }, // 19
];

const typeOptions = [
  { id: 'all', label: 'Все' },      // 3
  { id: 'tv', label: 'Сериал' },    // 6
  { id: 'movie', label: 'Фильм' },  // 5
];

const genreOptions = [
    { id: 'vampire', label: 'Вампиры' },              // 8
  { id: 'horror', label: 'Ужасы' },                 // 5
  { id: 'historical', label: 'Историческое' },      // 13
  { id: 'adventure', label: 'Приключения' },        // 12
  { id: 'military', label: 'Военное' },             // 7

  { id: 'magic', label: 'Магия' },                  // 5
  { id: 'action', label: 'Экшен' },                 // 5
  { id: 'school', label: 'Школьное' },              // 9
  { id: 'isekai', label: 'Исекай' },                // 6
  { id: 'demons', label: 'Демоны' },                // 6
  { id: 'fantasy', label: 'Фэнтези' },              // 7
  { id: 'game', label: 'Игры' },                    // 4
  { id: 'supernatural', label: 'Сверхъестественное' }, // 19

  { id: 'psychological', label: 'Психологическое' },   // 15
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
