const config = require('../../config/index');

Page({
  data: {
    activeTab: 'feeds',

    // 订阅配置
    subscriptions: [],
    showAddModal: false,
    newSubscription: {
      keyword: '',
      category: 'cond-mat',
      maxResults: 10
    },

    // arXiv分类
    categories: [
      { id: 'cond-mat', name: '凝聚态物理', desc: 'Condensed Matter' },
      { id: 'physics', name: '物理学', desc: 'Physics' },
      { id: 'chem', name: '化学', desc: 'Chemistry' },
      { id: 'mtrl-sci', name: '材料科学', desc: 'Materials Science' },
      { id: 'quant-ph', name: '量子物理', desc: 'Quantum Physics' }
    ],

    // 文献列表
    papers: [],
    loading: false,
    selectedCategory: 'all'
  },

  onLoad() {
    this.loadSubscriptions();
  },

  onShow() {
    this.loadSubscriptions();
  },

  // 切换Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 加载订阅配置
  loadSubscriptions() {
    const subs = wx.getStorageSync('journal_subscriptions') || [];
    this.setData({ subscriptions: subs });

    if (subs.length > 0) {
      this.fetchPapers();
    }
  },

  // 获取文献（模拟功能，真实环境需要处理CORS）
  async fetchPapers() {
    const { subscriptions } = this.data;

    if (subscriptions.length === 0) {
      return;
    }

    this.setData({ loading: true });

    try {
      // 这里应该调用arXiv API
      // 由于微信小程序的跨域限制，实际应用中需要配置服务器域名
      // 或者使用云函数作为代理

      // 示例：模拟获取文献数据
      const mockPapers = this.generateMockPapers(subscriptions);

      this.setData({
        papers: mockPapers,
        loading: false
      });

      // 保存到本地缓存
      wx.setStorageSync('journal_papers', mockPapers);

    } catch (error) {
      console.error('获取文献失败:', error);
      this.setData({ loading: false });

      // 加载缓存数据
      const cachedPapers = wx.getStorageSync('journal_papers') || [];
      this.setData({ papers: cachedPapers });

      wx.showToast({
        title: '网络错误，显示缓存数据',
        icon: 'none'
      });
    }
  },

  // 生成模拟文献数据（实际应用中应该调用真实API）
  generateMockPapers(subscriptions) {
    const papers = [];
    const titles = [
      '高温超导材料的电子结构研究',
      '二维材料的磁性调控与应用',
      '钙钛矿太阳能电池效率优化',
      '拓扑绝缘体的量子输运性质',
      '石墨烯基复合材料的制备与表征',
      '金属有机框架材料的气体吸附',
      '锂离子电池负极材料研究进展',
      '热电材料的性能优化策略',
      '纳米催化剂的合成与应用',
      '量子点发光二极管的研究'
    ];

    subscriptions.forEach((sub, index) => {
      for (let i = 0; i < 3; i++) {
        papers.push({
          id: `paper_${index}_${i}`,
          title: titles[(index * 3 + i) % titles.length],
          authors: ['张三', '李四', '王五'],
          abstract: '这是一篇关于' + sub.keyword + '的研究论文摘要。研究表明该方法具有良好的应用前景...',
          category: sub.category,
          publishDate: new Date(Date.now() - Math.random() * 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
          url: 'https://arxiv.org/abs/xxxx.xxxxx',
          keywords: [sub.keyword, '材料科学', '实验研究']
        });
      }
    });

    return papers.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  },

  // 显示添加订阅弹窗
  showAddSubscription() {
    this.setData({ showAddModal: true });
  },

  // 关闭弹窗
  closeModal() {
    this.setData({
      showAddModal: false,
      newSubscription: {
        keyword: '',
        category: 'cond-mat',
        maxResults: 10
      }
    });
  },

  // 输入关键词
  onKeywordInput(e) {
    this.setData({ 'newSubscription.keyword': e.detail.value });
  },

  // 选择分类
  onCategoryChange(e) {
    const index = e.detail.value;
    const category = this.data.categories[index];
    this.setData({ 'newSubscription.category': category.id });
  },

  // 添加订阅
  addSubscription() {
    const { keyword, category } = this.data.newSubscription;

    if (!keyword.trim()) {
      wx.showToast({ title: '请输入关键词', icon: 'none' });
      return;
    }

    const subscriptions = this.data.subscriptions || [];
    const newSub = {
      id: Date.now(),
      keyword: keyword.trim(),
      category,
      createTime: Date.now(),
      enabled: true
    };

    subscriptions.push(newSub);
    wx.setStorageSync('journal_subscriptions', subscriptions);

    this.setData({
      subscriptions,
      showAddModal: false
    });

    wx.showToast({ title: '添加成功', icon: 'success' });

    // 刷新文献列表
    this.fetchPapers();
  },

  // 删除订阅
  deleteSubscription(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个订阅吗？',
      success: (res) => {
        if (res.confirm) {
          let subscriptions = this.data.subscriptions;
          subscriptions = subscriptions.filter(sub => sub.id !== id);

          wx.setStorageSync('journal_subscriptions', subscriptions);
          this.setData({ subscriptions });

          wx.showToast({ title: '已删除', icon: 'success' });
          this.fetchPapers();
        }
      }
    });
  },

  // 切换订阅状态
  toggleSubscription(e) {
    const { id } = e.currentTarget.dataset;
    const subscriptions = this.data.subscriptions.map(sub => {
      if (sub.id === id) {
        sub.enabled = !sub.enabled;
      }
      return sub;
    });

    wx.setStorageSync('journal_subscriptions', subscriptions);
    this.setData({ subscriptions });
    this.fetchPapers();
  },

  // 查看文献详情
  viewPaper(e) {
    const { id } = e.currentTarget.dataset;
    const paper = this.data.papers.find(p => p.id === id);

    if (paper && paper.url) {
      // 复制链接到剪贴板
      wx.setClipboardData({
        data: paper.url,
        success: () => {
          wx.showToast({
            title: '链接已复制',
            icon: 'success'
          });
        }
      });
    }
  },

  // 收藏文献
  favoritePaper(e) {
    const { id } = e.currentTarget.dataset;
    const paper = this.data.papers.find(p => p.id === id);

    if (!paper) return;

    let favorites = wx.getStorageSync('paper_favorites') || [];
    const index = favorites.findIndex(p => p.id === id);

    if (index > -1) {
      favorites.splice(index, 1);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      favorites.unshift(paper);
      wx.showToast({ title: '已收藏', icon: 'success' });
    }

    wx.setStorageSync('paper_favorites', favorites);
  },

  // 检查是否已收藏
  isFavorite(paperId) {
    const favorites = wx.getStorageSync('paper_favorites') || [];
    return favorites.some(p => p.id === paperId);
  },

  // 刷新文献
  onRefresh() {
    this.fetchPapers();
  },

  // 过滤文献
  filterByCategory(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({ selectedCategory: category });
  },

  // 获取过滤后的文献
  getFilteredPapers() {
    const { papers, selectedCategory } = this.data;

    if (selectedCategory === 'all') {
      return papers;
    }

    return papers.filter(paper => paper.category === selectedCategory);
  }
});
