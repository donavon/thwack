import create from './thwack';
import defaultOptions from './defaultOptions';
import ThwackError from './ThwackError';

const mainInstance = create(defaultOptions);

export default mainInstance;

export { ThwackError };
