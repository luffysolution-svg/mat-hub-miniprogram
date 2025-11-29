const storage = require('../../utils/storage');
const util = require('../../utils/util');

Page({
  data: {
    activeTab: 'search',
    searchHistory: [],
    viewHistory: [],
    editing: false
  },

  onShow() {
    this.loadHistory();
  },

  loadHistory() {
    this.setData({
      searchHistory: storage.getSearchHistory().map(item => ({
        ...item,
        timeAgo: util.formatDate(item.timestamp)
      })),
      viewHistory: storage.getViewHistory().map(item => ({
        ...item,
        timeAgo: util.formatDate(item.timestamp),
        sourceName: util.getSourceShort(item.source)
      }))
    });
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab, editing: false });
  },

  toggleEdit() {
    this.setData({ editing: !this.data.editing });
  },

  onSearchHistoryTap(e) {
    if (this.data.editing) return;

    const { index } = e.currentTarget.dataset;
    const item = this.data.searchHistory[index];

    wx.switchTab({
      url: '/pages/index/index',
      success: () => {
        const pages = getCurrentPages();
        const indexPage = pages.find(p => p.route === 'pages/index/index');
        if (indexPage) {
          indexPage.setData({
            query: item.query,
            queryType: item.type || 'all',
            selectedSources: item.sources || []
          });
        }
      }
    });
  },

  onViewHistoryTap(e) {
    if (this.data.editing) return;

    const { index } = e.currentTarget.dataset;
    const item = this.data.viewHistory[index];

    wx.navigateTo({
      url: `/pages/detail/detail?id=${encodeURIComponent(item.id)}&source=${item.source}&type=${item.type}`
    });
  },

  deleteSearchItem(e) {
    const { index } = e.currentTarget.dataset;
    storage.removeSearchHistory(index);
    this.loadHistory();
  },

  clearSearchHistory() {
    wx.showModal({
      title: 'Clear History',
      content: 'Remove all search history?',
      success: (res) => {
        if (res.confirm) {
          storage.clearSearchHistory();
          this.loadHistory();
          wx.showToast({ title: 'Cleared', icon: 'success' });
        }
      }
    });
  },

  clearViewHistory() {
    wx.showModal({
      title: 'Clear History',
      content: 'Remove all viewed items?',
      success: (res) => {
        if (res.confirm) {
          storage.clearViewHistory();
          this.loadHistory();
          wx.showToast({ title: 'Cleared', icon: 'success' });
        }
      }
    });
  }
});
