import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Game API
export const gameAPI = {
  saveGame: (gameData) => api.post('/game/save', gameData),
  getUserGames: (userId) => api.get(`/game/user/${userId}`),
};

// Leaderboard API
export const leaderboardAPI = {
  getTop5: () => api.get('/leaderboard/top5'),
  getUserStats: (userId) => api.get(`/leaderboard/user/${userId}`),
};

export default api;
