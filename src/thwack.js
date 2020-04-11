import { defaultOptions, APPLICATION_JSON, CONTENT_TYPE } from './defaults';
import ThwackError from './ThwackError';
import buildUrl from './utils/buildUrl';
import deepSpreadOptions from './utils/deepSpreadOptions';
import computeParser from './utils/computeParser';

const create = (createOptions) => {
  const request = async (options) => {
    const {
      url,
      fetch,
      baseURL,
      data,
      headers,
      params,
      parserMap,
      ...rest
    } = deepSpreadOptions(defaultOptions, createOptions, options);

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
      const contentTypeHeader = response.headers.get(CONTENT_TYPE);
      const responseParser = computeParser(contentTypeHeader, parserMap);
      const responseData = await response[responseParser]();

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

  const thwack = async (...args) => {
    if (args.length > 1) {
      const [url, options] = args;
      return request({ ...options, url });
    }
    const [options] = args;
    return request(options);
  };

  // Apply convenience methods
  ['get', 'delete', 'head'].forEach((method) => {
    thwack[method] = async (url, options) =>
      thwack({ ...options, method, url });
  });

  ['put', 'post', 'patch'].forEach((method) => {
    thwack[method] = async (url, data, options) =>
      thwack({ ...options, method, url, data });
  });

  thwack.request = request;
  thwack.create = create;
  thwack.ThwackError = ThwackError;

  return thwack;
};

export default create;
