
export default {
  auth: {
    telegram: "/v1/api/auth/telegram/",
    refresh: "/v1/api/auth/token/refresh/",
    me: "/v1/api/auth/me/",
    update: "/v1/api/auth/me/update/",
  },

  anime: {
    list: "/api/anime/",
    detail: (id) => `/api/anime/${id}/`,
    create: "/api/anime/",
    update: (id) => `/api/anime/${id}/`,
    delete: (id) => `/api/anime/${id}/`,
    search: "/api/anime/search/",
    popular: "/api/anime/popular/",
    recent: "/api/anime/recent/",
  },

  episodes: {
    list: (animeId) => `/api/anime/${animeId}/episodes/`,
    detail: (animeId, episodeId) => `/api/anime/${animeId}/episodes/${episodeId}/`,
    watch: (animeId, episodeId) => `/api/anime/${animeId}/episodes/${episodeId}/watch/`,
  },

  favorites: {
    list: "/api/favorites/",
    create: "/api/favorites/",
    delete: (id) => `/api/favorites/${id}/`,
    check: (animeId) => `/api/favorites/check/${animeId}/`,
  },

  watchHistory: {
    list: "/api/watch-history/",
    create: "/api/watch-history/",
    clear: "/api/watch-history/clear/",
  },

  ratings: {
    list: (animeId) => `/api/anime/${animeId}/ratings/`,
    create: (animeId) => `/api/anime/${animeId}/ratings/`,
    update: (animeId, ratingId) => `/api/anime/${animeId}/ratings/${ratingId}/`,
    delete: (animeId, ratingId) => `/api/anime/${animeId}/ratings/${ratingId}/`,
  },

  comments: {
    list: (animeId) => `/api/anime/${animeId}/comments/`,
    create: (animeId) => `/api/anime/${animeId}/comments/`,
    update: (id) => `/api/comments/${id}/`,
    delete: (id) => `/api/comments/${id}/`,
  },

  genres: {
    list: "/api/genres/",
    detail: (id) => `/api/genres/${id}/`,
  },

  notifications: {
    list: "/api/notifications/",
    markRead: (id) => `/api/notifications/${id}/read/`,
    markAllRead: "/api/notifications/read-all/",
    delete: (id) => `/api/notifications/${id}/`,
  },

  settings: {
    list: "/api/settings/",
    update: "/api/settings/",
  },
};
