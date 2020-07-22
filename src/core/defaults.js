export const APPLICATION_JSON = 'application/json';
export const CONTENT_TYPE = 'content-type';

export const defaultOptions = {
  maxDepth: 5,
  params: {},
  headers: {
    accept: `${APPLICATION_JSON}, text/plain, */*`,
  },
  buildURL: 'complete',
};

export const defaultParserMap = {
  [APPLICATION_JSON]: 'json',
  'multipart/form-data': 'formData',
  '*/*': 'text',
  'text/event-stream': 'stream',
};
