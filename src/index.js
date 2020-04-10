import create from './thwack';
import defaultOptions from './defaultOptions';
import ThwackError from './ThwackError';

const mainInstance = create(defaultOptions);
mainInstance.ThwackError = ThwackError;

export default mainInstance;
