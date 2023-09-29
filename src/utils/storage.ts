import { IJWTokens } from 'interfaces/IJWTokens';

import { tokensLocalStorage } from './config';

export const getUserLocalStorage = (tokens: IJWTokens | null = null): IJWTokens | null => {
  try {
    const tokenLocal = JSON.parse(localStorage.getItem(tokensLocalStorage) || '');
    if (!tokenLocal && tokens) return tokens;
    return tokenLocal;
  } catch {
    logoutLocalStorage();
    return null;
  }
};

export const logoutLocalStorage = () => {
  localStorage.clear();
};

export const addLocalStorage = (payload: IJWTokens) => {
  localStorage.setItem(tokensLocalStorage, JSON.stringify(payload));
};
