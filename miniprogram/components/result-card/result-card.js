const util = require('../../utils/util');
const storage = require('../../utils/storage');

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    showSource: {
      type: Boolean,
      value: true
    }
  },

  data: {
    isFavorite: false,
    formattedAuthors: '',
    sourceShort: ''
  },

  observers: {
    'item': function(item) {
      if (item && item.id) {
        this.setData({
          isFavorite: storage.isFavorite(item.id, item.source),
          formattedAuthors: util.formatAuthors(item.authors, 2),
          sourceShort: util.getSourceShort(item.source)
        });
      }
    }
  },

  methods: {
    onTap() {
      const { item } = this.properties;
      this.triggerEvent('tap', {
        id: item.id,
        source: item.source,
        type: item.type
      });
    },

    onFavorite(e) {
      e.stopPropagation();
      const { item } = this.properties;
      const { isFavorite } = this.data;

      if (isFavorite) {
        storage.removeFavorite(item.id, item.source);
      } else {
        storage.addFavorite(item);
      }

      this.setData({ isFavorite: !isFavorite });
      this.triggerEvent('favorite', {
        id: item.id,
        source: item.source,
        isFavorite: !isFavorite
      });
    }
  }
});
