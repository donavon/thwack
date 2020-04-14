import { APPLICATION_JSON, CONTENT_TYPE } from './defaults';

import ThwackRequestEvent from './ThwackEvents/ThwackRequestEvent';
import buildUrl from './utils/buildUrl';
import combineOptions from './utils/combineOptions';
import computeParser from './utils/computeParser';
import compatParser from './utils/compatParser';
import computeContentType from './utils/computeContentType';
import ThwackResponseError from './ThwackErrors/ThwackResponseError';

const request = async function (requestOptions) {
  // Compute the options to use
  // 1. combine options from:
  //  a. passed `requestOptions`
  //  b. `this.defaultOptions` (i.e. when instance was created)
  //  c. and all parents' `this.defaultOptions`
  // 2. dispatch those options to any listeners (they _may_ change them)
  //    by changing the value of `requestEvent.options`
  // 3. set options to the results of `requestEvent.options`
  const requestEvent = new ThwackRequestEvent(
    combineOptions(this, requestOptions)
  );
  this.dispatchEvent(requestEvent);
  const { defaultPrevented, options, promise } = requestEvent;

  if (defaultPrevented) {
    return promise;
  }

  const {
    url,
    baseURL,
    fetch,
    data,
    headers,
    params,
    responseParserMap,
    responseType,
    ...rest
  } = options;

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
  const { status, ok, statusText, headers: responseHeaders } = response;

  const thwackResponse = {
    status,
    statusText,
    ok,
    headers: Object.fromEntries(responseHeaders.entries()),
    response,
  };

  if (response.ok) {
    const contentTypeHeader = response.headers.get(CONTENT_TYPE);
    const responseParserType =
      responseType || computeParser(contentTypeHeader, responseParserMap);
    const compatResponseParserType = compatParser(responseParserType);
    const responseData =
      compatResponseParserType === 'stream'
        ? response.body
        : await response[compatResponseParserType]();

    thwackResponse.data = responseData;
    return thwackResponse;
  }

  // if not OK then throw with text of body as the message
  const responseData = await response.text();
  thwackResponse.data = responseData;
  throw new ThwackResponseError(thwackResponse);
};

export default request;
