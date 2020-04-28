// Axios options for options.responseType are:
// 'arraybuffer', 'document', 'json', 'text', 'stream', 'blob'

const compatMap = {
  arraybuffer: 'arrayBuffer',
  document: 'formData',
};

const compatParser = (responseParserType) =>
  compatMap[responseParserType] || responseParserType;

export default compatParser;
