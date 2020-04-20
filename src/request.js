import fetcher from './fetcher';
import returnResponse from './returnResponse';
import ThwackResponseEvent from './ThwackEvents/ThwackResponseEvent';
import ThwackRequestEvent from './ThwackEvents/ThwackRequestEvent';
import combineOptions from './utils/combineOptions';
import ThwackResponse from './ThwackResponse';

const request = async function (requestOptions) {
  // Compute the options to use
  // 1. combine options from:
  //  a. passed `requestOptions`
  //  b. `this.defaultOptions` (i.e. when instance was created)
  //  c. and all parents' `this.defaultOptions`
  // 2. dispatch those options to any listeners (they _may_ change them)
  //    by returning a new options as payload
  // 3. set options to the returned payload unless...
  //    payload is a ThwackResponse, in which skip calling fetcher
  const { maxDepth, ...combinedOptions } = combineOptions(this, requestOptions);

  // before we do anything, dispatch a "request" event with the combined options
  // one of the callbacks may optionally return a ThwackResponse (if preventDefault)
  // or possibly alter the options
  const requestEvent = new ThwackRequestEvent(combinedOptions);
  const payload = await this.dispatchEvent(requestEvent);
  const { defaultPrevented } = requestEvent;
  if (defaultPrevented) {
    // bail out with a ThwackResponse (will be checked in returnResponse)
    return returnResponse.call(this, payload);
  }

  // assume payload is options (fetcher will check for sure)
  const options = payload;
  const response = await fetcher(options);
  const responseEvent = new ThwackResponseEvent(
    new ThwackResponse(response, options)
  );

  // no need to check preventDefault here as both the default and the alternative
  // would both lead to returnResponse
  return returnResponse.call(this, await this.dispatchEvent(responseEvent));
};

export default request;
