App({
  globalData: {
    apiReady: false,
    enabledSources: null
  },

  onLaunch() {
    this.initSettings();
    this.checkApi();
  },

  initSettings() {
    const storage = require('./utils/storage');
    const settings = storage.getSettings();
    this.globalData.enabledSources = settings.enabledSources || null;
  },

  checkApi() {
    const request = require('./utils/request');
    request.get('/api/search', { q: 'test', page_size: 1 })
      .then(() => {
        this.globalData.apiReady = true;
      })
      .catch(() => {
        this.globalData.apiReady = false;
      });
  }
});
