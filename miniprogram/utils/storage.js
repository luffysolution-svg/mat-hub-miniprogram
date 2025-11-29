const config = require('../config/index');

const KEYS = {
  SEARCH_HISTORY: 'mat_hub_search_history',
  VIEW_HISTORY: 'mat_hub_view_history',
  FAVORITES: 'mat_hub_favorites',
  SETTINGS: 'mat_hub_settings'
};

function safeGet(key, defaultValue = []) {
  try {
    const data = wx.getStorageSync(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    wx.setStorageSync(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  // Search History
  getSearchHistory() {
    return safeGet(KEYS.SEARCH_HISTORY, []);
  },

  addSearchHistory(item) {
    const history = this.getSearchHistory();
    const filtered = history.filter(h =>
      h.query !== item.query || h.type !== item.type
    );
    filtered.unshift({
      ...item,
      timestamp: Date.now()
    });
    const limited = filtered.slice(0, config.MAX_SEARCH_HISTORY);
    safeSet(KEYS.SEARCH_HISTORY, limited);
  },

  removeSearchHistory(index) {
    const history = this.getSearchHistory();
    history.splice(index, 1);
    safeSet(KEYS.SEARCH_HISTORY, history);
  },

  clearSearchHistory() {
    wx.removeStorageSync(KEYS.SEARCH_HISTORY);
  },

  // View History
  getViewHistory() {
    return safeGet(KEYS.VIEW_HISTORY, []);
  },

  addViewHistory(item) {
    const history = this.getViewHistory();
    const filtered = history.filter(h =>
      !(h.id === item.id && h.source === item.source)
    );
    filtered.unshift({
      id: item.id,
      source: item.source,
      type: item.type,
      title: item.title,
      timestamp: Date.now()
    });
    const limited = filtered.slice(0, config.MAX_VIEW_HISTORY);
    safeSet(KEYS.VIEW_HISTORY, limited);
  },

  clearViewHistory() {
    wx.removeStorageSync(KEYS.VIEW_HISTORY);
  },

  // Favorites
  getFavorites() {
    return safeGet(KEYS.FAVORITES, []);
  },

  addFavorite(item) {
    const favorites = this.getFavorites();
    if (!this.isFavorite(item.id, item.source)) {
      favorites.unshift({
        ...item,
        favoriteTime: Date.now()
      });
      safeSet(KEYS.FAVORITES, favorites);
    }
  },

  removeFavorite(id, source) {
    const favorites = this.getFavorites();
    const filtered = favorites.filter(f =>
      !(f.id === id && f.source === source)
    );
    safeSet(KEYS.FAVORITES, filtered);
  },

  isFavorite(id, source) {
    const favorites = this.getFavorites();
    return favorites.some(f => f.id === id && f.source === source);
  },

  clearFavorites() {
    wx.removeStorageSync(KEYS.FAVORITES);
  },

  // Settings
  getSettings() {
    return safeGet(KEYS.SETTINGS, {});
  },

  updateSettings(updates) {
    const settings = this.getSettings();
    safeSet(KEYS.SETTINGS, { ...settings, ...updates });
  },

  // Cache Info
  getCacheInfo() {
    return new Promise((resolve) => {
      wx.getStorageInfo({
        success: (res) => resolve(res),
        fail: () => resolve({ currentSize: 0, keys: [] })
      });
    });
  },

  clearAll() {
    wx.clearStorageSync();
  }
};
