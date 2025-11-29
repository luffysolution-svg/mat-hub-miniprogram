Component({
  properties: {
    type: {
      type: String,
      value: 'default'
    },
    title: {
      type: String,
      value: ''
    },
    description: {
      type: String,
      value: ''
    },
    showAction: {
      type: Boolean,
      value: false
    },
    actionText: {
      type: String,
      value: 'Retry'
    }
  },

  data: {
    defaultContent: {
      default: {
        icon: '/images/icons/empty.png',
        title: 'No Data',
        desc: 'Nothing to display'
      },
      search: {
        icon: '/images/icons/search-empty.png',
        title: 'No Results',
        desc: 'Try different keywords or filters'
      },
      history: {
        icon: '/images/icons/history-empty.png',
        title: 'No History',
        desc: 'Your search history will appear here'
      },
      favorites: {
        icon: '/images/icons/star-empty.png',
        title: 'No Favorites',
        desc: 'Save items for quick access'
      },
      error: {
        icon: '/images/icons/error.png',
        title: 'Something Went Wrong',
        desc: 'Please try again later'
      },
      network: {
        icon: '/images/icons/network-error.png',
        title: 'Network Error',
        desc: 'Check your connection and try again'
      }
    }
  },

  methods: {
    onAction() {
      this.triggerEvent('action');
    }
  }
});
