const config = require('../../config/index');

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    queryType: {
      type: String,
      value: 'all'
    },
    selectedSources: {
      type: Array,
      value: []
    },
    sortBy: {
      type: String,
      value: 'relevance'
    },
    filters: {
      type: Object,
      value: {}
    }
  },

  data: {
    materialSources: config.SOURCES.material,
    literatureSources: config.SOURCES.literature,
    types: [
      { id: 'all', name: 'All' },
      { id: 'material', name: 'Material' },
      { id: 'literature', name: 'Literature' }
    ],
    sorts: [
      { id: 'relevance', name: 'Relevance' },
      { id: 'recent', name: 'Recent' }
    ]
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },

    preventBubble() {},

    onTypeChange(e) {
      const type = e.currentTarget.dataset.type;
      this.triggerEvent('typechange', { type });
    },

    onSortChange(e) {
      const sort = e.currentTarget.dataset.sort;
      this.triggerEvent('sortchange', { sort });
    },

    onSourceToggle(e) {
      const sourceId = e.currentTarget.dataset.source;
      let selected = [...this.properties.selectedSources];

      // 如果当前为空（全选状态），点击一个源就只选中它
      if (selected.length === 0) {
        selected = [sourceId];
      } else {
        const index = selected.indexOf(sourceId);
        if (index > -1) {
          // 已选中，取消选中
          selected.splice(index, 1);
          // 如果取消后没有选中的，保持空数组（全选）
        } else {
          // 未选中，添加选中
          selected.push(sourceId);
        }
      }

      this.triggerEvent('sourcechange', { sources: selected });
    },

    selectAllSources() {
      const all = [
        ...config.SOURCES.material.map(s => s.id),
        ...config.SOURCES.literature.map(s => s.id)
      ];
      this.triggerEvent('sourcechange', { sources: all });
    },

    clearAllSources() {
      this.triggerEvent('sourcechange', { sources: [] });
    },

    onFilterInput(e) {
      const { field } = e.currentTarget.dataset;
      const value = e.detail.value;
      const filters = { ...this.properties.filters };

      if (value === '' || value === null) {
        delete filters[field];
      } else {
        filters[field] = parseFloat(value) || value;
      }

      this.triggerEvent('filterchange', { filters });
    },

    onHasPdfChange(e) {
      const filters = { ...this.properties.filters };
      const current = filters.has_pdf;

      if (current === true) {
        filters.has_pdf = false;
      } else if (current === false) {
        delete filters.has_pdf;
      } else {
        filters.has_pdf = true;
      }

      this.triggerEvent('filterchange', { filters });
    },

    onReset() {
      this.triggerEvent('reset');
    },

    onApply() {
      this.triggerEvent('apply');
    },

    isSourceSelected(sourceId) {
      const selected = this.properties.selectedSources;
      return selected.length === 0 || selected.includes(sourceId);
    }
  }
});
