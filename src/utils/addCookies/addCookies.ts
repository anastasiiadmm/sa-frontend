export const nameRefreshCookies = 'infoCookiesRefresh';

export const addCookies = (name: string, value: string): void => {
  const maxAge = 259200;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; path=/`;
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
};

export const getCookie = (name: string): string | undefined => {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(`${name}=`) === 0) {
      return cookie.substring(name.length + 1, cookie.length);
    }
  }

  return undefined;
};
