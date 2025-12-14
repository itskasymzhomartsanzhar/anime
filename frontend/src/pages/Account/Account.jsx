import { useNavigate } from 'react-router-dom';
import Menu from '@/components/organisms/Menu/Menu.jsx';

import placeholder from '@/assets/placeholder.jpg';
import './Account.scss';

const Account = () => {
  const navigate = useNavigate();

  const recentlyViewed = [
    { id: 1, title: 'S01E03', subtitle: 'Атака титанов', episode: '23:55' },
    { id: 2, title: 'S01E04', subtitle: 'Истребитель демонов', episode: 'S4-E8' },
    { id: 3, title: 'S01E03', subtitle: 'Name anime', episode: 'S4-E8' },
  ];

  const favorites = [
    { id: 1, title: 'Атака титанов', seasons: '3 Сезона' },
    { id: 2, title: 'Истребитель демонов', seasons: '3 Сезона' },
  ];

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <>
    <div className="account">
      <div className="account__header">
        <button className="account__search-btn" onClick={handleSearch} aria-label="Search">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="account__title">Аккаунт</h1>
        <div className="account__avatar">
          <span>S</span>
        </div>
      </div>

      <div className="account__content">
        <section className="account__section">
          <h2 className="account__section-title">Недавно просмотренные</h2>
          <div className="account__horizontal-scroll">
            {recentlyViewed.map((item) => (
              <div key={item.id} className="account__card account__card--small">
                <div className="account__card-image" style={{ backgroundImage: `url(${placeholder})` }}>
                  <div className="account__card-badge">{item.episode}</div>
                </div>
                <div className="account__card-info">
                  <h3 className="account__card-title">{item.title}</h3>
                  <p className="account__card-subtitle">{item.subtitle}</p>
                </div>
                <button className="account__card-menu" aria-label="More options">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="5" r="2" fill="white"/>
                    <circle cx="12" cy="12" r="2" fill="white"/>
                    <circle cx="12" cy="19" r="2" fill="white"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="account__section">
          <h2 className="account__section-title">Избранное</h2>
          <div className="account__grid">
            {favorites.map((item) => (
              <div key={item.id} className="account__favorite-card">
                <div
                  className="account__favorite-image"
                  style={{ backgroundImage: `url(${placeholder})` }}
                />
                <div className="account__favorite-info">
                  <h3 className="account__favorite-title">{item.title}</h3>
                  <p className="account__favorite-subtitle">{item.seasons}</p>
                </div>
                <button className="account__favorite-remove" aria-label="Remove from favorites">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

    <Menu />
    </>
  );
};

export default Account;
