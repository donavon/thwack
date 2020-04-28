const joinSearch = (url, search) => {
  const concatChar = url.includes('?') ? '&' : '?';
  return `${url}${search ? concatChar : ''}${search}`;
};

export default joinSearch;
