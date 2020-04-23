import Thwack from './Thwack';
import ThwackResponseError from './ThwackErrors/ThwackResponseError';
import ThwackResponse from './ThwackResponse';
import { defaultOptions } from './defaults';

// expose a single Thwack instance using top level defaults
const mainInstance = new Thwack(defaultOptions);

// export these "static" methods only on the main instance
mainInstance.ThwackResponseError = ThwackResponseError;
mainInstance.ThwackResponse = ThwackResponse;
mainInstance.all = (promises) => Promise.all(promises);
mainInstance.spread = (callback) => (results) => callback(...results);

export default mainInstance;
