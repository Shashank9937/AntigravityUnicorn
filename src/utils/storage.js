import { toast } from 'sonner';

export const STORAGE_KEY = 'unicorn_builder_os_data';

export const defaultState = {
  ideasList: [],
  currentIdeaId: null,
  radar: {},
  validation: {},
  moat: {},
  monetisation: {},
  persona: {},
  competitors: [],
  growth: {},
  hiring: [],
  legal: {},
  fundraising: {},
  kpis: {
    history: [],
    current: { mrr: 0, runway: 0, burn: 0, customers: 0, churn: 0, growth: 0 }
  },
  weekly: []
};

let memoryData = null;
let debounceTimer = null;
let lastSavePromise = null;

export const initData = async () => {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('API down');
    const json = await res.json();
    if (json.success && json.data) {
      memoryData = json.data;
    } else {
      memoryData = typeof structuredClone === 'function' ? structuredClone(defaultState) : JSON.parse(JSON.stringify(defaultState));
    }
  } catch (err) {
    console.error('Failed to init data from API, using default', err);
    memoryData = typeof structuredClone === 'function' ? structuredClone(defaultState) : JSON.parse(JSON.stringify(defaultState));
  }
  return memoryData;
};

export const loadData = () => {
  if (!memoryData) {
    return typeof structuredClone === 'function' ? structuredClone(defaultState) : JSON.parse(JSON.stringify(defaultState));
  }
  return memoryData;
};

export const saveData = (data) => {
  memoryData = data;

  // Clear previous timeout
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set new timeout for 500ms
  debounceTimer = setTimeout(async () => {
    const toastId = toast.loading('Saving changes...');
    try {
      // Small disabled state simulation block
      document.body.classList.add('is-saving');

      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memoryData)
      });
      const json = await res.json();

      if (res.ok && json.success) {
        memoryData = json.data;
        toast.success('All changes saved.', { id: toastId });
      } else {
        toast.error(`Save failed: ${json.error || 'Unknown error'}`, { id: toastId });
      }
    } catch (err) {
      toast.error('Network error during save', { id: toastId });
    } finally {
      document.body.classList.remove('is-saving');
    }
  }, 500);
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
