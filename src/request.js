import { APPLICATION_JSON, CONTENT_TYPE } from './defaults';

import buildUrl from './utils/buildUrl';
import combineOptions from './utils/combineOptions';
import computeParser from './utils/computeParser';
import compatParser from './utils/compatParser';
import computeContentType from './utils/computeContentType';
import ThwackError from './ThwackError';

const request = async function (options) {
  // get the options to use
  // 1. combine options from:
  //  a. passed options
  //  b. this._defaultOptions (i.e. when instance was created)
  //  c. and all parents this._defaultOptions
  // 2. dispatch those options to any listeners (they _may_ change them)
  // 3. set combinedOptions to the results
  const combinedOptions = this.dispatchEvent(
    'request',
    combineOptions(this, options)
  );

  const {
    url, // strip `url` and `baseURL` so that they aren't in `rest`
    baseURL,
    fetch,
    data,
    headers,
    params,
    responseParserMap,
    responseType,
    ...rest
  } = combinedOptions;

  // choose content-type based on the type of data
  if (data && !headers[CONTENT_TYPE]) {
    headers[CONTENT_TYPE] = computeContentType(data);
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

export default request;
