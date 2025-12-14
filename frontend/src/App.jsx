import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Catalog from './pages/Catalog/Catalog';
import AnimeDetail from './pages/AnimeDetail/AnimeDetail';
import Watch from './pages/Watch/Watch';
import Manga from './pages/Manga/Manga';
import Account from './pages/Account/Account';

function App() {
  /*const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Ошибка авторизации</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-error">
        <h2>Не авторизован</h2>
        <p>Откройте приложение через Telegram</p>
      </div>
    );
  }
*/
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/schedule" element={<div>Schedule Page</div>} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/watch/:id/:episodeId" element={<Watch />} />
          <Route path="/manga" element={<Manga />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
