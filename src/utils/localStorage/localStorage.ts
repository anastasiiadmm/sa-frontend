export const getLocalStorage = (name: string) => {
  try {
    const tokenLocal = JSON.parse(localStorage.getItem(name) || '');
    return tokenLocal;
  } catch (error) {
    logoutLocalStorage(name);
    return null;
  }
};

export const addLocalStorage = (name: string, page: unknown) => {
  localStorage.setItem(name, JSON.stringify(page));
};

export const logoutLocalStorage = (name: string) => {
  localStorage.setItem(name, JSON.stringify({ user: null, token: null }));
};
