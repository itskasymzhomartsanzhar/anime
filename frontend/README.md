# AniUltra Frontend

React приложение для просмотра аниме в Telegram Mini App.

---

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Режим разработки (БЕЗ бэкенда)

```bash
# Создайте файл .env.development
echo "VITE_DEV_MODE=true" > .env.development

# Запустите dev сервер
npm run dev
```

Теперь можно разрабатывать UI без запуска Django!

### 3. Режим продакшн (С бэкендом)

```bash
# Создайте файл .env.production
echo "VITE_DEV_MODE=false" > .env.production
echo "VITE_API_URL=http://127.0.0.1:8000" >> .env.production

# Соберите проект
npm run build
```

---

## 📚 Документация

- **[КАК_ИСПОЛЬЗОВАТЬ_API.md](КАК_ИСПОЛЬЗОВАТЬ_API.md)** - Как делать запросы к API в компонентах
- **[РЕЖИМ_РАЗРАБОТКИ.md](РЕЖИМ_РАЗРАБОТКИ.md)** - Как работать без бэкенда
- **[API_README.md](API_README.md)** - Структура API

---

## 🔧 Режим разработки (DEV MODE)

DEV MODE позволяет разрабатывать UI без запущенного бэкенда. Все запросы авторизации автоматически мокаются.

### Включить DEV MODE:

Создайте файл `.env.development`:

```env
VITE_DEV_MODE=true
VITE_API_URL=http://127.0.0.1:8000
```

Перезапустите `npm run dev`.

### Что работает в DEV MODE:

```javascript
import { auth } from './utils/api';

// Всегда успешная авторизация
await auth.telegram(initData);

// Всегда возвращает тестового пользователя
const user = await auth.me();
// {
//   id: 1,
//   telegram_id: 123456789,
//   username: "dev_user",
//   first_name: "Dev",
//   last_name: "User",
//   is_premium: true
// }

// Всегда авторизован
auth.isAuthenticated(); // true
```

В консоли будут сообщения: `🔧 DEV MODE: Моковая авторизация`

**Читайте подробнее:** [РЕЖИМ_РАЗРАБОТКИ.md](РЕЖИМ_РАЗРАБОТКИ.md)

---

## 📖 Использование API в компонентах

### Один импорт:

```javascript
import { auth, api } from './utils/api';
```

### Примеры:

```javascript
// Авторизация
await auth.telegram(initData);
const user = await auth.me();

// Список аниме
const animes = await api.anime.list();
const anime = await api.anime.detail(1);

// Избранное
await api.favorites.create({ anime_id: 1 });
const favorites = await api.favorites.list();

// Эпизоды
const episodes = await api.episodes.list(animeId);
await api.episodes.watch(animeId, episodeId);
```

**Полное руководство:** [КАК_ИСПОЛЬЗОВАТЬ_API.md](КАК_ИСПОЛЬЗОВАТЬ_API.md)

---

## 🛠️ Команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Превью сборки
npm run preview

# Линтер
npm run lint
```

---

## 📁 Структура

```
frontend/
├── src/
│   ├── utils/
│   │   ├── api.js         # API + авторизация (ВСЁ в одном файле)
│   │   └── endpoints.js   # URL адреса эндпоинтов
│   ├── contexts/
│   │   └── AuthContext.jsx  # React контекст авторизации
│   ├── components/        # React компоненты
│   ├── pages/            # Страницы приложения
│   ├── App.jsx           # Главный компонент
│   └── main.jsx          # Точка входа
├── .env.development      # Настройки разработки (DEV MODE)
├── .env.production       # Настройки продакшна
└── package.json
```

---

## ⚙️ Настройки окружения

### `.env.development` (разработка)

```env
VITE_DEV_MODE=true
VITE_API_URL=http://127.0.0.1:8000
```

### `.env.production` (продакшн)

```env
VITE_DEV_MODE=false
VITE_API_URL=https://your-production-api.com
```

---

## 📋 Чек-лист перед деплоем

- [ ] `VITE_DEV_MODE=false` в `.env.production`
- [ ] Указан правильный `VITE_API_URL`
- [ ] Проверена авторизация с реальным Telegram
- [ ] Запущены тесты (`npm run lint`)
- [ ] Создана сборка (`npm run build`)

---

## 🎯 Технологии

- **React 18** - UI библиотека
- **Vite** - Сборщик
- **Axios** - HTTP клиент
- **SCSS** - Стили
- **Telegram Web App** - Интеграция с Telegram

---

## 🤝 Разработка

### Добавить новый API эндпоинт:

1. Добавьте URL в [utils/endpoints.js](src/utils/endpoints.js):

```javascript
export default {
  myNewAPI: {
    list: "/api/my-new-api/",
    detail: (id) => `/api/my-new-api/${id}/`,
  }
};
```

2. Используйте в компоненте:

```javascript
import { api } from './utils/api';

const data = await api.myNewAPI.list();
const item = await api.myNewAPI.detail(1);
```

Методы создаются автоматически! 🎉

---

## 💡 Полезные ссылки

- [Документация React](https://react.dev/)
- [Документация Vite](https://vitejs.dev/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Axios документация](https://axios-http.com/)

---

## 📝 Лицензия

MIT

---

## 🚀 Начните прямо сейчас!

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) и начинайте разработку! 🎉
