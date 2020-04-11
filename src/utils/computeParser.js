import { defaultParserMap } from '../defaults';

const computeParser = (contentTypeHeader, parserMap = defaultParserMap) => {
  // grab just the actual type
  // ex: 'application/json; charset=utf-8' => 'application/json'
  const [contentType] = contentTypeHeader.split(';');
  const contentTypeTrimmed = contentType.trim(); // just in case there's a misbehaving server

  // grab just the "category"
  // ex: 'application/json' => 'application'
  const [contentTypeMajor] = contentTypeTrimmed.split('/');

  return (
    parserMap[contentTypeTrimmed] || // ex: 'application/json'
    parserMap[contentTypeMajor] || // ex: 'application'
    parserMap.default || // default to parser specified by 'default'
    'text' // default to 'text'
  );
};

export default computeParser;
