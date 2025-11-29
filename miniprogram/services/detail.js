const request = require('../utils/request');
const config = require('../config/index');

// 微信小程序兼容的 URL 参数构建函数
function buildQueryString(params) {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

module.exports = {
  getDetail(source, id) {
    return request.get('/api/detail', { source, id });
  },

  getPreview(source, id) {
    return request.get('/api/preview', { source, id });
  },

  exportCitation(source, id, format = 'bibtex') {
    return request.get('/api/export', { source, id, fmt: format });
  },

  getReferences(source, id) {
    return request.get('/api/references', { source, id });
  },

  // 晶体结构相关 API
  getStructureInfo(source, id) {
    return request.get('/api/structure/info', { source, id });
  },

  getStructureCif(source, id) {
    return request.get('/api/structure/cif', { source, id });
  },

  // 获取结构图 URL（用于 image 组件）
  getStructureImageUrl(source, id, options = {}) {
    const params = buildQueryString({
      source,
      id,
      format: options.format || 'png',
      style: options.style || 'ball_stick',
      rotation: options.rotation || '0,0,0',
      size: options.size || 400
    });
    return `${config.BASE_URL}/api/structure/image?${params}`;
  },

  // 获取在线查看器 URL
  getViewerUrl(source, id) {
    return request.get('/api/structure/viewer_url', { source, id });
  },

  // 获取能带结构图 URL
  getBandstructureImageUrl(source, id, size = 600) {
    const params = buildQueryString({ source, id, size });
    return `${config.BASE_URL}/api/structure/bandstructure?${params}`;
  },

  // 获取态密度图 URL
  getDosImageUrl(source, id, size = 600) {
    const params = buildQueryString({ source, id, size });
    return `${config.BASE_URL}/api/structure/dos?${params}`;
  },

  // 获取相似材料
  getSimilarMaterials(source, id, limit = 10) {
    return request.get('/api/structure/similar', { source, id, limit });
  },

  // 获取分子图 URL (PubChem)
  getMoleculeImageUrl(source, id, options = {}) {
    const params = buildQueryString({
      source,
      id,
      size: options.size || 300,
      image_type: options.imageType || '2d'
    });
    return `${config.BASE_URL}/api/structure/molecule_image?${params}`;
  }
};
