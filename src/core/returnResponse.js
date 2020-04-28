import { CONTENT_TYPE } from './defaults';
import { defaultValidateStatus } from './utils/defaultValidateStatus';
import computeParser from './utils/computeParser';
import compatParser from './utils/compatParser';
import ThwackResponse from './ThwackResponse';
import ThwackDataEvent from './ThwackEvents/ThwackDataEvent';
import ThwackErrorEvent from './ThwackEvents/ThwackErrorEvent';
import ThwackResponseError from './ThwackErrors/ThwackResponseError';

async function fetchResponseData(thwackResponse) {
  const { response, options } = thwackResponse;

  // if `response` is NOT a instance of `Response` then it is "synthetic"
  // (i.e. created from a mock source) so don't stream and parse the body.
  // Instead, return the synthetic `thwackResponse.data` field.
  // Note: React Native does NOT expose `body` so stream is unsupported
  // see https://github.com/facebook/react-native/issues/27741
  const { responseType, responseParserMap } = options;
  const contentTypeHeader = thwackResponse.headers[CONTENT_TYPE];
  const responseParserType =
    responseType || computeParser(contentTypeHeader, responseParserMap);
  const compatResponseParserType = compatParser(responseParserType); // axios > thwack mapping

  if (compatResponseParserType === 'stream') {
    return response.body;
  }

  if (response[compatResponseParserType]) {
    return response[compatResponseParserType]();
  }

  // Return the synthetic data
  return thwackResponse.data;
}

// return either a thwackResponse (if 2xx) or throw a ThwackResponseError
const returnResponse = async function (thwackResponse) {
  if (!(thwackResponse instanceof ThwackResponse)) {
    throw new Error('Thwack: callback must return a ThwackResponse');
  }
  // eslint-disable-next-line no-param-reassign
  thwackResponse.data = await fetchResponseData(thwackResponse);

  const { validateStatus = defaultValidateStatus } = thwackResponse.options;

  // should we
  if (validateStatus(thwackResponse.status)) {
    // dispatch a "data" event here
    const dataEvent = new ThwackDataEvent(thwackResponse);
    const payload = await this.dispatchEvent(dataEvent);
    const { defaultPrevented } = dataEvent;
    if (defaultPrevented && !payload.ok) {
      return returnResponse.call(this, payload);
    }
    return payload;
  }

  // if NOT ok then throw, but first dispatch an "error" event
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
