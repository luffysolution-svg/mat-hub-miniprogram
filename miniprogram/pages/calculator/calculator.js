const { ELEMENTS } = require('../../data/elements');
const config = require('../../config/index');

// 元素符号到原子质量的映射
const ATOMIC_MASSES = {};
ELEMENTS.forEach(el => {
  ATOMIC_MASSES[el.symbol] = el.atomicMass;
});

// 常用化学式
const QUICK_FORMULAS = [
  { formula: 'H2O', name: '水' },
  { formula: 'NaCl', name: '氯化钠' },
  { formula: 'H2SO4', name: '硫酸' },
  { formula: 'HCl', name: '盐酸' },
  { formula: 'NaOH', name: '氢氧化钠' },
  { formula: 'CaCO3', name: '碳酸钙' },
  { formula: 'C6H12O6', name: '葡萄糖' },
  { formula: 'CuSO4', name: '硫酸铜' },
  { formula: 'Ca(OH)2', name: '氢氧化钙' },
  { formula: 'NH3', name: '氨' },
  { formula: 'CO2', name: '二氧化碳' },
  { formula: 'Fe2O3', name: '氧化铁' }
];

Page({
  data: {
    activeTab: 'molar_mass',

    // 分子质量计算
    formula: '',
    molarResult: null,
    calcHistory: [],
    quickFormulas: QUICK_FORMULAS,

    // 溶液配制计算
    solutionParams: {
      mass: '',
      volume: '',
      molarMass: '',
      concentration: ''
    },
    solutionResult: null,

    // 浓度转换
    concentrationParams: {
      value: '',
      fromUnit: 'mol/L',
      toUnit: 'g/L',
      molarMass: ''
    },
    concentrationResult: null,
    concentrationUnits: [
      { value: 'mol/L', label: 'mol/L (摩尔浓度)' },
      { value: 'g/L', label: 'g/L (质量浓度)' },
      { value: 'mg/L', label: 'mg/L (毫克/升)' },
      { value: '%', label: '% (质量分数)' }
    ],

    // 单位转换
    unitParams: {
      value: '',
      fromUnit: 'g',
      toUnit: 'kg',
      category: 'mass'
    },
    unitResult: null,
    unitCategories: [
      { id: 'mass', name: '质量', units: ['mg', 'g', 'kg', 't'] },
      { id: 'length', name: '长度', units: ['nm', 'μm', 'mm', 'cm', 'm', 'km'] },
      { id: 'volume', name: '体积', units: ['μL', 'mL', 'L', 'm³'] },
      { id: 'temperature', name: '温度', units: ['K', '°C', '°F'] },
      { id: 'pressure', name: '压强', units: ['Pa', 'kPa', 'MPa', 'atm', 'bar', 'mmHg'] }
    ]
  },

  onLoad(options) {
    if (options.type) {
      this.setData({ activeTab: options.type });
    }
    this.loadHistory();
  },

  // 切换Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('calc_history') || [];
    this.setData({ calcHistory: history.slice(0, 10) });
  },

  // ===== 分子质量计算 =====
  onFormulaInput(e) {
    this.setData({ formula: e.detail.value });
  },

  // 解析化学式
  parseFormula(formula) {
    // 移除空格
    formula = formula.replace(/\s/g, '');

    // 匹配元素和数字的正则表达式
    const regex = /([A-Z][a-z]?)(\d*)/g;
    const composition = {};
    let match;

    while ((match = regex.exec(formula)) !== null) {
      const element = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;

      if (ATOMIC_MASSES[element]) {
        composition[element] = (composition[element] || 0) + count;
      } else if (element) {
        throw new Error(`未知元素: ${element}`);
      }
    }

    return composition;
  },

  // 计算摩尔质量
  calculateMolarMass() {
    const { formula } = this.data;

    if (!formula.trim()) {
      wx.showToast({ title: '请输入化学式', icon: 'none' });
      return;
    }

    try {
      const composition = this.parseFormula(formula);
      let totalMass = 0;
      const breakdown = [];

      Object.keys(composition).forEach(element => {
        const count = composition[element];
        const mass = ATOMIC_MASSES[element] * count;
        totalMass += mass;
        breakdown.push({
          element,
          count,
          mass: mass.toFixed(3)
        });
      });

      const result = {
        formula,
        molarMass: totalMass.toFixed(4),
        breakdown,
        timestamp: Date.now()
      };

      this.setData({ molarResult: result });
      this.saveToHistory(result);

    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    }
  },

  // 快速填充化学式
  quickFill(e) {
    const { formula } = e.currentTarget.dataset;
    this.setData({ formula });
  },

  // 保存到历史
  saveToHistory(result) {
    let history = wx.getStorageSync('calc_history') || [];
    history.unshift(result);
    history = history.slice(0, 50);
    wx.setStorageSync('calc_history', history);
    this.loadHistory();
  },

  // ===== 溶液配制计算 =====
  onSolutionInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`solutionParams.${field}`]: e.detail.value
    });
  },

  calculateSolution() {
    const { mass, volume, molarMass, concentration } = this.data.solutionParams;

    // 根据已知条件计算未知量
    // C = n/V = (m/M)/V

    const m = parseFloat(mass);
    const V = parseFloat(volume);
    const M = parseFloat(molarMass);
    const C = parseFloat(concentration);

    let result = null;

    // 计算浓度：已知质量、体积、摩尔质量
    if (m && V && M && !C) {
      const c = (m / M) / V;
      result = {
        type: '计算浓度',
        concentration: c.toFixed(4) + ' mol/L',
        description: `溶解 ${m}g 溶质于 ${V}L 溶液中`
      };
    }
    // 计算质量：已知浓度、体积、摩尔质量
    else if (C && V && M && !m) {
      const mass = C * V * M;
      result = {
        type: '计算溶质质量',
        mass: mass.toFixed(4) + ' g',
        description: `配制 ${C} mol/L、${V}L 溶液需要溶质`
      };
    }
    // 计算体积：已知质量、浓度、摩尔质量
    else if (m && C && M && !V) {
      const vol = (m / M) / C;
      result = {
        type: '计算体积',
        volume: vol.toFixed(4) + ' L',
        description: `${m}g 溶质配制 ${C} mol/L 溶液的体积`
      };
    } else {
      wx.showToast({ title: '请输入正确的参数组合', icon: 'none' });
      return;
    }

    this.setData({ solutionResult: result });
  },

  // ===== 浓度转换 =====
  onConcentrationInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`concentrationParams.${field}`]: e.detail.value
    });
  },

  onFromUnitChange(e) {
    this.setData({ 'concentrationParams.fromUnit': e.detail.value });
  },

  onToUnitChange(e) {
    this.setData({ 'concentrationParams.toUnit': e.detail.value });
  },

  convertConcentration() {
    const { value, fromUnit, toUnit, molarMass } = this.data.concentrationParams;
    const val = parseFloat(value);
    const M = parseFloat(molarMass);

    if (!val || !M) {
      wx.showToast({ title: '请输入数值和摩尔质量', icon: 'none' });
      return;
    }

    let result = null;

    // mol/L 转换为 g/L
    if (fromUnit === 'mol/L' && toUnit === 'g/L') {
      result = val * M;
    }
    // g/L 转换为 mol/L
    else if (fromUnit === 'g/L' && toUnit === 'mol/L') {
      result = val / M;
    }
    // mg/L 转换为 g/L
    else if (fromUnit === 'mg/L' && toUnit === 'g/L') {
      result = val / 1000;
    }
    // g/L 转换为 mg/L
    else if (fromUnit === 'g/L' && toUnit === 'mg/L') {
      result = val * 1000;
    } else {
      wx.showToast({ title: '暂不支持该转换', icon: 'none' });
      return;
    }

    this.setData({
      concentrationResult: {
        value: result.toFixed(4),
        unit: toUnit
      }
    });
  },

  // ===== 单位转换 =====
  onUnitInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`unitParams.${field}`]: e.detail.value
    });
  },

  onUnitCategoryChange(e) {
    const category = e.detail.value;
    const categoryData = this.data.unitCategories.find(c => c.id === category);
    this.setData({
      'unitParams.category': category,
      'unitParams.fromUnit': categoryData.units[0],
      'unitParams.toUnit': categoryData.units[1]
    });
  },

  convertUnit() {
    const { value, fromUnit, toUnit, category } = this.data.unitParams;
    const val = parseFloat(value);

    if (!val) {
      wx.showToast({ title: '请输入数值', icon: 'none' });
      return;
    }

    const result = this.performUnitConversion(val, fromUnit, toUnit, category);

    if (result !== null) {
      this.setData({
        unitResult: {
          value: result.toFixed(6),
          unit: toUnit
        }
      });
    } else {
      wx.showToast({ title: '转换失败', icon: 'none' });
    }
  },

  performUnitConversion(value, from, to, category) {
    // 单位转换系数
    const conversions = {
      mass: {
        mg: 0.001,
        g: 1,
        kg: 1000,
        t: 1000000
      },
      length: {
        nm: 0.000000001,
        μm: 0.000001,
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000
      },
      volume: {
        μL: 0.000001,
        mL: 0.001,
        L: 1,
        'm³': 1000
      },
      temperature: {
        K: value => value,
        '°C': value => value + 273.15,
        '°F': value => (value - 32) * 5/9 + 273.15
      }
    };

    // 温度特殊处理
    if (category === 'temperature') {
      // 先转换到K
      let kelvin = value;
      if (from === '°C') kelvin = value + 273.15;
      else if (from === '°F') kelvin = (value - 32) * 5/9 + 273.15;

      // 再从K转换到目标单位
      if (to === 'K') return kelvin;
      else if (to === '°C') return kelvin - 273.15;
      else if (to === '°F') return (kelvin - 273.15) * 9/5 + 32;
    }

    // 其他单位：先转换到基本单位，再转换到目标单位
    const fromFactor = conversions[category][from];
    const toFactor = conversions[category][to];

    if (fromFactor && toFactor) {
      return value * fromFactor / toFactor;
    }

    return null;
  },

  // 清空表单
  clearForm() {
    const { activeTab } = this.data;

    if (activeTab === 'molar_mass') {
      this.setData({ formula: '', molarResult: null });
    } else if (activeTab === 'solution') {
      this.setData({
        solutionParams: { mass: '', volume: '', molarMass: '', concentration: '' },
        solutionResult: null
      });
    } else if (activeTab === 'concentration') {
      this.setData({
        concentrationParams: { value: '', fromUnit: 'mol/L', toUnit: 'g/L', molarMass: '' },
        concentrationResult: null
      });
    } else if (activeTab === 'unit') {
      this.setData({
        unitParams: { value: '', fromUnit: 'g', toUnit: 'kg', category: 'mass' },
        unitResult: null
      });
    }
  }
});
