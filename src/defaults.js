export const APPLICATION_JSON = 'application/json';
export const CONTENT_TYPE = 'content-type';

export const defaultOptions = {
  maxDepth: 5,
  params: {},
  headers: {
    accept: `${APPLICATION_JSON}, text/plain, */*`,
  },
};

if (typeof window !== 'undefined') {
  const {
    fetch,
    location: { origin, pathname },
  } = window;

  defaultOptions.fetch = fetch;
  defaultOptions.baseURL = `${origin}${pathname}`;
}

export const defaultParserMap = {
  [APPLICATION_JSON]: 'json',
  'multipart/form-data': 'formData',
  '*/*': 'text',
};
