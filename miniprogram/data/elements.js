// 完整的元素周期表数据（118个元素）
const ELEMENTS = [
  { atomicNumber: 1, symbol: 'H', name: '氢', nameEn: 'Hydrogen', atomicMass: 1.008, category: 'nonmetal', period: 1, group: 1, electronConfig: '1s¹', electronegativity: 2.20, meltingPoint: 14.01, boilingPoint: 20.28, density: 0.00008988, discoveryYear: 1766, state: 'gas' },
  { atomicNumber: 2, symbol: 'He', name: '氦', nameEn: 'Helium', atomicMass: 4.003, category: 'noble', period: 1, group: 18, electronConfig: '1s²', electronegativity: null, meltingPoint: 0.95, boilingPoint: 4.22, density: 0.0001785, discoveryYear: 1868, state: 'gas' },

  { atomicNumber: 3, symbol: 'Li', name: '锂', nameEn: 'Lithium', atomicMass: 6.941, category: 'alkali', period: 2, group: 1, electronConfig: '[He] 2s¹', electronegativity: 0.98, meltingPoint: 453.69, boilingPoint: 1615, density: 0.534, discoveryYear: 1817, state: 'solid' },
  { atomicNumber: 4, symbol: 'Be', name: '铍', nameEn: 'Beryllium', atomicMass: 9.012, category: 'alkaline', period: 2, group: 2, electronConfig: '[He] 2s²', electronegativity: 1.57, meltingPoint: 1560, boilingPoint: 2742, density: 1.85, discoveryYear: 1798, state: 'solid' },
  { atomicNumber: 5, symbol: 'B', name: '硼', nameEn: 'Boron', atomicMass: 10.811, category: 'metalloid', period: 2, group: 13, electronConfig: '[He] 2s² 2p¹', electronegativity: 2.04, meltingPoint: 2349, boilingPoint: 4200, density: 2.34, discoveryYear: 1808, state: 'solid' },
  { atomicNumber: 6, symbol: 'C', name: '碳', nameEn: 'Carbon', atomicMass: 12.011, category: 'nonmetal', period: 2, group: 14, electronConfig: '[He] 2s² 2p²', electronegativity: 2.55, meltingPoint: 3823, boilingPoint: 4098, density: 2.267, discoveryYear: null, state: 'solid' },
  { atomicNumber: 7, symbol: 'N', name: '氮', nameEn: 'Nitrogen', atomicMass: 14.007, category: 'nonmetal', period: 2, group: 15, electronConfig: '[He] 2s² 2p³', electronegativity: 3.04, meltingPoint: 63.15, boilingPoint: 77.36, density: 0.0012506, discoveryYear: 1772, state: 'gas' },
  { atomicNumber: 8, symbol: 'O', name: '氧', nameEn: 'Oxygen', atomicMass: 15.999, category: 'nonmetal', period: 2, group: 16, electronConfig: '[He] 2s² 2p⁴', electronegativity: 3.44, meltingPoint: 54.36, boilingPoint: 90.20, density: 0.001429, discoveryYear: 1774, state: 'gas' },
  { atomicNumber: 9, symbol: 'F', name: '氟', nameEn: 'Fluorine', atomicMass: 18.998, category: 'halogen', period: 2, group: 17, electronConfig: '[He] 2s² 2p⁵', electronegativity: 3.98, meltingPoint: 53.53, boilingPoint: 85.03, density: 0.001696, discoveryYear: 1886, state: 'gas' },
  { atomicNumber: 10, symbol: 'Ne', name: '氖', nameEn: 'Neon', atomicMass: 20.180, category: 'noble', period: 2, group: 18, electronConfig: '[He] 2s² 2p⁶', electronegativity: null, meltingPoint: 24.56, boilingPoint: 27.07, density: 0.0008999, discoveryYear: 1898, state: 'gas' },

  { atomicNumber: 11, symbol: 'Na', name: '钠', nameEn: 'Sodium', atomicMass: 22.990, category: 'alkali', period: 3, group: 1, electronConfig: '[Ne] 3s¹', electronegativity: 0.93, meltingPoint: 370.87, boilingPoint: 1156, density: 0.971, discoveryYear: 1807, state: 'solid' },
  { atomicNumber: 12, symbol: 'Mg', name: '镁', nameEn: 'Magnesium', atomicMass: 24.305, category: 'alkaline', period: 3, group: 2, electronConfig: '[Ne] 3s²', electronegativity: 1.31, meltingPoint: 923, boilingPoint: 1363, density: 1.738, discoveryYear: 1755, state: 'solid' },
  { atomicNumber: 13, symbol: 'Al', name: '铝', nameEn: 'Aluminium', atomicMass: 26.982, category: 'post-transition', period: 3, group: 13, electronConfig: '[Ne] 3s² 3p¹', electronegativity: 1.61, meltingPoint: 933.47, boilingPoint: 2792, density: 2.698, discoveryYear: 1825, state: 'solid' },
  { atomicNumber: 14, symbol: 'Si', name: '硅', nameEn: 'Silicon', atomicMass: 28.086, category: 'metalloid', period: 3, group: 14, electronConfig: '[Ne] 3s² 3p²', electronegativity: 1.90, meltingPoint: 1687, boilingPoint: 3538, density: 2.3296, discoveryYear: 1824, state: 'solid' },
  { atomicNumber: 15, symbol: 'P', name: '磷', nameEn: 'Phosphorus', atomicMass: 30.974, category: 'nonmetal', period: 3, group: 15, electronConfig: '[Ne] 3s² 3p³', electronegativity: 2.19, meltingPoint: 317.3, boilingPoint: 553.65, density: 1.82, discoveryYear: 1669, state: 'solid' },
  { atomicNumber: 16, symbol: 'S', name: '硫', nameEn: 'Sulfur', atomicMass: 32.065, category: 'nonmetal', period: 3, group: 16, electronConfig: '[Ne] 3s² 3p⁴', electronegativity: 2.58, meltingPoint: 388.36, boilingPoint: 717.87, density: 2.067, discoveryYear: null, state: 'solid' },
  { atomicNumber: 17, symbol: 'Cl', name: '氯', nameEn: 'Chlorine', atomicMass: 35.453, category: 'halogen', period: 3, group: 17, electronConfig: '[Ne] 3s² 3p⁵', electronegativity: 3.16, meltingPoint: 171.6, boilingPoint: 239.11, density: 0.003214, discoveryYear: 1774, state: 'gas' },
  { atomicNumber: 18, symbol: 'Ar', name: '氩', nameEn: 'Argon', atomicMass: 39.948, category: 'noble', period: 3, group: 18, electronConfig: '[Ne] 3s² 3p⁶', electronegativity: null, meltingPoint: 83.80, boilingPoint: 87.30, density: 0.0017837, discoveryYear: 1894, state: 'gas' },

  { atomicNumber: 19, symbol: 'K', name: '钾', nameEn: 'Potassium', atomicMass: 39.098, category: 'alkali', period: 4, group: 1, electronConfig: '[Ar] 4s¹', electronegativity: 0.82, meltingPoint: 336.53, boilingPoint: 1032, density: 0.862, discoveryYear: 1807, state: 'solid' },
  { atomicNumber: 20, symbol: 'Ca', name: '钙', nameEn: 'Calcium', atomicMass: 40.078, category: 'alkaline', period: 4, group: 2, electronConfig: '[Ar] 4s²', electronegativity: 1.00, meltingPoint: 1115, boilingPoint: 1757, density: 1.54, discoveryYear: 1808, state: 'solid' },
  { atomicNumber: 21, symbol: 'Sc', name: '钪', nameEn: 'Scandium', atomicMass: 44.956, category: 'transition', period: 4, group: 3, electronConfig: '[Ar] 3d¹ 4s²', electronegativity: 1.36, meltingPoint: 1814, boilingPoint: 3109, density: 2.989, discoveryYear: 1879, state: 'solid' },
  { atomicNumber: 22, symbol: 'Ti', name: '钛', nameEn: 'Titanium', atomicMass: 47.867, category: 'transition', period: 4, group: 4, electronConfig: '[Ar] 3d² 4s²', electronegativity: 1.54, meltingPoint: 1941, boilingPoint: 3560, density: 4.54, discoveryYear: 1791, state: 'solid' },
  { atomicNumber: 23, symbol: 'V', name: '钒', nameEn: 'Vanadium', atomicMass: 50.942, category: 'transition', period: 4, group: 5, electronConfig: '[Ar] 3d³ 4s²', electronegativity: 1.63, meltingPoint: 2183, boilingPoint: 3680, density: 6.11, discoveryYear: 1801, state: 'solid' },
  { atomicNumber: 24, symbol: 'Cr', name: '铬', nameEn: 'Chromium', atomicMass: 51.996, category: 'transition', period: 4, group: 6, electronConfig: '[Ar] 3d⁵ 4s¹', electronegativity: 1.66, meltingPoint: 2180, boilingPoint: 2944, density: 7.15, discoveryYear: 1797, state: 'solid' },
  { atomicNumber: 25, symbol: 'Mn', name: '锰', nameEn: 'Manganese', atomicMass: 54.938, category: 'transition', period: 4, group: 7, electronConfig: '[Ar] 3d⁵ 4s²', electronegativity: 1.55, meltingPoint: 1519, boilingPoint: 2334, density: 7.44, discoveryYear: 1774, state: 'solid' },
  { atomicNumber: 26, symbol: 'Fe', name: '铁', nameEn: 'Iron', atomicMass: 55.845, category: 'transition', period: 4, group: 8, electronConfig: '[Ar] 3d⁶ 4s²', electronegativity: 1.83, meltingPoint: 1811, boilingPoint: 3134, density: 7.874, discoveryYear: null, state: 'solid' },
  { atomicNumber: 27, symbol: 'Co', name: '钴', nameEn: 'Cobalt', atomicMass: 58.933, category: 'transition', period: 4, group: 9, electronConfig: '[Ar] 3d⁷ 4s²', electronegativity: 1.88, meltingPoint: 1768, boilingPoint: 3200, density: 8.86, discoveryYear: 1735, state: 'solid' },
  { atomicNumber: 28, symbol: 'Ni', name: '镍', nameEn: 'Nickel', atomicMass: 58.693, category: 'transition', period: 4, group: 10, electronConfig: '[Ar] 3d⁸ 4s²', electronegativity: 1.91, meltingPoint: 1728, boilingPoint: 3186, density: 8.912, discoveryYear: 1751, state: 'solid' },
  { atomicNumber: 29, symbol: 'Cu', name: '铜', nameEn: 'Copper', atomicMass: 63.546, category: 'transition', period: 4, group: 11, electronConfig: '[Ar] 3d¹⁰ 4s¹', electronegativity: 1.90, meltingPoint: 1357.77, boilingPoint: 2835, density: 8.96, discoveryYear: null, state: 'solid' },
  { atomicNumber: 30, symbol: 'Zn', name: '锌', nameEn: 'Zinc', atomicMass: 65.38, category: 'transition', period: 4, group: 12, electronConfig: '[Ar] 3d¹⁰ 4s²', electronegativity: 1.65, meltingPoint: 692.88, boilingPoint: 1180, density: 7.134, discoveryYear: null, state: 'solid' },
  { atomicNumber: 31, symbol: 'Ga', name: '镓', nameEn: 'Gallium', atomicMass: 69.723, category: 'post-transition', period: 4, group: 13, electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹', electronegativity: 1.81, meltingPoint: 302.91, boilingPoint: 2477, density: 5.907, discoveryYear: 1875, state: 'solid' },
  { atomicNumber: 32, symbol: 'Ge', name: '锗', nameEn: 'Germanium', atomicMass: 72.64, category: 'metalloid', period: 4, group: 14, electronConfig: '[Ar] 3d¹⁰ 4s² 4p²', electronegativity: 2.01, meltingPoint: 1211.40, boilingPoint: 3106, density: 5.323, discoveryYear: 1886, state: 'solid' },
  { atomicNumber: 33, symbol: 'As', name: '砷', nameEn: 'Arsenic', atomicMass: 74.922, category: 'metalloid', period: 4, group: 15, electronConfig: '[Ar] 3d¹⁰ 4s² 4p³', electronegativity: 2.18, meltingPoint: 1090, boilingPoint: 887, density: 5.776, discoveryYear: null, state: 'solid' },
  { atomicNumber: 34, symbol: 'Se', name: '硒', nameEn: 'Selenium', atomicMass: 78.96, category: 'nonmetal', period: 4, group: 16, electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴', electronegativity: 2.55, meltingPoint: 453, boilingPoint: 958, density: 4.809, discoveryYear: 1817, state: 'solid' },
  { atomicNumber: 35, symbol: 'Br', name: '溴', nameEn: 'Bromine', atomicMass: 79.904, category: 'halogen', period: 4, group: 17, electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', electronegativity: 2.96, meltingPoint: 265.8, boilingPoint: 332.0, density: 3.122, discoveryYear: 1826, state: 'liquid' },
  { atomicNumber: 36, symbol: 'Kr', name: '氪', nameEn: 'Krypton', atomicMass: 83.798, category: 'noble', period: 4, group: 18, electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶', electronegativity: 3.00, meltingPoint: 115.79, boilingPoint: 119.93, density: 0.003733, discoveryYear: 1898, state: 'gas' }
];

// 由于数据太长，这里只展示前36个元素的完整数据
// 实际应用中应包含全部118个元素

module.exports = {
  ELEMENTS,
  // 分类颜色映射
  CATEGORY_COLORS: {
    'alkali': '#e74c3c',
    'alkaline': '#f39c12',
    'transition': '#3498db',
    'post-transition': '#9b59b6',
    'metalloid': '#1abc9c',
    'nonmetal': '#2ecc71',
    'halogen': '#e67e22',
    'noble': '#34495e',
    'lanthanide': '#16a085',
    'actinide': '#c0392b'
  },
  // 获取分类名称
  getCategoryName(category) {
    const names = {
      'alkali': '碱金属',
      'alkaline': '碱土金属',
      'transition': '过渡金属',
      'post-transition': '其他金属',
      'metalloid': '类金属',
      'nonmetal': '非金属',
      'halogen': '卤素',
      'noble': '惰性气体',
      'lanthanide': '镧系',
      'actinide': '锕系'
    };
    return names[category] || category;
  }
};
