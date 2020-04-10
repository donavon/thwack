const defaultOptions = {
  fetch: window.fetch,
  baseURL: `${window.location.origin}${window.location.pathname}`,
  params: {},
  headers: {},
};

export default defaultOptions;
