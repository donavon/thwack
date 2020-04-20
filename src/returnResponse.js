import { CONTENT_TYPE } from './defaults';
import computeParser from './utils/computeParser';
import compatParser from './utils/compatParser';
import ThwackResponse from './ThwackResponse';
import ThwackDataEvent from './ThwackEvents/ThwackDataEvent';
import ThwackErrorEvent from './ThwackEvents/ThwackErrorEvent';
import ThwackResponseError from './ThwackErrors/ThwackResponseError';

async function fetchResponseData(thwackResponse) {
  const { response, options } = thwackResponse;

  // if body is not present then response is "synthetic" (i.e. created from
  // a mock source) so don't stream and parse the body. instead, use the
  // synthetic thwackResponse.data field
  if (response.body) {
    const { responseType, responseParserMap } = options;
    const contentTypeHeader = thwackResponse.headers[CONTENT_TYPE];
    const responseParserType =
      responseType || computeParser(contentTypeHeader, responseParserMap);
    const compatResponseParserType = compatParser(responseParserType);
    const responseData =
      compatResponseParserType === 'stream'
        ? response.body
        : await response[compatResponseParserType]();
    return responseData;
  }
  return thwackResponse.data;
}

// return either a thwackResponse (if 2xx) or throw a ThwackResponseError
const returnResponse = async function (thwackResponse) {
  if (!(thwackResponse instanceof ThwackResponse)) {
    throw new Error('Thwack: callback must return a ThwackResponse');
  }
  const { ok, response } = thwackResponse;

  // was it a the 2xx response?
  if (ok) {
    // eslint-disable-next-line no-param-reassign
    thwackResponse.data = await fetchResponseData(thwackResponse);

    // dispatch a "data" event here
    const dataEvent = new ThwackDataEvent(thwackResponse);
    const payload = await this.dispatchEvent(dataEvent);
    const { defaultPrevented } = dataEvent;
    if (defaultPrevented && !payload.ok) {
      return returnResponse.call(this, payload);
    }
    return payload;
  }

  // if NOT ok then throw with text of body as the message
  if (response.body) {
    // eslint-disable-next-line no-param-reassign
    thwackResponse.data = await response.text();
  }
  // dispatch an "error" event here
  const errorEvent = new ThwackErrorEvent(thwackResponse);
  const payload = await this.dispatchEvent(errorEvent);
  const { defaultPrevented } = errorEvent;
  if (defaultPrevented && payload.ok) {
    return returnResponse.call(this, payload);
  }

  if (!(payload instanceof ThwackResponse)) {
    throw new Error('Thwack: callback must return a ThwackResponse');
  }

  throw new ThwackResponseError(payload);
};

export default returnResponse;
