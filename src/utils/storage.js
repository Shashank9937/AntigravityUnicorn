export const STORAGE_KEY = 'unicorn_builder_os_data';

export const defaultState = {
  ideasList: [], // Idea Engine & Log
  currentIdeaId: null, // Selected idea context
  
  // Modules
  radar: {}, // Opportunity Radar scores
  validation: {}, // Validation Sprint
  moat: {}, // Moat Builder
  monetisation: {}, // Monetisation Lab
  persona: {}, // Persona Builder
  competitors: [], // Competitor Map
  growth: {}, // Growth OS
  hiring: [], // Hiring & Team
  legal: {}, // Legal Setup
  fundraising: {}, // Fundraising
  kpis: {
    history: [],
    current: { mrr: 0, runway: 0, burn: 0, customers: 0, churn: 0, growth: 0 }
  },
  weekly: [] // Weekly Execution
};

export const loadData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : typeof structuredClone === 'function' ? structuredClone(defaultState) : JSON.parse(JSON.stringify(defaultState));
};

export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const updateModule = (moduleName, dataHandler) => {
  const current = loadData();
  
  if (typeof dataHandler === 'function') {
    current[moduleName] = dataHandler(current[moduleName]);
  } else {
    current[moduleName] = dataHandler;
  }
  
  saveData(current);
  return current[moduleName];
};
