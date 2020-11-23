/* eslint-disable no-param-reassign */

export const events = (instance, parent) => {
  // private properties
  let depth = 0;
  const listeners = {
    request: [],
    response: [],
    data: [],
    error: [],
  };

  instance.addEventListener = (type, callback) => {
    listeners[type].push(callback);
  };

  instance.removeEventListener = (type, callback) => {
    listeners[type] = listeners[type].filter(
      (listener) => listener !== callback
    );
  };

  instance.dispatchEvent = (event) =>
    listeners[event.type]
      .reduce(
        (promise, listener) =>
          promise
            // call our next callback (unless propagationStopped was called)
            .then(() => {
              depth += 1;
              if (depth >= 5) {
                throw new Error('Thwack: maximum request depth reached');
              }
              return event.propagationStopped ? undefined : listener(event);
            })
            .finally(() => {
              depth -= 1;
            }),
        // start with the promise from the parent or a resolved promise if no parent
        parent ? parent.dispatchEvent(event) : Promise.resolve()
      )
      // return the event payload to the caller
      .then(() => event._payload);
};
