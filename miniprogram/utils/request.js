const config = require('../config/index');

const RETRY_CONFIG = {
  maxRetries: 2,
  retryDelay: 1000
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildQueryString(params) {
  if (!params) return '';

  return Object.keys(params)
    .filter(key => params[key] != null && params[key] !== '')
    .map(key => {
      const value = params[key];
      if (Array.isArray(value)) {
        return value.map(v => `${key}=${encodeURIComponent(v)}`).join('&');
      }
      if (typeof value === 'object') {
        return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

function doRequest(fullUrl, options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method: options.method || 'GET',
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: options.timeout || config.REQUEST_TIMEOUT,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          const error = new Error(res.data?.detail || 'Request failed');
          error.statusCode = res.statusCode;
          error.response = res.data;
          reject(error);
        }
      },
      fail: (err) => {
        let message = 'Network error';
        let isTimeout = false;
        if (err.errMsg && err.errMsg.includes('timeout')) {
          message = 'Request timeout';
          isTimeout = true;
        }
        const error = new Error(message);
        error.isTimeout = isTimeout;
        reject(error);
      }
    });
  });
}

async function request(path, params, options = {}) {
  const url = config.BASE_URL + path;
  const queryString = buildQueryString(params);
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  const maxRetries = options.maxRetries ?? RETRY_CONFIG.maxRetries;
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        wx.showLoading({
          title: '服务器正在启动，请稍候...',
          mask: true
        });
        await sleep(RETRY_CONFIG.retryDelay);
      }

      const result = await doRequest(fullUrl, options);

      if (attempt > 0) {
        wx.hideLoading();
      }

      return result;
    } catch (err) {
      lastError = err;

      if (attempt > 0) {
        wx.hideLoading();
      }

      const isLastAttempt = attempt === maxRetries;
      const shouldRetry = err.isTimeout && !isLastAttempt;

      if (!shouldRetry) {
        if (!options.silent) {
          const message = isLastAttempt && err.isTimeout
            ? '服务器响应超时，请稍后再试'
            : err.message;
          wx.showToast({
            title: message,
            icon: 'none',
            duration: 2000
          });
        }
        throw lastError;
      }
    }
  }

  throw lastError;
}

async function postRequest(path, data, options = {}) {
  const fullUrl = config.BASE_URL + path;
  const maxRetries = options.maxRetries ?? RETRY_CONFIG.maxRetries;
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        wx.showLoading({
          title: '服务器正在启动，请稍候...',
          mask: true
        });
        await sleep(RETRY_CONFIG.retryDelay);
      }

      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: fullUrl,
          method: 'POST',
          data,
          header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: options.timeout || config.REQUEST_TIMEOUT,
          success: (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(res.data);
            } else {
              const error = new Error(res.data?.detail || 'Request failed');
              error.statusCode = res.statusCode;
              reject(error);
            }
          },
          fail: (err) => {
            let message = 'Network error';
            let isTimeout = false;
            if (err.errMsg && err.errMsg.includes('timeout')) {
              message = 'Request timeout';
              isTimeout = true;
            }
            const error = new Error(message);
            error.isTimeout = isTimeout;
            reject(error);
          }
        });
      });

      if (attempt > 0) {
        wx.hideLoading();
      }

      return result;
    } catch (err) {
      lastError = err;

      if (attempt > 0) {
        wx.hideLoading();
      }

      const isLastAttempt = attempt === maxRetries;
      const shouldRetry = err.isTimeout && !isLastAttempt;

      if (!shouldRetry) {
        if (!options.silent) {
          const message = isLastAttempt && err.isTimeout
            ? '服务器响应超时，请稍后再试'
            : err.message;
          wx.showToast({
            title: message,
            icon: 'none',
            duration: 2000
          });
        }
        throw lastError;
      }
    }
  }

  throw lastError;
}

module.exports = {
  get: (path, params, options) => request(path, params, { ...options, method: 'GET' }),
  post: (path, data, options) => postRequest(path, data, options)
};
