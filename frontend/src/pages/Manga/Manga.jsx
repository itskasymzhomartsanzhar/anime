import Menu from '@/components/organisms/Menu/Menu.jsx';
import './Manga.scss';

const Manga = () => {
  return (
    <div className="manga">
      <div className="manga__content">
        <div className="manga__icon">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="58" stroke="#666" strokeWidth="4"/>
            <circle cx="42" cy="48" r="6" fill="#666"/>
            <circle cx="78" cy="48" r="6" fill="#666"/>
            <path d="M 35 78 Q 60 68 85 78" stroke="#666" strokeWidth="4" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <h2 className="manga__title">Данный раздел находится в разработке</h2>
      </div>
      <Menu />
    </div>
  );
};

export default Manga;
