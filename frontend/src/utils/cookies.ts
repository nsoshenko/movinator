type Cookie = {
  value: string;
  expiration: number;
};

export const setCookieWithExpiration = (
  key: string,
  value: string,
  ttl: number
): void => {
  const cookie: Cookie = {
    value: value,
    expiration: Date.now() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(cookie));
};

export const getCookieWithExpirationCheck = (
  key: string
): string | undefined => {
  const item = localStorage.getItem(key);
  if (!item) return undefined;
  const cookie = JSON.parse(item) as Cookie;

  if (Date.now() > cookie.expiration) {
    localStorage.removeItem(key);
    return undefined;
  }

  return cookie.value;
};
