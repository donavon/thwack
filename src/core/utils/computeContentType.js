import { APPLICATION_JSON } from '../defaults';

// Only test for instanceodf Blob if running on a system that supports them.
// Blobs are not supported on NodeJS, for example.
const isBlobSupported = typeof Blob !== 'undefined';

// If the data is a Blob, grab its type
// else default to 'application/json'
const computeContentType = (data) =>
  isBlobSupported && data instanceof Blob ? data.type : APPLICATION_JSON;

export default computeContentType;
