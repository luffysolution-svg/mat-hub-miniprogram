const config = require('./config/index');

App({
  globalData: {
    appName: config.APP_NAME,
    version: config.VERSION
  },

  onLaunch() {
    console.log('科研工具箱启动', this.globalData.version);
    this.checkStorage();
  },

  // 检查本地存储状态
  checkStorage() {
    try {
      const res = wx.getStorageInfoSync();
      console.log('本地存储:', res);
    } catch (e) {
      console.error('读取存储失败:', e);
    }
  }
});
