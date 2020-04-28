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
            .then(
              // TODO use nullish coalescing when supported by microbundle, like this:
              // () => !event.propagationStopped ?? listener(event)
              () => {
                depth += 1;
                if (depth >= 5) {
                  throw new Error('Thwack: maximum request depth reached');
                }
                return event.propagationStopped ? undefined : listener(event);
              }
            )
            .finally(() => {
              depth -= 1;
            })
            // if callback returned payload (or a promise that resolves to payload)
            // then set the payload in the event object
            .then((payload) => {
              if (payload !== undefined) {
                event._payload = payload;
              }
            }),
        // start with the promise from the parent or a resolved promise if no parent
        parent ? parent.dispatchEvent(event) : Promise.resolve()
      )
      // return the event payload to the caller
      .then(() => event._payload);
};
