// 简化的本地存储工具
// 纯前端应用，所有数据存储在本地

function safeGet(key, defaultValue = null) {
  try {
    return wx.getStorageSync(key) || defaultValue;
  } catch (e) {
    console.error('读取存储失败:', e);
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    wx.setStorageSync(key, value);
    return true;
  } catch (e) {
    console.error('写入存储失败:', e);
    return false;
  }
}

module.exports = {
  // 通用存储方法
  get(key, defaultValue = null) {
    return safeGet(key, defaultValue);
  },

  set(key, value) {
    return safeSet(key, value);
  },

  remove(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  // 缓存信息
  getCacheInfo() {
    return new Promise((resolve) => {
      wx.getStorageInfo({
        success: (res) => resolve(res),
        fail: () => resolve({ currentSize: 0, keys: [] })
      });
    });
  },

  // 清除所有缓存
  clearAll() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('清除存储失败:', e);
      return false;
    }
  }
};
