module.exports = {
  BASE_URL: 'https://materials-literature-aggregator.onrender.com',

  REQUEST_TIMEOUT: 120000,

  PAGE_SIZE: 20,

  MAX_SEARCH_HISTORY: 50,
  MAX_VIEW_HISTORY: 100,

  SOURCES: {
    material: [
      { id: 'materials_project', name: 'Materials Project', short: 'MP' },
      { id: 'pubchem', name: 'PubChem', short: 'PC' },
      { id: 'cas_common', name: 'CAS Common', short: 'CAS' }
    ],
    literature: [
      { id: 'sciencedirect', name: 'ScienceDirect', short: 'SD' },
      { id: 'wiley', name: 'Wiley', short: 'WIL' },
      { id: 'crossref', name: 'Crossref', short: 'CR' },
      { id: 'arxiv', name: 'arXiv', short: 'arXiv' },
      { id: 'openalex', name: 'OpenAlex', short: 'OA' },
      { id: 'semantic_scholar', name: 'Semantic Scholar', short: 'S2' }
    ]
  },

  EXPORT_FORMATS: [
    { id: 'bibtex', name: 'BibTeX' },
    { id: 'apa', name: 'APA' },
    { id: 'ieee', name: 'IEEE' },
    { id: 'json', name: 'JSON' }
  ]
};
