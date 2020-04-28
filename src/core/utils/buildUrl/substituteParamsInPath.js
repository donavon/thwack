export const substituteParamsInPath = (path, params) => {
  // substitute any :name in the path for params.name
  const remainingParams = { ...params };
  const newPath = path
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        const key = segment.substr(1);
        const value = remainingParams[key];
        delete remainingParams[key];
        return encodeURIComponent(value);
      }
      return segment;
    })
    .join('/');

  return [newPath, remainingParams];
};
