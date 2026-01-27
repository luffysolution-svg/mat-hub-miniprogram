const config = require('../../config/index');

Page({
  data: {
    tools: [
      {
        id: 'periodic-table',
        title: '元素周期表',
        desc: '交互式元素周期表，详细元素信息',
        icon: '⚛️',
        color: '#3498db',
        path: '/pages/periodic-table/periodic-table'
      },
      {
        id: 'molar-mass',
        title: '分子质量计算',
        desc: '快速计算化学式的摩尔质量',
        icon: '⚗️',
        color: '#9b59b6',
        path: '/pages/calculator/calculator?type=molar_mass'
      },
      {
        id: 'solution',
        title: '溶液配制计算',
        desc: '溶液稀释与浓度计算',
        icon: '🧪',
        color: '#2ecc71',
        path: '/pages/calculator/calculator?type=solution'
      },
      {
        id: 'concentration',
        title: '浓度转换',
        desc: '各种浓度单位相互转换',
        icon: '📊',
        color: '#f39c12',
        path: '/pages/calculator/calculator?type=concentration'
      },
      {
        id: 'unit',
        title: '单位转换',
        desc: '长度、质量、温度等单位转换',
        icon: '📏',
        color: '#e74c3c',
        path: '/pages/calculator/calculator?type=unit'
      },
      {
        id: 'journal',
        title: '期刊订阅',
        desc: '订阅期刊，获取最新文献推送',
        icon: '📚',
        color: '#1abc9c',
        path: '/pages/journal/journal'
      }
    ],
    stats: {
      toolCount: 6,
      favoriteCount: 0
    }
  },

  onLoad() {
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  loadStats() {
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({
      'stats.favoriteCount': favorites.length
    });
  },

  navigateTo(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({
      url: path
    });
  }
});
