import sortByEntry from './sortByEntry';

// Builds a complete URL from a URL, a base URL, and a query object
//
// For example:
//   buildUrl('/foo/:id', 'http://example.com/bar', {id:123, color:'red'})
//
// Would return:
//   http://example.com/foo/123?color=red
//
const buildUrl = (url = '', baseUrl, query) => {
  const mutatedQuery = { ...query };
  const newUrl = new URL(url, baseUrl);

  // substitute any :name in the path for query.name
  newUrl.pathname = newUrl.pathname
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        const key = segment.substr(1);
        const value = mutatedQuery[key];
        delete mutatedQuery[key];
        return encodeURIComponent(value);
      }
      return segment;
    })
    .join('/');

  // build query string from remaining keys in mutatedQuery
  Object.entries(mutatedQuery)
    .sort(sortByEntry)
    .forEach((pair) => {
      newUrl.searchParams.set(...pair);
    });

  return newUrl.href;
};

export default buildUrl;
