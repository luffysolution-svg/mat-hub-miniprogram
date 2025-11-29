const storage = require('../../utils/storage');
const util = require('../../utils/util');

Page({
  data: {
    favorites: [],
    filteredFavorites: [],
    filterType: 'all',
    searchQuery: '',
    editing: false
  },

  onShow() {
    this.loadFavorites();
  },

  loadFavorites() {
    const favorites = storage.getFavorites().map(item => ({
      ...item,
      formattedAuthors: util.formatAuthors(item.authors, 2),
      sourceName: util.getSourceShort(item.source),
      timeAgo: util.formatDate(item.favoriteTime)
    }));

    this.setData({ favorites });
    this.filterFavorites();
  },

  filterFavorites() {
    let filtered = [...this.data.favorites];

    if (this.data.filterType !== 'all') {
      filtered = filtered.filter(item => item.type === this.data.filterType);
    }

    if (this.data.searchQuery.trim()) {
      const query = this.data.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        (item.authors && item.authors.some(a => a.toLowerCase().includes(query)))
      );
    }

    this.setData({ filteredFavorites: filtered });
  },

  onFilterChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    this.filterFavorites();
  },

  onSearchInput(e) {
    this.setData({ searchQuery: e.detail.value });
    this.filterFavorites();
  },

  onClearSearch() {
    this.setData({ searchQuery: '' });
    this.filterFavorites();
  },

  toggleEdit() {
    this.setData({ editing: !this.data.editing });
  },

  onItemTap(e) {
    if (this.data.editing) return;

    const { index } = e.currentTarget.dataset;
    const item = this.data.filteredFavorites[index];

    wx.navigateTo({
      url: `/pages/detail/detail?id=${encodeURIComponent(item.id)}&source=${item.source}&type=${item.type}`
    });
  },

  onRemove(e) {
    const { index } = e.currentTarget.dataset;
    const item = this.data.filteredFavorites[index];

    wx.showModal({
      title: 'Remove Favorite',
      content: 'Remove this item from favorites?',
      success: (res) => {
        if (res.confirm) {
          storage.removeFavorite(item.id, item.source);
          this.loadFavorites();
          wx.showToast({ title: 'Removed', icon: 'success' });
        }
      }
    });
  },

  clearAll() {
    wx.showModal({
      title: 'Clear Favorites',
      content: 'Remove all favorites? This cannot be undone.',
      success: (res) => {
        if (res.confirm) {
          storage.clearFavorites();
          this.loadFavorites();
          wx.showToast({ title: 'Cleared', icon: 'success' });
        }
      }
    });
  },

  exportAll() {
    const { favorites } = this.data;
    if (favorites.length === 0) {
      wx.showToast({ title: 'No favorites', icon: 'none' });
      return;
    }

    const content = favorites.map(item => {
      let entry = `Title: ${item.title}\n`;
      if (item.authors) entry += `Authors: ${item.authors.join(', ')}\n`;
      if (item.journal) entry += `Journal: ${item.journal}\n`;
      if (item.year) entry += `Year: ${item.year}\n`;
      if (item.doi) entry += `DOI: ${item.doi}\n`;
      entry += `Source: ${item.source}\n`;
      return entry;
    }).join('\n---\n\n');

    util.copyToClipboard(content);
  }
});
