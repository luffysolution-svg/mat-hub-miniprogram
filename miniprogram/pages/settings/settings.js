const storage = require('../../utils/storage');
const config = require('../../config/index');

Page({
  data: {
    materialSources: config.SOURCES.material,
    literatureSources: config.SOURCES.literature,
    enabledSources: {},

    cacheSize: '0 KB',
    historyCount: 0,
    favoritesCount: 0,

    version: '1.0.0',
    apiStatus: 'checking'
  },

  onShow() {
    this.loadSettings();
    this.loadCacheInfo();
    this.checkApiStatus();
  },

  loadSettings() {
    const settings = storage.getSettings();
    const allSources = [
      ...config.SOURCES.material.map(s => s.id),
      ...config.SOURCES.literature.map(s => s.id)
    ];

    const enabledSources = {};
    allSources.forEach(id => {
      enabledSources[id] = settings.enabledSources
        ? settings.enabledSources[id] !== false
        : true;
    });

    this.setData({ enabledSources });
  },

  async loadCacheInfo() {
    const info = await storage.getCacheInfo();
    const sizeKB = (info.currentSize || 0).toFixed(1);

    this.setData({
      cacheSize: sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`,
      historyCount: storage.getSearchHistory().length + storage.getViewHistory().length,
      favoritesCount: storage.getFavorites().length
    });
  },

  checkApiStatus() {
    this.setData({ apiStatus: 'checking' });

    const request = require('../../utils/request');
    request.get('/api/search', { q: 'test', page_size: 1 }, { silent: true })
      .then(() => {
        this.setData({ apiStatus: 'online' });
      })
      .catch(() => {
        this.setData({ apiStatus: 'offline' });
      });
  },

  onSourceToggle(e) {
    const { source } = e.currentTarget.dataset;
    const enabledSources = { ...this.data.enabledSources };
    enabledSources[source] = !enabledSources[source];

    this.setData({ enabledSources });
    storage.updateSettings({ enabledSources });
  },

  enableAllSources() {
    const enabledSources = {};
    [...config.SOURCES.material, ...config.SOURCES.literature].forEach(s => {
      enabledSources[s.id] = true;
    });

    this.setData({ enabledSources });
    storage.updateSettings({ enabledSources });
    wx.showToast({ title: 'All enabled', icon: 'success' });
  },

  clearCache() {
    wx.showModal({
      title: 'Clear Cache',
      content: 'This will clear history and cache. Favorites will be preserved.',
      success: (res) => {
        if (res.confirm) {
          storage.clearSearchHistory();
          storage.clearViewHistory();
          this.loadCacheInfo();
          wx.showToast({ title: 'Cache cleared', icon: 'success' });
        }
      }
    });
  },

  clearAll() {
    wx.showModal({
      title: 'Clear All Data',
      content: 'This will clear all data including favorites. This cannot be undone.',
      success: (res) => {
        if (res.confirm) {
          storage.clearAll();
          this.loadSettings();
          this.loadCacheInfo();
          wx.showToast({ title: 'All data cleared', icon: 'success' });
        }
      }
    });
  },

  showAbout() {
    wx.showModal({
      title: 'Mat-Hub',
      content: 'Materials Chemistry Research Assistant\n\nVersion: 1.0.0\n\nAccess materials data and literature from 9 sources.',
      showCancel: false
    });
  },

  copyApiUrl() {
    const util = require('../../utils/util');
    util.copyToClipboard(config.BASE_URL);
  }
});
