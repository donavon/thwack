import { resolve } from '@thwack/resolve';
import joinSearch from './joinSearch';
import { defaultParamSerializer } from './defaultParamsSerializer';
import { substituteParamsInPath } from './substituteParamsInPath';

const buildUrl = (options) => {
  const {
    url,
    baseURL = url, // resolver throws if baseURL is empty (per spec)
    params,
    resolver = resolve,
    paramsSerializer = defaultParamSerializer,
  } = options;

  // resolve url=foo base=http://ex.co => http://ex.co/foo
  const absoluteUrl = resolver(url, baseURL);

  // convert http://ex.co/foo:id => http://ex.co/foo/123
  const [moreUrl, remainingParams] = substituteParamsInPath(
    absoluteUrl,
    params
  );

  // url=http://ex.co/foo/123 params={y:2, x:1} => http://ex.co/foo/123?x=1&y=2
  const search = paramsSerializer(remainingParams);
  return joinSearch(moreUrl, search);
};

export default buildUrl;
