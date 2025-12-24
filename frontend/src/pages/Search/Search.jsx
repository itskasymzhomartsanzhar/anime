import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilters from '@/components/organisms/SearchFilters/SearchFilters';
import EmptyState from '@/components/molecules/EmptyState/EmptyState';
import './Search.scss';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    sort: 'popular',
    type: 'all',
    genres: [],
  });
  const navigate = useNavigate();

  const recentSearches = [
    { id: 1, name: 'Attack on Titan', meta: 'Dub | Sub' },
    { id: 2, name: 'Demon Slayer', meta: 'Dub | Sub' },
    { id: 3, name: 'One Piece', meta: 'Dub | Sub' },
    { id: 4, name: 'Naruto', meta: 'Dub | Sub' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    if (searchQuery.trim()) {
      if (searchQuery.toLowerCase() === 'test') {
        setSearchResults([]);
      } else {
        setSearchResults(recentSearches);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenFilters = () => {
    setIsFiltersOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFiltersOpen(false);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    console.log('Примененные фильтры:', filters);
  };

  const handleRemoveFilter = (filterType, value) => {
    if (filterType === 'genre') {
      setActiveFilters((prev) => ({
        ...prev,
        genres: prev.genres.filter((g) => g !== value),
      }));
    } else if (filterType === 'type' && value !== 'all') {
      setActiveFilters((prev) => ({
        ...prev,
        type: 'all',
      }));
    }
  };

  const getActiveFilterTags = () => {
    const tags = [];

    if (activeFilters.type !== 'all') {
      tags.push({
        type: 'type',
        value: activeFilters.type,
        label: activeFilters.type.charAt(0).toUpperCase() + activeFilters.type.slice(1),
      });
    }

    activeFilters.genres.forEach((genre) => {
      tags.push({
        type: 'genre',
        value: genre,
        label: genre.charAt(0).toUpperCase() + genre.slice(1),
      });
    });

    return tags;
  };

  const activeTags = getActiveFilterTags();

  return (
    <div className="search">
      <div className="search__header">
        <button className="search__back-btn" onClick={handleBack} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="search__title">Поиск аниме</h1>
        <button className="search__filter-btn" onClick={handleOpenFilters} aria-label="Filter">
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.49984 4.16777C8.419 4.16777 9.1665 4.91527 9.1665 5.83443C9.1665 6.7536 8.419 7.5011 7.49984 7.5011C6.58067 7.5011 5.83317 6.7536 5.83317 5.83443C5.83317 4.91527 6.58067 4.16777 7.49984 4.16777ZM2.49984 6.66776C2.27882 6.66776 2.06686 6.57997 1.91058 6.42369C1.7543 6.26741 1.6665 6.05545 1.6665 5.83443C1.6665 5.61342 1.7543 5.40146 1.91058 5.24518C2.06686 5.0889 2.27882 5.0011 2.49984 5.0011H4.28484C4.65734 3.56777 5.9515 2.5011 7.49984 2.5011C9.04817 2.5011 10.3423 3.56777 10.7148 5.0011H17.4998C17.7208 5.0011 17.9328 5.0889 18.0891 5.24518C18.2454 5.40146 18.3332 5.61342 18.3332 5.83443C18.3332 6.05545 18.2454 6.26741 18.0891 6.42369C17.9328 6.57997 17.7208 6.66776 17.4998 6.66776H10.7148C10.3423 8.1011 9.04817 9.16776 7.49984 9.16776C5.9515 9.16776 4.65734 8.1011 4.28484 6.66776H2.49984ZM12.4998 15.8344C13.419 15.8344 14.1665 15.0869 14.1665 14.1678C14.1665 13.2486 13.419 12.5011 12.4998 12.5011C11.5807 12.5011 10.8332 13.2486 10.8332 14.1678C10.8332 15.0869 11.5807 15.8344 12.4998 15.8344ZM17.4998 13.3344C17.7208 13.3344 17.9328 13.4222 18.0891 13.5785C18.2454 13.7348 18.3332 13.9468 18.3332 14.1678C18.3332 14.3888 18.2454 14.6007 18.0891 14.757C17.9328 14.9133 17.7208 15.0011 17.4998 15.0011H15.7148C15.3423 16.4344 14.0482 17.5011 12.4998 17.5011C10.9515 17.5011 9.65734 16.4344 9.28484 15.0011H2.49984C2.27882 15.0011 2.06686 14.9133 1.91058 14.757C1.7543 14.6007 1.6665 14.3888 1.6665 14.1678C1.6665 13.9468 1.7543 13.7348 1.91058 13.5785C2.06686 13.4222 2.27882 13.3344 2.49984 13.3344H9.28484C9.65734 11.9011 10.9515 10.8344 12.4998 10.8344C14.0482 10.8344 15.3423 11.9011 15.7148 13.3344H17.4998Z" fill="white"/>
</svg>

        </button>
      </div>

      <div className="search__content">
        <form className="search__form" onSubmit={handleSearch}>
          <div className="search__input-wrapper">
            <svg className="search__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="search__input"
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search__clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </form>

        {activeTags.length > 0 && (
          <div className="search__tags">
            {activeTags.map((tag) => (
              <button
                key={`${tag.type}-${tag.value}`}
                className="search__tag"
                onClick={() => handleRemoveFilter(tag.type, tag.value)}
              >
                {tag.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        )}
        {searchResults === null ? (
          <div className="search__recent">
            <h2 className="search__section-title">Недавно искали</h2>
            <div className="search__grid">
              {recentSearches.map((item) => (
                <div key={item.id} className="search__card">
                  <div className="search__card-image">
                  </div>
                  <div className="search__card-info">
                    <h3 className="search__card-name">{item.name}</h3>
                    <p className="search__card-meta">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="search__results">
            <h2 className="search__section-title">Результаты поиска</h2>
            <div className="search__grid">
              {searchResults.map((item) => (
                <div key={item.id} className="search__card">
                  <div className="search__card-image">
                  </div>
                  <div className="search__card-info">
                    <h3 className="search__card-name">{item.name}</h3>
                    <p className="search__card-meta">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SearchFilters
        isOpen={isFiltersOpen}
        onClose={handleCloseFilters}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </div>
  );
};

export default Search;
