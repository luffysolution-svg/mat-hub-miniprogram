# Mat-Hub 微信小程序

材料科学文献与数据库聚合搜索工具的微信小程序客户端。

## 功能特性

- **多源聚合搜索**: 支持 arXiv、Semantic Scholar、OpenAlex、Crossref、Wiley、ScienceDirect 等文献数据库
- **材料数据库**: 集成 Materials Project、PubChem、CAS Common Chemistry 等材料科学数据库
- **PDF 下载**: 支持 arXiv、Semantic Scholar、OpenAlex 等开放获取文献的 PDF 直接下载
- **引用导出**: 支持 BibTeX、RIS、EndNote 等多种格式的引用导出
- **晶体结构**: Materials Project 材料的晶体结构可视化和 CIF 文件下载
- **收藏历史**: 本地收藏和浏览历史记录

## 项目结构

```
miniprogram/
├── components/          # 自定义组件
│   ├── empty/          # 空状态组件
│   ├── filter-panel/   # 筛选面板
│   ├── result-card/    # 结果卡片
│   ├── search-bar/     # 搜索栏
│   └── skeleton/       # 骨架屏
├── pages/              # 页面
│   ├── index/          # 首页（搜索）
│   ├── detail/         # 详情页
│   ├── favorites/      # 收藏页
│   ├── history/        # 历史记录
│   ├── settings/       # 设置页
│   └── tools/          # 工具页
├── services/           # API 服务
├── utils/              # 工具函数
├── config/             # 配置文件
└── images/             # 图片资源
```

## 快速开始

### 前置要求

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 后端服务: [materials-literature-aggregator](https://github.com/luffysolution-svg/materials-literature-aggregator)

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/luffysolution-svg/mat-hub-miniprogram.git
```

2. 使用微信开发者工具打开项目目录

3. 在 `miniprogram/config/index.js` 中配置后端 API 地址：
```javascript
module.exports = {
  BASE_URL: 'https://your-backend-url.com',
  // ...
};
```

4. 在 `project.config.json` 中填入你的小程序 AppID：
```json
{
  "appid": "your-appid-here",
  // ...
}
```

5. 编译并预览

## 后端服务

本小程序需要配合后端服务使用：
- 仓库地址: https://github.com/luffysolution-svg/materials-literature-aggregator
- 在线服务: https://materials-literature-aggregator.onrender.com

## 数据源支持

| 数据源 | 类型 | PDF下载 | 说明 |
|--------|------|---------|------|
| arXiv | 文献 | ✅ 直接下载 | 预印本服务器 |
| Semantic Scholar | 文献 | ✅ 直接下载 | AI 学术搜索 |
| OpenAlex | 文献 | ✅ 直接下载 | 开放学术图谱 |
| Crossref | 文献 | 🔗 复制链接 | DOI 注册机构 |
| Wiley | 文献 | 🔗 复制链接 | 需要订阅 |
| ScienceDirect | 文献 | 🔗 复制链接 | 需要订阅 |
| Materials Project | 材料 | - | 材料数据库 |
| PubChem | 材料 | - | 化学数据库 |
| CAS Common Chemistry | 材料 | - | CAS 化学数据库 |

## 技术栈

- 微信小程序原生开发
- WXML + WXSS + JavaScript
- WXS (微信脚本语言)

## 许可证

MIT License
