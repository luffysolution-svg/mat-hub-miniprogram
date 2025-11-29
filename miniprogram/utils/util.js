module.exports = {
  formatAuthors(authors, maxCount = 3) {
    if (!authors || !authors.length) return '';
    if (authors.length <= maxCount) {
      return authors.join(', ');
    }
    return `${authors.slice(0, maxCount).join(', ')} et al.`;
  },

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  },

  getSourceName(sourceId) {
    const sourceMap = {
      materials_project: 'Materials Project',
      pubchem: 'PubChem',
      cas_common: 'CAS Common',
      sciencedirect: 'ScienceDirect',
      wiley: 'Wiley',
      crossref: 'Crossref',
      arxiv: 'arXiv',
      openalex: 'OpenAlex',
      semantic_scholar: 'Semantic Scholar'
    };
    return sourceMap[sourceId] || sourceId;
  },

  getSourceShort(sourceId) {
    const shortMap = {
      materials_project: 'MP',
      pubchem: 'PC',
      cas_common: 'CAS',
      sciencedirect: 'SD',
      wiley: 'WIL',
      crossref: 'CR',
      arxiv: 'arXiv',
      openalex: 'OA',
      semantic_scholar: 'S2'
    };
    return shortMap[sourceId] || sourceId;
  },

  formatProperty(key, value) {
    if (value === null || value === undefined) return '-';

    const formatters = {
      band_gap: (v) => `${v.toFixed(2)} eV`,
      density: (v) => `${v.toFixed(2)} g/cm³`,
      e_above_hull: (v) => `${v.toFixed(3)} eV/atom`,
      volume: (v) => `${v.toFixed(2)} ų`,
      formation_energy: (v) => `${v.toFixed(3)} eV/atom`
    };

    if (formatters[key]) {
      return formatters[key](value);
    }

    if (typeof value === 'number') {
      return value.toFixed(2);
    }

    return String(value);
  },

  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  copyToClipboard(text) {
    return new Promise((resolve, reject) => {
      wx.setClipboardData({
        data: text,
        success: () => {
          wx.showToast({
            title: 'Copied',
            icon: 'success',
            duration: 1500
          });
          resolve();
        },
        fail: reject
      });
    });
  }
};
