module.exports = {
  // 应用配置
  APP_NAME: '科研工具箱',
  VERSION: '2.0.0',

  // 本地存储配置
  MAX_FAVORITES: 500,
  MAX_HISTORY: 100,

  // 期刊RSS源配置（支持CORS的公开API）
  JOURNAL_SOURCES: [
    {
      id: 'arxiv',
      name: 'arXiv',
      categories: [
        { id: 'cond-mat', name: '凝聚态物理', color: '#3498db' },
        { id: 'physics', name: '物理学', color: '#9b59b6' },
        { id: 'chem', name: '化学', color: '#e74c3c' },
        { id: 'mtrl-sci', name: '材料科学', color: '#f39c12' }
      ],
      apiUrl: 'https://export.arxiv.org/api/query',
      enabled: true
    },
    {
      id: 'pubmed',
      name: 'PubMed',
      categories: [
        { id: 'chemistry', name: '化学', color: '#2ecc71' },
        { id: 'materials', name: '材料', color: '#1abc9c' }
      ],
      apiUrl: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils',
      enabled: true
    }
  ],

  // 元素周期表配置
  ELEMENT_CATEGORIES: [
    { id: 'all', name: '全部', color: '#95a5a6' },
    { id: 'alkali', name: '碱金属', color: '#e74c3c' },
    { id: 'alkaline', name: '碱土金属', color: '#f39c12' },
    { id: 'transition', name: '过渡金属', color: '#3498db' },
    { id: 'post-transition', name: '其他金属', color: '#9b59b6' },
    { id: 'metalloid', name: '类金属', color: '#1abc9c' },
    { id: 'nonmetal', name: '非金属', color: '#2ecc71' },
    { id: 'halogen', name: '卤素', color: '#e67e22' },
    { id: 'noble', name: '惰性气体', color: '#34495e' },
    { id: 'lanthanide', name: '镧系', color: '#16a085' },
    { id: 'actinide', name: '锕系', color: '#c0392b' }
  ],

  // 计算器配置
  CALCULATOR_TYPES: [
    { id: 'molar_mass', name: '分子质量计算', icon: '⚗️' },
    { id: 'solution', name: '溶液配制计算', icon: '🧪' },
    { id: 'concentration', name: '浓度转换', icon: '📊' },
    { id: 'unit', name: '单位转换', icon: '📏' }
  ]
};
