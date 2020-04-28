import { APPLICATION_JSON, CONTENT_TYPE } from './defaults';
import buildUrl from './utils/buildUrl';
import computeContentType from './utils/computeContentType';

const fetcher = async function (options) {
  const {
    url,
    baseURL,
    fetch,
    data,
    headers,
    params,
    responseParserMap,
    responseType,
    maxDepth, // don't pass to fetch
    ...rest
  } = options;

  if (!fetch) {
    throw new Error(
      'Thwack: Invalid options object during request. Check your event callbacks.'
    );
  }

  // choose content-type based on the type of data
  if (data && !headers[CONTENT_TYPE]) {
    headers[CONTENT_TYPE] = computeContentType(data);
  }
  const body =
    data && headers[CONTENT_TYPE] === APPLICATION_JSON
      ? JSON.stringify(data)
      : data;

  const fetchUrl = buildUrl({ ...options, url, baseURL });

  const fetchOptions = {
    ...(Object.keys(headers).length !== 0 && { headers }), // add if not empty object
    ...(!!body && { body, method: 'post' }), // if body not empty add it and default method to POST
    ...rest,
  };

  return fetch(fetchUrl, fetchOptions);
};

export default fetcher;
