export const APPLICATION_JSON = 'application/json'.trim();
export const CONTENT_TYPE = 'content-type'.trim();

const {
  fetch,
  location: { origin, pathname },
} = window;

export const defaultOptions = {
  fetch,
  baseURL: `${origin}${pathname}`,
  params: {},
  headers: {
    accept: `${APPLICATION_JSON}, text/plain, */*`,
  },
};

export const defaultParserMap = {
  [APPLICATION_JSON]: 'json',
  'multipart/form-data': 'formData',
  '*/*': 'text',
};
