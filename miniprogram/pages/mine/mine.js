const config = require('../../config/index');

Page({
  data: {
    userInfo: {
      nickname: '科研人',
      avatar: '👨‍🔬'
    },

    stats: {
      elementFavorites: 0,
      paperFavorites: 0,
      calcHistory: 0,
      subscriptions: 0
    },

    menuItems: [
      {
        icon: '⚛️',
        title: '收藏的元素',
        desc: '查看收藏的化学元素',
        key: 'elements',
        color: '#3498db'
      },
      {
        icon: '📄',
        title: '收藏的文献',
        desc: '查看收藏的文献',
        key: 'papers',
        color: '#1abc9c'
      },
      {
        icon: '📝',
        title: '计算历史',
        desc: '查看计算记录',
        key: 'history',
        color: '#9b59b6'
      },
      {
        icon: '🗑️',
        title: '清除缓存',
        desc: '清理本地数据',
        key: 'clear',
        color: '#e74c3c'
      }
    ],

    version: config.VERSION,
    appName: config.APP_NAME
  },

  onLoad() {
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  // 加载统计数据
  loadStats() {
    const elementFavorites = wx.getStorageSync('element_favorites') || [];
    const paperFavorites = wx.getStorageSync('paper_favorites') || [];
    const calcHistory = wx.getStorageSync('calc_history') || [];
    const subscriptions = wx.getStorageSync('journal_subscriptions') || [];

    this.setData({
      'stats.elementFavorites': elementFavorites.length,
      'stats.paperFavorites': paperFavorites.length,
      'stats.calcHistory': calcHistory.length,
      'stats.subscriptions': subscriptions.length
    });
  },

  // 菜单点击
  onMenuClick(e) {
    const { key } = e.currentTarget.dataset;

    switch (key) {
      case 'elements':
        this.viewElementFavorites();
        break;
      case 'papers':
        this.viewPaperFavorites();
        break;
      case 'history':
        this.viewCalcHistory();
        break;
      case 'clear':
        this.clearCache();
        break;
    }
  },

  // 查看收藏的元素
  viewElementFavorites() {
    const favorites = wx.getStorageSync('element_favorites') || [];

    if (favorites.length === 0) {
      wx.showToast({ title: '还没有收藏', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '收藏的元素',
      content: favorites.map(el => `${el.symbol} - ${el.name}`).join('\n'),
      showCancel: false
    });
  },

  // 查看收藏的文献
  viewPaperFavorites() {
    const favorites = wx.getStorageSync('paper_favorites') || [];

    if (favorites.length === 0) {
      wx.showToast({ title: '还没有收藏', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '收藏的文献',
      content: `共收藏了 ${favorites.length} 篇文献`,
      showCancel: false
    });
  },

  // 查看计算历史
  viewCalcHistory() {
    const history = wx.getStorageSync('calc_history') || [];

    if (history.length === 0) {
      wx.showToast({ title: '暂无历史记录', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '计算历史',
      content: `共有 ${history.length} 条计算记录`,
      showCancel: false
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有本地数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.loadStats();
          wx.showToast({ title: '清除成功', icon: 'success' });
        }
      }
    });
  },

  // 关于我们
  showAbout() {
    wx.showModal({
      title: '关于',
      content: `${this.data.appName}\n版本: ${this.data.version}\n\n专为材料与化学研究者设计的科研工具箱\n\n纯前端实现，数据存储在本地`,
      showCancel: false
    });
  },

  // 反馈建议
  showFeedback() {
    wx.showToast({
      title: '感谢您的反馈',
      icon: 'none'
    });
  }
});
