import { APPLICATION_JSON } from '../defaults';

// If the data is a Blog, grab its type
// else default to 'application/json'
const computeContentType = (data) =>
  data instanceof Blob ? data.type : APPLICATION_JSON;

export default computeContentType;
