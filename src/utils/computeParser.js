import { defaultParserMap } from '../defaults';

const computeParser = (contentTypeHeader, parserMap) => {
  // grab just the actual type
  // ex: 'application/json; charset=utf-8' => 'application/json'
  const [contentType] = contentTypeHeader.split(';');
  const contentTypeTrimmed = contentType.trim(); // just in case there's a misbehaving server

  // grab just the "category"
  // ex: 'application/json' => 'application'
  const [contentTypeMajor] = contentTypeTrimmed.split('/');
  const mergedParserMap = { ...defaultParserMap, ...parserMap };

  const parserType =
    mergedParserMap[contentTypeTrimmed] || // ex: 'application/json'
    mergedParserMap[`${contentTypeMajor}/*`] || // ex: 'application/*'
    mergedParserMap['*/*']; // default to parser type specified by '*/*'

  return parserType;
};

export default computeParser;
