const searchService = require('../../services/search');
const storage = require('../../utils/storage');
const config = require('../../config/index');

Page({
  data: {
    query: '',
    queryType: 'all',
    selectedSources: [],
    sortBy: 'relevance',
    filters: {},

    results: [],
    total: 0,
    page: 1,
    pageSize: config.PAGE_SIZE,
    hasMore: false,
    failedSources: [],

    loading: false,
    loadingMore: false,
    searched: false,
    showFilters: false,
    showBackTop: false,
    scrollTop: 0
  },

  onLoad() {
    const settings = storage.getSettings();
    if (settings.defaultQueryType) {
      this.setData({ queryType: settings.defaultQueryType });
    }
  },

  onShow() {
    // Refresh favorite states
    if (this.data.results.length > 0) {
      this.setData({ results: [...this.data.results] });
    }
  },

  onPullDownRefresh() {
    if (this.data.query && this.data.searched) {
      this.setData({ page: 1 });
      this.doSearch().finally(() => {
        wx.stopPullDownRefresh();
      });
    } else {
      wx.stopPullDownRefresh();
    }
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loadingMore) {
      this.loadMore();
    }
  },

  onInput(e) {
    this.setData({ query: e.detail.value });
  },

  onSearch() {
    const { query } = this.data;
    if (!query.trim()) {
      wx.showToast({
        title: 'Enter keywords',
        icon: 'none'
      });
      return;
    }

    storage.addSearchHistory({
      query: query.trim(),
      type: this.data.queryType,
      sources: this.data.selectedSources
    });

    this.setData({
      page: 1,
      results: [],
      searched: true
    });
    this.doSearch();
  },

  onClear() {
    this.setData({
      query: '',
      results: [],
      total: 0,
      searched: false,
      hasMore: false
    });
  },

  onFilterTap() {
    this.setData({ showFilters: true });
  },

  onFilterClose() {
    this.setData({ showFilters: false });
  },

  onTypeChange(e) {
    const type = e.currentTarget?.dataset?.type || e.detail?.type;
    if (type) {
      this.setData({ queryType: type });
    }
  },

  onSortChange(e) {
    this.setData({ sortBy: e.detail.sort });
  },

  onSourceChange(e) {
    this.setData({ selectedSources: e.detail.sources });
  },

  onFilterChange(e) {
    this.setData({ filters: e.detail.filters });
  },

  onFilterReset() {
    this.setData({
      queryType: 'all',
      selectedSources: [],
      sortBy: 'relevance',
      filters: {}
    });
  },

  onFilterApply() {
    this.setData({ showFilters: false });
    if (this.data.query.trim()) {
      this.setData({ page: 1, results: [] });
      this.doSearch();
    }
  },

  async doSearch() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      const res = await searchService.search({
        query: this.data.query,
        queryType: this.data.queryType,
        sources: this.data.selectedSources,
        sortBy: this.data.sortBy,
        filters: this.data.filters,
        page: this.data.page,
        pageSize: this.data.pageSize
      });

      this.setData({
        results: res.items || [],
        total: res.total || 0,
        failedSources: res.failed_sources || [],
        hasMore: (res.items || []).length >= this.data.pageSize
      });
    } catch (err) {
      console.error('Search failed:', err);
      wx.showToast({
        title: 'Search failed',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  async loadMore() {
    if (this.data.loadingMore || !this.data.hasMore) return;

    this.setData({
      loadingMore: true,
      page: this.data.page + 1
    });

    try {
      const res = await searchService.search({
        query: this.data.query,
        queryType: this.data.queryType,
        sources: this.data.selectedSources,
        sortBy: this.data.sortBy,
        filters: this.data.filters,
        page: this.data.page,
        pageSize: this.data.pageSize
      });

      const newResults = res.items || [];
      this.setData({
        results: [...this.data.results, ...newResults],
        hasMore: newResults.length >= this.data.pageSize
      });
    } catch (err) {
      console.error('Load more failed:', err);
      this.setData({ page: this.data.page - 1 });
    } finally {
      this.setData({ loadingMore: false });
    }
  },

  onResultTap(e) {
    const { id, source, type } = e.detail;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${encodeURIComponent(id)}&source=${source}&type=${type}`
    });
  },

  onFavoriteChange(e) {
    // Favorite state is handled in the component
  },

  onExampleTap(e) {
    const query = e.currentTarget.dataset.query;
    if (query) {
      this.setData({ query });
      this.onSearch();
    }
  },

  onPageScroll(e) {
    const scrollTop = e.detail.scrollTop;
    const showBackTop = scrollTop > 500;

    if (showBackTop !== this.data.showBackTop) {
      this.setData({ showBackTop });
    }
  },

  scrollToTop() {
    this.setData({ scrollTop: 0 });
  }
});
