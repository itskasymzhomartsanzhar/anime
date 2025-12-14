import axios from "axios";
import ENDPOINTS from "./endpoints";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/v1/";

const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";
const MOCK_USER = {
  id: 1,
  telegram_id: 123456789,
  username: "dev_user",
  first_name: "Dev",
  last_name: "User",
  photo_url: "https://via.placeholder.com/150",
  is_premium: true,
};

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

const setTokens = (access, refresh) => {
  localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

client.interceptors.request.use((config) => {
  if (DEV_MODE) {
    return config;
  }

  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (DEV_MODE) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/token/refresh/")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        setTokens(data.access, data.refresh);
        client.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        processQueue(null, data.access);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return client(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const auth = {
  telegram: async (initData) => {
    if (DEV_MODE) {
      console.log("🔧 DEV MODE: Моковая авторизация");
      setTokens("dev_access_token", "dev_refresh_token");
      return {
        access_token: "dev_access_token",
        refresh_token: "dev_refresh_token",
        user: MOCK_USER,
      };
    }
    const { data } = await client.post(ENDPOINTS.auth.telegram, { init_data: initData });
    setTokens(data.access_token, data.refresh_token);t
    return data;
  },

  me: async () => {
    if (DEV_MODE) {
      console.log("🔧 DEV MODE: Возвращаем мокового пользователя");
      return MOCK_USER;
    }

    const { data } = await client.get(ENDPOINTS.auth.me);
    return data;
  },

  update: async (userData) => {
    if (DEV_MODE) {
      console.log("🔧 DEV MODE: Моковое обновление профиля", userData);
      return { ...MOCK_USER, ...userData };
    }

    const { data } = await client.patch(ENDPOINTS.auth.update, userData);
    return data;
  },

  refresh: async () => {
    if (DEV_MODE) {
      console.log("🔧 DEV MODE: Моковое обновление токена");
      return {
        access: "dev_access_token",
        refresh: "dev_refresh_token",
      };
    }

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token");

    const { data } = await client.post(ENDPOINTS.auth.refresh, { refresh: refreshToken });
    setTokens(data.access, data.refresh);
    return data;
  },

  logout: () => {
    clearTokens();
    window.dispatchEvent(new CustomEvent("auth:logout"));
  },

  isAuthenticated: () => {
    if (DEV_MODE) return true;
    return !!localStorage.getItem("access_token");
  },
};
const createAPI = (endpoints) => {
  const methods = {};

  Object.entries(endpoints).forEach(([key, endpoint]) => {
    if (typeof endpoint === "object" && !Array.isArray(endpoint)) {
      methods[key] = createAPI(endpoint);
    }
    else {
      methods[key] = async (...args) => {
        const url = typeof endpoint === "function" ? endpoint(...args) : endpoint;
        const { data } = await client.get(url);
        return data;
      };
    }
  });

  if (endpoints.list) {
    methods.list = async (params) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      const { data } = await client.get(`${endpoints.list}${query}`);
      return data;
    };
  }

  if (endpoints.create) {
    methods.create = async (body) => {
      const { data } = await client.post(endpoints.create, body);
      return data;
    };
  }

  if (endpoints.update) {
    methods.update = async (id, body) => {
      const url = typeof endpoints.update === "function" ? endpoints.update(id) : endpoints.update;
      const { data } = await client.patch(url, body);
      return data;
    };
  }

  if (endpoints.delete) {
    methods.delete = async (id) => {
      const url = typeof endpoints.delete === "function" ? endpoints.delete(id) : endpoints.delete;
      const { data } = await client.delete(url);
      return data;
    };
  }

  if (endpoints.detail) {
    methods.detail = async (id) => {
      const url = typeof endpoints.detail === "function" ? endpoints.detail(id) : endpoints.detail;
      const { data } = await client.get(url);
      return data;
    };
  }

  return methods;
};

export const api = createAPI(ENDPOINTS);

export const request = {
  get: async (url, params) => {
    const { data } = await client.get(url, { params });
    return data;
  },
  post: async (url, body) => {
    const { data } = await client.post(url, body);
    return data;
  },
  patch: async (url, body) => {
    const { data } = await client.patch(url, body);
    return data;
  },
  put: async (url, body) => {
    const { data } = await client.put(url, body);
    return data;
  },
  delete: async (url) => {
    const { data } = await client.delete(url);
    return data;
  },
};
