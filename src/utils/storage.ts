import { AppData } from '../types';

const STORAGE_KEY = 'ohdaManagerData';

const DEFAULT_DATA: AppData = {
  totalFund: 15000,
  remainingFund: 15000,
  loans: [],
  archivedLoans: [],
};

export const loadFromLocalStorage = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      // Merge with DEFAULT_DATA to ensure all keys exist
      return { ...DEFAULT_DATA, ...parsedData };
    }
  } catch (error) {
    console.error('Error loading data from local storage:', error);
  }
  return DEFAULT_DATA;
};

export const saveToLocalStorage = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to local storage:', error);
  }
};
