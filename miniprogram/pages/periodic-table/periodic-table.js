const { ELEMENTS, CATEGORY_COLORS, getCategoryName } = require('../../data/elements');
const config = require('../../config/index');

Page({
  data: {
    elements: ELEMENTS,
    filteredElements: ELEMENTS,
    categories: config.ELEMENT_CATEGORIES,
    selectedCategory: 'all',
    searchQuery: '',
    showModal: false,
    selectedElement: null,
    categoryColors: CATEGORY_COLORS,
    // 周期表布局（主表格）
    mainTable: [],
    // 镧系和锕系
    lanthanides: [],
    actinides: []
  },

  onLoad() {
    this.initPeriodicTable();
  },

  // 初始化周期表布局
  initPeriodicTable() {
    const mainTable = [];
    const lanthanides = [];
    const actinides = [];

    ELEMENTS.forEach(element => {
      if (element.category === 'lanthanide') {
        lanthanides.push(element);
      } else if (element.category === 'actinide') {
        actinides.push(element);
      } else {
        mainTable.push(element);
      }
    });

    this.setData({
      mainTable,
      lanthanides: lanthanides.sort((a, b) => a.atomicNumber - b.atomicNumber),
      actinides: actinides.sort((a, b) => a.atomicNumber - b.atomicNumber)
    });
  },

  // 过滤元素
  filterByCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ selectedCategory: category });

    if (category === 'all') {
      this.setData({ filteredElements: ELEMENTS });
    } else {
      const filtered = ELEMENTS.filter(el => el.category === category);
      this.setData({ filteredElements: filtered });
    }
  },

  // 搜索元素
  onSearch(e) {
    const query = e.detail.value.toLowerCase();
    this.setData({ searchQuery: query });

    if (!query) {
      this.setData({ filteredElements: ELEMENTS });
      return;
    }

    const filtered = ELEMENTS.filter(el =>
      el.symbol.toLowerCase().includes(query) ||
      el.name.includes(query) ||
      el.nameEn.toLowerCase().includes(query) ||
      el.atomicNumber.toString() === query
    );

    this.setData({ filteredElements: filtered });
  },

  // 清空搜索
  clearSearch() {
    this.setData({
      searchQuery: '',
      filteredElements: ELEMENTS,
      selectedCategory: 'all'
    });
  },

  // 显示元素详情
  showElementDetail(e) {
    const { number } = e.currentTarget.dataset;
    const element = ELEMENTS.find(el => el.atomicNumber === number);

    if (element) {
      this.setData({
        selectedElement: element,
        showModal: true
      });
    }
  },

  // 关闭弹窗
  closeModal() {
    this.setData({ showModal: false });
  },

  // 收藏元素
  toggleFavorite() {
    const { selectedElement } = this.data;
    if (!selectedElement) return;

    let favorites = wx.getStorageSync('element_favorites') || [];
    const index = favorites.findIndex(el => el.atomicNumber === selectedElement.atomicNumber);

    if (index > -1) {
      favorites.splice(index, 1);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      favorites.push(selectedElement);
      wx.showToast({ title: '已收藏', icon: 'success' });
    }

    wx.setStorageSync('element_favorites', favorites);
  },

  // 检查是否已收藏
  isFavorite() {
    const { selectedElement } = this.data;
    if (!selectedElement) return false;

    const favorites = wx.getStorageSync('element_favorites') || [];
    return favorites.some(el => el.atomicNumber === selectedElement.atomicNumber);
  },

  // 获取元素位置
  getElementPosition(element) {
    return {
      gridRow: element.period,
      gridColumn: element.group
    };
  },

  // 获取分类颜色
  getCategoryColor(category) {
    return CATEGORY_COLORS[category] || '#95a5a6';
  }
});
