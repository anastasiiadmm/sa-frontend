/**
 * Returns query string form object
 * @param {object} obj Object to convert it to query string
 * @returns {string}
 */
const toQueryParams = (obj: { page?: number | undefined }) => {
  const array = Object.entries(obj).map((data) => {
    const [key, value] = data;
    return `${key}=${value}`;
  });
  return `?${array.join('&')}`;
};

export default toQueryParams;
