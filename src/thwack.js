import defaultOptions from './defaultOptions';
import ThwackError from './ThwackError';
import buildUrl from './utils/buildUrl';
import deepSpreadOptions from './utils/deepSpreadOptions';

const CONTENT_TYPE = 'content-type';
const APPLICATION_JSON = 'application/json';

const create = (createOptions) => {
  const thwack = async (...args) => {
    if (args.length === 2) {
      const [url, options] = args;
      return thwack({ ...options, url });
    }

    const {
      url,
      fetch,
      baseURL,
      data,
      headers,
      params,
      ...rest
    } = deepSpreadOptions(defaultOptions, createOptions, args[0]);

    if (data) {
      headers[CONTENT_TYPE] = headers[CONTENT_TYPE] || APPLICATION_JSON;
    }
    const body =
      data && headers[CONTENT_TYPE] === APPLICATION_JSON
        ? JSON.stringify(data)
        : data;
    const fetchUrl = buildUrl(url, baseURL, params);
    const fetchOptions = {
      ...(Object.keys(headers).length !== 0 && { headers }), // add if not empty object
      ...(!!body && { body, method: 'post' }), // if body not empty add it and default method to POST
      ...rest,
    };

    const response = await fetch(fetchUrl, fetchOptions);
    const { status, statusText, headers: responseHeaders } = response;

    if (response.ok) {
      const contentType = response.headers.get(CONTENT_TYPE);
      const responseData = contentType.includes(APPLICATION_JSON)
        ? await response.json()
        : await response.text();

      return {
        status,
        statusText,
        headers: Object.fromEntries(responseHeaders.entries()),
        data: responseData,
        response,
      };
    }

    // if not OK then throw with text of body as the message
    const message = await response.text();

    const thwackError = new ThwackError(message, {
      status,
      statusText,
      headers: Object.fromEntries(responseHeaders.entries()),
      response,
    });

    throw thwackError;
  };

  ['get', 'delete', 'head'].forEach((method) => {
    thwack[method] = async (url, options) =>
      thwack({ ...options, method, url });
  });

  ['put', 'post', 'patch'].forEach((method) => {
    thwack[method] = async (url, data, options) =>
      thwack({ ...options, method, url, data });
  });

  thwack.request = thwack;
  thwack.create = create;
  thwack.ThwackError = ThwackError;

  return thwack;
};

export default create;
