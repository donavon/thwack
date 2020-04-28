// This is the file used when you import from 'thwack'
import core from '../core';

if (typeof window !== 'undefined') {
  const { fetch, location } = window;
  core.defaults.fetch = fetch;

  /* istanbul ignore next */
  if (location) {
    const { origin, pathname } = location;
    core.defaults.baseURL = `${origin}${pathname}`;
  }
}

export default core;
