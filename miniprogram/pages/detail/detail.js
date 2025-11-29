const detailService = require('../../services/detail');
const storage = require('../../utils/storage');
const util = require('../../utils/util');
const config = require('../../config/index');

Page({
  data: {
    id: '',
    source: '',
    type: '',

    detail: null,
    preview: null,
    references: [],

    loading: true,
    loadingPreview: false,
    loadingRefs: false,
    isFavorite: false,

    showExport: false,
    exportFormats: config.EXPORT_FORMATS,
    selectedFormat: 'bibtex',
    exportContent: '',
    loadingExport: false,

    // 晶体结构相关
    structureImageUrl: '',
    structureInfo: null,
    loadingStructure: false,
    structureError: false,

    // 电子结构相关
    bandstructureImageUrl: '',
    dosImageUrl: '',

    // 相似材料
    similarMaterials: []
  },

  onLoad(options) {
    const { id, source, type } = options;
    this.setData({
      id: decodeURIComponent(id || ''),
      source: source || '',
      type: type || ''
    });

    this.loadDetail();
  },

  onShow() {
    this.checkFavorite();
  },

  checkFavorite() {
    const { id, source } = this.data;
    this.setData({
      isFavorite: storage.isFavorite(id, source)
    });
  },

  async loadDetail() {
    const { id, source } = this.data;

    // 检查必要参数
    if (!source || !id) {
      console.error('Missing required params:', { id, source });
      this.setData({ loading: false });
      wx.showToast({
        title: 'Invalid parameters',
        icon: 'none'
      });
      return;
    }

    try {
      const detail = await detailService.getDetail(source, id);
      this.setData({ detail, loading: false });

      storage.addViewHistory({
        id,
        source,
        type: detail.type,
        title: detail.title
      });

      this.loadPreview();

      if (this.data.type === 'literature') {
        this.loadReferences();
      }

      // 材料类型且是 Materials Project 数据源，加载结构信息
      if (detail.type === 'material' && source === 'materials_project') {
        this.loadStructureImage();
        this.loadStructureInfo();
        this.loadSimilarMaterials();
      }
    } catch (err) {
      console.error('Load detail failed:', err);
      this.setData({ loading: false });
      wx.showToast({
        title: 'Failed to load',
        icon: 'none'
      });
    }
  },

  async loadPreview() {
    const { id, source } = this.data;
    this.setData({ loadingPreview: true });

    try {
      const preview = await detailService.getPreview(source, id);
      this.setData({ preview, loadingPreview: false });
    } catch (err) {
      console.error('Load preview failed:', err);
      this.setData({ loadingPreview: false });
    }
  },

  async loadReferences() {
    const { id, source } = this.data;
    this.setData({ loadingRefs: true });

    try {
      const res = await detailService.getReferences(source, id);
      this.setData({
        references: res.references || [],
        loadingRefs: false
      });
    } catch (err) {
      console.error('Load references failed:', err);
      this.setData({ loadingRefs: false });
    }
  },

  toggleFavorite() {
    const { id, source, detail, isFavorite } = this.data;

    if (isFavorite) {
      storage.removeFavorite(id, source);
    } else {
      storage.addFavorite({
        id,
        source,
        type: detail.type,
        title: detail.title,
        authors: detail.authors,
        journal: detail.journal,
        year: detail.year,
        doi: detail.doi,
        abstract_snippet: detail.abstract ? detail.abstract.slice(0, 200) : ''
      });
    }

    this.setData({ isFavorite: !isFavorite });
    wx.showToast({
      title: isFavorite ? 'Removed' : 'Saved',
      icon: 'success'
    });
  },

  copyDoi() {
    const { doi } = this.data.detail || {};
    if (doi) {
      util.copyToClipboard(doi);
    }
  },

  // 支持直接下载的数据源
  _canProxyDownload(source) {
    const proxySources = ['arxiv', 'semantic_scholar', 'openalex'];
    return proxySources.includes(source);
  },

  // 获取数据源友好名称
  _getSourceDisplayName(source) {
    const names = {
      'arxiv': 'arXiv',
      'semantic_scholar': 'Semantic Scholar',
      'openalex': 'OpenAlex',
      'crossref': 'Crossref',
      'sciencedirect': 'ScienceDirect',
      'wiley': 'Wiley',
      'materials_project': 'Materials Project',
      'pubchem': 'PubChem',
      'cas_common': 'CAS'
    };
    return names[source] || source;
  },

  openPdf() {
    const { preview, source, detail } = this.data;
    console.log('[openPdf] Called with:', { preview, source, hasPdfUrl: preview?.pdf_url });

    if (!preview || !preview.pdf_url) {
      // 如果 preview 没加载成功但 detail 有 pdf_url，尝试使用它
      const fallbackUrl = detail?.pdf_url;
      if (fallbackUrl) {
        console.log('[openPdf] Using fallback pdf_url from detail:', fallbackUrl);
        this._handlePdfAction(fallbackUrl, source);
        return;
      }

      wx.showToast({
        title: 'PDF not available',
        icon: 'none'
      });
      return;
    }

    this._handlePdfAction(preview.pdf_url, source);
  },

  _handlePdfAction(pdfUrl, source) {
    const canProxy = this._canProxyDownload(source);
    console.log('[_handlePdfAction] pdfUrl:', pdfUrl, 'canProxy:', canProxy);

    if (canProxy) {
      // 支持代理下载的源：显示下载和复制选项
      wx.showActionSheet({
        itemList: ['Download & Open', 'Copy Link'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.downloadPdfViaProxy();
          } else {
            this.copyPdfUrl(pdfUrl, true);
          }
        },
        fail: (err) => {
          console.log('[_handlePdfAction] ActionSheet cancelled or failed:', err);
        }
      });
    } else {
      // 不支持代理的源：显示说明并复制链接
      const sourceName = this._getSourceDisplayName(source);
      wx.showModal({
        title: 'Open in Browser',
        content: `${sourceName} requires login or subscription to access full PDF. The link will be copied to clipboard.`,
        confirmText: 'Copy Link',
        success: (res) => {
          console.log('[_handlePdfAction] Modal result:', res);
          if (res.confirm) {
            this.copyPdfUrl(pdfUrl, false);
            wx.showToast({
              title: 'Link Copied',
              icon: 'success'
            });
          }
        },
        fail: (err) => {
          console.error('[_handlePdfAction] Modal failed:', err);
        }
      });
    }
  },

  downloadPdfViaProxy() {
    const { source, id, preview } = this.data;

    // 通过后端代理下载 PDF（后端处理重定向、跨域等问题）
    const proxyUrl = `${config.BASE_URL}/api/pdf/proxy?source=${source}&id=${encodeURIComponent(id)}`;

    wx.showLoading({
      title: 'Downloading...',
      mask: true
    });

    wx.downloadFile({
      url: proxyUrl,
      success: (res) => {
        wx.hideLoading();

        if (res.statusCode === 200 && res.tempFilePath) {
          wx.openDocument({
            filePath: res.tempFilePath,
            fileType: 'pdf',
            showMenu: true,
            success: () => {
              wx.showToast({
                title: 'PDF Opened',
                icon: 'success'
              });
            },
            fail: (err) => {
              console.error('Open document failed:', err);
              this.copyPdfUrl(preview.pdf_url, true);
            }
          });
        } else {
          console.error('Download failed with status:', res.statusCode);
          // 代理下载失败，复制链接让用户在浏览器打开
          if (preview && preview.pdf_url) {
            this.copyPdfUrl(preview.pdf_url, false);
            wx.showToast({
              title: 'Link copied, open in browser',
              icon: 'none',
              duration: 2500
            });
          } else {
            wx.showToast({
              title: 'PDF not available',
              icon: 'none'
            });
          }
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('Download failed:', err);
        // 代理下载失败，复制链接让用户在浏览器打开
        if (preview && preview.pdf_url) {
          this.copyPdfUrl(preview.pdf_url, false);
          wx.showToast({
            title: 'Link copied, open in browser',
            icon: 'none',
            duration: 2500
          });
        } else {
          wx.showToast({
            title: 'PDF not available',
            icon: 'none'
          });
        }
      }
    });
  },

  copyPdfUrl(pdfUrl, showToast = true) {
    util.copyToClipboard(pdfUrl);
    if (showToast) {
      wx.showToast({
        title: 'Link Copied',
        icon: 'success'
      });
    }
  },

  showExportPanel() {
    this.setData({ showExport: true });
    this.exportCitation(this.data.selectedFormat);
  },

  hideExportPanel() {
    this.setData({ showExport: false, exportContent: '' });
  },

  onFormatChange(e) {
    const format = e.currentTarget.dataset.format;
    this.setData({ selectedFormat: format });
    this.exportCitation(format);
  },

  async exportCitation(format) {
    const { id, source } = this.data;
    this.setData({ loadingExport: true });

    try {
      const res = await detailService.exportCitation(source, id, format);
      this.setData({
        exportContent: res.content || '',
        loadingExport: false
      });
    } catch (err) {
      console.error('Export failed:', err);
      this.setData({ loadingExport: false });
      wx.showToast({
        title: 'Export failed',
        icon: 'none'
      });
    }
  },

  copyExport() {
    const { exportContent } = this.data;
    if (exportContent) {
      util.copyToClipboard(exportContent);
    }
  },

  onShareAppMessage() {
    const { detail } = this.data;
    return {
      title: detail ? detail.title : 'Mat-Hub',
      path: `/pages/detail/detail?id=${encodeURIComponent(this.data.id)}&source=${this.data.source}&type=${this.data.type}`
    };
  },

  // ==================== 晶体结构相关方法 ====================

  loadStructureImage() {
    const { id, source } = this.data;
    this.setData({
      loadingStructure: true,
      structureError: false,
      structureImageUrl: detailService.getStructureImageUrl(source, id, { size: 400 })
    });
  },

  async loadStructureInfo() {
    const { id, source } = this.data;

    try {
      const info = await detailService.getStructureInfo(source, id);
      this.setData({ structureInfo: info });
    } catch (err) {
      console.error('Load structure info failed:', err);
      // 结构信息加载失败不影响整体显示
    }
  },

  onStructureImageLoad() {
    this.setData({
      loadingStructure: false,
      structureError: false
    });
  },

  onStructureImageError() {
    this.setData({
      loadingStructure: false,
      structureError: true
    });
  },

  previewStructureImage() {
    const { structureImageUrl } = this.data;
    if (structureImageUrl) {
      wx.previewImage({
        urls: [structureImageUrl],
        current: structureImageUrl
      });
    }
  },

  async downloadCif() {
    const { id, source } = this.data;

    wx.showLoading({ title: 'Loading CIF...' });

    try {
      const result = await detailService.getStructureCif(source, id);
      wx.hideLoading();

      if (result && result.cif) {
        // 复制 CIF 内容到剪贴板
        wx.setClipboardData({
          data: result.cif,
          success: () => {
            wx.showModal({
              title: 'CIF Content Copied',
              content: 'CIF file content has been copied to clipboard. You can paste it into a text editor and save as .cif file.',
              showCancel: false
            });
          }
        });
      } else {
        wx.showToast({
          title: 'CIF not available',
          icon: 'none'
        });
      }
    } catch (err) {
      wx.hideLoading();
      console.error('Download CIF failed:', err);
      wx.showToast({
        title: 'Failed to load CIF',
        icon: 'none'
      });
    }
  },

  openViewer() {
    const { id, source, structureInfo } = this.data;
    let viewerUrl = '';

    if (structureInfo && structureInfo.viewer_url) {
      viewerUrl = structureInfo.viewer_url;
    } else if (source === 'materials_project') {
      viewerUrl = `https://next-gen.materialsproject.org/materials/${id}#structure`;
    }

    if (viewerUrl) {
      wx.setClipboardData({
        data: viewerUrl,
        success: () => {
          wx.showModal({
            title: '3D Viewer URL Copied',
            content: 'The Materials Project 3D viewer URL has been copied. Open it in your browser to view the interactive 3D structure.',
            showCancel: false
          });
        }
      });
    }
  },

  // ==================== 电子结构相关方法 ====================

  loadBandstructure() {
    const { id, source } = this.data;
    this.setData({
      bandstructureImageUrl: detailService.getBandstructureImageUrl(source, id, 600)
    });
  },

  loadDos() {
    const { id, source } = this.data;
    this.setData({
      dosImageUrl: detailService.getDosImageUrl(source, id, 600)
    });
  },

  previewBandstructure() {
    const { bandstructureImageUrl } = this.data;
    if (bandstructureImageUrl) {
      wx.previewImage({
        urls: [bandstructureImageUrl],
        current: bandstructureImageUrl
      });
    }
  },

  previewDos() {
    const { dosImageUrl } = this.data;
    if (dosImageUrl) {
      wx.previewImage({
        urls: [dosImageUrl],
        current: dosImageUrl
      });
    }
  },

  onBandstructureError() {
    this.setData({ bandstructureImageUrl: '' });
    wx.showToast({
      title: 'Band structure unavailable',
      icon: 'none'
    });
  },

  onDosError() {
    this.setData({ dosImageUrl: '' });
    wx.showToast({
      title: 'DOS unavailable',
      icon: 'none'
    });
  },

  // ==================== 相似材料相关方法 ====================

  async loadSimilarMaterials() {
    const { id, source } = this.data;

    try {
      const result = await detailService.getSimilarMaterials(source, id, 10);
      if (result && result.similar_materials) {
        this.setData({ similarMaterials: result.similar_materials });
      }
    } catch (err) {
      console.error('Load similar materials failed:', err);
    }
  },

  goToSimilar(e) {
    const item = e.currentTarget.dataset.item;
    if (item && item.id) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${encodeURIComponent(item.id)}&source=${this.data.source}&type=material`
      });
    }
  },

  // ==================== PubChem/CAS 相关方法 ====================

  previewMoleculeImage() {
    const { detail } = this.data;
    if (detail && detail.properties && detail.properties.png_link) {
      wx.previewImage({
        urls: [detail.properties.png_link],
        current: detail.properties.png_link
      });
    }
  },

  copyLink(e) {
    const { link, name } = e.currentTarget.dataset;
    if (link) {
      wx.setClipboardData({
        data: link,
        success: () => {
          wx.showToast({
            title: `${name} link copied`,
            icon: 'success'
          });
        }
      });
    }
  }
});
