import { useLocation, useNavigate } from 'react-router-dom';
import './Menu.scss';

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'home',
      label: 'Главная',
      icon: (
<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12H10C9.73478 12 9.48043 12.1054 9.29289 12.2929C9.10536 12.4804 9 12.7348 9 13V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M3 10C2.99993 9.70907 3.06333 9.42162 3.18579 9.15771C3.30824 8.89381 3.4868 8.65979 3.709 8.472L10.709 2.473C11.07 2.16791 11.5274 2.00052 12 2.00052C12.4726 2.00052 12.93 2.16791 13.291 2.473L20.291 8.472C20.5132 8.65979 20.6918 8.89381 20.8142 9.15771C20.9367 9.42162 21.0001 9.70907 21 10V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

      ),
      path: '/',
    },
    {
      id: 'schedule',
      label: 'Расписание',
      icon: (
<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4ZM12 6C12.2449 6.00003 12.4813 6.08996 12.6644 6.25272C12.8474 6.41547 12.9643 6.63975 12.993 6.883L13 7V11.586L15.707 14.293C15.8863 14.473 15.9905 14.7144 15.9982 14.9684C16.006 15.2223 15.9168 15.4697 15.7488 15.6603C15.5807 15.8508 15.3464 15.9703 15.0935 15.9944C14.8406 16.0185 14.588 15.9454 14.387 15.79L14.293 15.707L11.293 12.707C11.1376 12.5514 11.0378 12.349 11.009 12.131L11 12V7C11 6.73478 11.1054 6.48043 11.2929 6.29289C11.4804 6.10536 11.7348 6 12 6Z" fill="white"/>
</svg>


      ),
      path: '/schedule',
    },
    {
      id: 'catalog',
      label: 'Каталог',
      icon: (
<svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 5C2 4.44772 2.44772 4 3 4H17C17.5523 4 18 4.44772 18 5C18 5.55228 17.5523 6 17 6H3C2.44772 6 2 5.55228 2 5ZM4 1C4 0.447715 4.44772 0 5 0H15C15.5523 0 16 0.447715 16 1C16 1.55228 15.5523 2 15 2H5C4.44772 2 4 1.55228 4 1ZM18 8H2C0.9 8 0 8.9 0 10V18C0 19.1 0.9 20 2 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM18 16.75C18 17.4404 17.4404 18 16.75 18H3.25C2.55964 18 2 17.4404 2 16.75V11.25C2 10.5596 2.55964 10 3.25 10H16.75C17.4404 10 18 10.5596 18 11.25V16.75ZM8.36964 10.9315C8.20304 10.8407 8 10.9612 8 11.151V16.8396C8 17.0292 8.20277 17.1498 8.36935 17.0593L13.5963 14.2193C13.7704 14.1248 13.7705 13.8749 13.5966 13.7801L8.36964 10.9315Z" fill="#000000"/>
</svg>



      ),
      path: '/catalog',
    },
    {
      id: 'manga',
      label: 'Манга',
      icon: (
<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 6C12 6 10.5 4 7 4C3.5 4 2 6 2 6V20C2 20 3.5 19 7 19C10.5 19 12 20 12 20M12 6V20M12 6C12 6 13.5 4 17 4C20.5 4 22 6 22 6V20C22 20 20.5 19 17 19C13.5 19 12 20 12 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

      ),
      path: '/manga',
    },
    {
      id: 'account',
      label: 'Аккаунт',
      icon: (
<svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.1333 9.05832C10.0499 9.04999 9.94993 9.04999 9.85826 9.05832C7.87493 8.99166 6.29993 7.36666 6.29993 5.36666C6.29993 3.32499 7.94993 1.66666 9.99993 1.66666C12.0416 1.66666 13.6999 3.32499 13.6999 5.36666C13.6916 7.36666 12.1166 8.99166 10.1333 9.05832Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M5.96672 12.1333C3.95006 13.4833 3.95006 15.6833 5.96672 17.025C8.25839 18.5583 12.0167 18.5583 14.3084 17.025C16.3251 15.675 16.3251 13.475 14.3084 12.1333C12.0251 10.6083 8.26672 10.6083 5.96672 12.1333Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

      ),
      path: '/account',
    },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="menu">
      <div className="menu__background">
        <svg
          className="menu__wave"
          viewBox="0 0 375 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,0 L 0,90 L 375,90 L 375,0
               L 235,0
               Q 230,0 225,2
               Q 215,5 205,12
               Q 195,10 187.5,10
               Q 180,10 170,12
               Q 160,5 150,2
               Q 145,0 140,0
               L 0,0 Z"
            fill="#171717"
          />
          <path
            d="M 0,0 L 140,0
               Q 145,0 150,2
               Q 160,5 170,12
               Q 180,10 187.5,10
               Q 195,10 205,12
               Q 215,5 225,2
               Q 230,0 235,0
               L 375,0"
            stroke="#272727"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <div className="menu__container">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu__item ${isActive(item.path) ? 'menu__item--active' : ''}`}
            onClick={() => handleNavigation(item.path)}
            aria-label={item.label}
          >
            <div className="menu__icon">{item.icon}</div>
            <span className="menu__label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>

  );
};

export default Menu;
