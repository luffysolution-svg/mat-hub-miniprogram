const request = require('../utils/request');

module.exports = {
  search(params) {
    const apiParams = {
      q: params.query,
      type: params.queryType || 'all',
      sort: params.sortBy || 'relevance',
      page: params.page || 1,
      page_size: params.pageSize || 20
    };

    if (params.sources && params.sources.length > 0) {
      apiParams.sources = params.sources;
    }

    if (params.filters) {
      const hasFilters = Object.keys(params.filters).some(k =>
        params.filters[k] != null && params.filters[k] !== ''
      );
      if (hasFilters) {
        apiParams.filters = JSON.stringify(params.filters);
      }
    }

    return request.get('/api/search', apiParams);
  }
};
