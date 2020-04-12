import { APPLICATION_JSON, CONTENT_TYPE } from './defaults';
import ThwackError from './ThwackError';
import buildUrl from './utils/buildUrl';
import computeParser from './utils/computeParser';
import compatParser from './utils/compatParser';
import computeContentType from './utils/computeContentType';

const getUri = (options) => {
  const { url, baseURL, baseUrl = baseURL, params } = options;
  return buildUrl(url, baseUrl, params);
};

const thwack = async (options) => {
  const {
    url,
    fetch,
    baseURL, // eat the baseUrl so it's not in rest
    // eslint-disable-next-line no-unused-vars
    baseUrl = baseURL,
    data,
    headers,
    params,
    responseParserMap,
    responseType,
    ...rest
  } = options;

  if (data) {
    headers[CONTENT_TYPE] = headers[CONTENT_TYPE] || computeContentType(data);
  }
  const body =
    data && headers[CONTENT_TYPE] === APPLICATION_JSON
      ? JSON.stringify(data)
      : data;
  const fetchUrl = getUri(options);
  const fetchOptions = {
    ...(Object.keys(headers).length !== 0 && { headers }), // add if not empty object
    ...(!!body && { body, method: 'post' }), // if body not empty add it and default method to POST
    ...rest,
  };

  const response = await fetch(fetchUrl, fetchOptions);
  const { status, statusText, headers: responseHeaders } = response;

  if (response.ok) {
    const contentTypeHeader = response.headers.get(CONTENT_TYPE);
    const responseParserType =
      responseType || computeParser(contentTypeHeader, responseParserMap);
    const compatResponseParserType = compatParser(responseParserType);
    const responseData =
      compatResponseParserType === 'stream'
        ? response.body
        : await response[compatResponseParserType]();

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

thwack.getUri = getUri;

export default thwack;
