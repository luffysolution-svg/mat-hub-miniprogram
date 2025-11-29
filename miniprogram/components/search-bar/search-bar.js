Component({
  properties: {
    value: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: 'Search materials or literature...'
    },
    focus: {
      type: Boolean,
      value: false
    }
  },

  data: {
    inputValue: ''
  },

  observers: {
    'value': function(val) {
      this.setData({ inputValue: val });
    }
  },

  methods: {
    onInput(e) {
      const value = e.detail.value;
      this.setData({ inputValue: value });
      this.triggerEvent('input', { value });
    },

    onConfirm() {
      this.triggerEvent('search', { value: this.data.inputValue });
    },

    onClear() {
      this.setData({ inputValue: '' });
      this.triggerEvent('input', { value: '' });
      this.triggerEvent('clear');
    },

    onFilterTap() {
      this.triggerEvent('filter');
    }
  }
});
