// pages/tools/tools.js
const request = require('../../utils/request');

// 元素分类颜色映射
const CATEGORY_COLORS = {
  'alkali metal': '#ff6b6b',
  'alkaline earth metal': '#ffd93d',
  'transition metal': '#6bcb77',
  'post-transition metal': '#4d96ff',
  'metalloid': '#9d65c9',
  'polyatomic nonmetal': '#ff9a3c',
  'diatomic nonmetal': '#ff6f91',
  'noble gas': '#00d9ff',
  'lanthanide': '#ff85a2',
  'actinide': '#c9b1ff',
  'unknown': '#8d8d8d'
};

// 常用化学式
const QUICK_FORMULAS = [
  { formula: 'H2O', name: '水' },
  { formula: 'NaCl', name: '氯化钠' },
  { formula: 'H2SO4', name: '硫酸' },
  { formula: 'HCl', name: '盐酸' },
  { formula: 'NaOH', name: '氢氧化钠' },
  { formula: 'CaCO3', name: '碳酸钙' },
  { formula: 'C6H12O6', name: '葡萄糖' },
  { formula: 'CuSO4·5H2O', name: '胆矾' },
  { formula: 'Ca(OH)2', name: '氢氧化钙' },
  { formula: 'NH3', name: '氨' },
  { formula: 'CO2', name: '二氧化碳' },
  { formula: 'Fe2O3', name: '氧化铁' }
];

Page({
  data: {
    activeTab: 'periodic',
    // 元素周期表数据
    elements: [],
    filteredElements: [],
    categories: [],
    selectedCategory: '',
    searchQuery: '',
    lanthanides: [],
    actinides: [],
    // 分子质量计算
    formula: '',
    calcResult: null,
    calcHistory: [],
    quickFormulas: QUICK_FORMULAS,
    // 元素详情弹窗
    showModal: false,
    selectedElement: null,
    // 元素位置映射
    elementPositionMap: {}
  },

  onLoad() {
    this.loadCategories();
    this.loadElements();
    this.loadCalcHistory();
  },

  onShow() {
    // 页面显示时刷新
  },

  // 切换Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 加载分类
  async loadCategories() {
    try {
      const res = await request.get('/api/chemistry/categories');
      this.setData({ categories: res.categories || [] });
    } catch (err) {
      console.error('加载分类失败:', err);
    }
  },

  // 加载所有元素
  async loadElements() {
    try {
      wx.showLoading({ title: '加载中...' });
      const res = await request.get('/api/chemistry/elements');
      const elements = res.elements || [];

      // 分离镧系和锕系元素
      const lanthanides = elements.filter(el => el.category === 'lanthanide');
      const actinides = elements.filter(el => el.category === 'actinide');

      // 构建位置映射
      const positionMap = {};
      elements.forEach(el => {
        // 镧系和锕系特殊处理
        if (el.category !== 'lanthanide' && el.category !== 'actinide') {
          const key = `${el.period}-${el.group}`;
          positionMap[key] = el;
        }
      });

      this.setData({
        elements,
        filteredElements: elements,
        lanthanides,
        actinides,
        elementPositionMap: positionMap
      });

      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      console.error('加载元素失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 获取指定位置的元素
  getElementAtPosition(period, group) {
    const key = `${period}-${group}`;
    return this.data.elementPositionMap[key] || null;
  },

  // 获取元素颜色
  getElementColor(category) {
    return CATEGORY_COLORS[category] || '#8d8d8d';
  },

  // 选择分类
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ selectedCategory: category });
    this.filterElements();
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({ searchQuery: e.detail.value });
  },

  // 执行搜索
  doSearch() {
    this.filterElements();
  },

  // 筛选元素
  async filterElements() {
    const { selectedCategory, searchQuery, elements } = this.data;

    if (!selectedCategory && !searchQuery) {
      this.setData({ filteredElements: elements });
      return;
    }

    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const res = await request.get('/api/chemistry/elements', params);
      this.setData({ filteredElements: res.elements || [] });
    } catch (err) {
      console.error('筛选失败:', err);
    }
  },

  // 显示元素详情
  showElementDetail(e) {
    const element = e.currentTarget.dataset.element;
    if (!element) return;

    this.setData({
      showModal: true,
      selectedElement: element
    });
  },

  // 关闭弹窗
  closeModal() {
    this.setData({
      showModal: false,
      selectedElement: null
    });
  },

  // 化学式输入
  onFormulaInput(e) {
    this.setData({ formula: e.detail.value });
  },

  // 计算分子质量
  async calculateMolarMass() {
    const { formula } = this.data;
    if (!formula.trim()) {
      wx.showToast({ title: '请输入化学式', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '计算中...' });
      const res = await request.get('/api/chemistry/molar-mass', {
        formula: formula.trim(),
        precision: 4
      });

      this.setData({ calcResult: res });
      this.addToHistory(res);
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: err.message || '计算失败',
        icon: 'none'
      });
    }
  },

  // 添加到历史记录
  addToHistory(result) {
    let history = this.data.calcHistory;
    // 避免重复
    history = history.filter(h => h.formula !== result.formula);
    history.unshift({
      formula: result.formula,
      molar_mass_formatted: result.molar_mass_formatted
    });
    // 最多保留20条
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    this.setData({ calcHistory: history });
    this.saveCalcHistory(history);
  },

  // 保存历史到本地
  saveCalcHistory(history) {
    try {
      wx.setStorageSync('calc_history', history);
    } catch (e) {
      console.error('保存历史失败:', e);
    }
  },

  // 加载历史记录
  loadCalcHistory() {
    try {
      const history = wx.getStorageSync('calc_history') || [];
      this.setData({ calcHistory: history });
    } catch (e) {
      console.error('加载历史失败:', e);
    }
  },

  // 清空历史
  clearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空计算历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ calcHistory: [] });
          this.saveCalcHistory([]);
        }
      }
    });
  },

  // 使用历史记录中的公式
  useHistoryFormula(e) {
    const formula = e.currentTarget.dataset.formula;
    this.setData({ formula });
    this.calculateMolarMass();
  },

  // 使用快捷公式
  useQuickFormula(e) {
    const formula = e.currentTarget.dataset.formula;
    this.setData({ formula });
    this.calculateMolarMass();
  },

  // 点击元素格子
  onCellTap(e) {
    const { period, group } = e.currentTarget.dataset;
    const key = `${period}-${group}`;
    const element = this.data.elementPositionMap[key];
    if (element) {
      this.setData({
        showModal: true,
        selectedElement: element
      });
    }
  }
});
