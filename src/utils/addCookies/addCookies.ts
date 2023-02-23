export const addCookies = (name: string, value: any) => {
  const maxAge = 259200;
  document.cookie = `${name}=${value}=;Max-Age=${maxAge};path=/`;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};

export const getCookie = (name: string) => {
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));

  return match ? match.split('=')[1] : undefined;
};
