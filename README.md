<p align="center">
  <img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79361317-23cd8880-7f13-11ea-9a80-94f1d7e2eb93.png" width="640">
</p>

<h1 align="center">
Thwack. A tiny modern data fetching solution
</h1>

[![npm version](https://badge.fury.io/js/thwack.svg)](https://badge.fury.io/js/thwack)
[![Build Status](https://travis-ci.com/donavon/thwack.svg?branch=master)](https://travis-ci.com/donavon/thwack)
[![All Contributors](https://img.shields.io/badge/all_contributors-11-orange.svg?style=flat-square)](#contributors-)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20Thwack%21%20A%20tiny%20modern%20data%20fetching%20solution.&url=https://github.com/donavon/thwack&via=donavon&hashtags=javascript)
[![Github stars](https://img.shields.io/badge/%E2%AD%90%EF%B8%8F-it%20on%20GitHub-blue)](https://github.com/donavon/thwack/stargazers)

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
TL;DR
</h2>

Thwack is:

- 💻 Modern — Thwack is an HTTP data fetching solution built for modern browsers
- 🔎 Small — Thwack is only ~1.5k gzipped
- 👩‍🏫 Smarter — Built with modern JavaScript
- 😘 Familiar — Thwack uses an Axios-like interface
- 🅰️ Typed — Easier inclusion for TypeScript projects
- ✨ Support for NodeJS 10 and 12
- 📱 Support for React Native

> This README is a work in progress. You can also ask me a question [on Twitter](https://twitter.com/donavon).

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
Installation
</h2>

```bash
$ npm i thwack
```

or

```bash
$ yarn add thwack
```

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
Why Thwack over Axios?
</h2>

Axios was great when it was released back in the day. It gave us a promise based wrapper around `XMLHttpRequest`, which was difficult to use. But that was a long time ago and times have changed — browsers have gotten smarter. Maybe it's time for your data fetching solution to keep up?

Thwack was built from the ground up with modern browsers in mind. Because of this, it doesn't have the baggage that Axios has. Axios weighs in at around ~5k gzipped. Thwack, on the other hand, is a slender ~1.5k.

They support the same API, but there are some differences — mainly around `options` — but for the most part, they should be able to be used interchangeably for many applications.

~~Thwack doesn't try to solve every problem, like Axios does, but instead provides the solution for 98% of what users _really_ need. This is what gives Thwack its feather-light footprint.~~

Scratch that. Thwack provides the same level of power as Axios with a much smaller footprint. And Thwack's promise based event system is easier to use.

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
Methods
</h2>

The following methods are available on all Thwack instances.

### Data fetching

- `thwack(url: string [,options: ThwackOptions]): Promise<ThwackResponse>;`

- `thwack.request(options: ThwackOptions): Promise<ThwackResponse>`
- `thwack.get(url: string [,options: ThwackOptions]): Promise<ThwackResponse>;`

- `thwack.delete(url: string [,options: ThwackOptions]): Promise<ThwackResponse>;`

- `thwack.head(url: string [,options: ThwackOptions]): Promise<ThwackResponse>;`

- `thwack.post(url: string, data:any [,options: ThwackOptions]): Promise<ThwackResponse>;`

- `thwack.put(url: string, data:any [,options: ThwackOptions]): Promise<ThwackResponse>;`

- `thwack.patch(url: string, data:any [,options: ThwackOptions]): Promise<ThwackResponse>;`

### Utility

- `thwack.create(options: ThwackOptions): ThwackInstance;`

  The `create` method creates (da!) a new child instance of the current Thwack instance with the given `options`.

- `thwack.getUri(options: ThwackOptions): string;`

  Thwacks URL resolution is [RFC-3986](https://tools.ietf.org/html/rfc3986#appendix-B) compliant. Axios's is not. It's powered by [`@thwack/resolve`](https://www.npmjs.com/package/@thwack/resolve).

### Event listeners

Thwack supports the following event types: `request`, `response`, `data`, and `error`.

For more information on Thwack's event system, see [Thwack events](#thwack-events) below.

- `thwack.addEventListener(type: string, callback: (event:ThwackEvent) => Promise<any> ): void;`

- `thwack.removeEventListener(type: string, callback: (event:ThwackEvent) => Promise<any> ): void;`

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
Static Methods
</h2>

### Concurrency

Thwack has the following helper functions for making simultaneous requests. They are mostly for Axios compatibility. See the "[How To](#how-to)" section below for example usage.

- `thwack.all(Promise<ThwackResponse>[])`

- `thwack.spread(callback<results>)`

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
ThwackOptions
</h2>

The `options` argument has the following properties.

### `url`

This is either a fully qualified or a relative URL.

### `baseURL`

Defines a base URL that will be used to build a fully qualified URL from `url` above. Must be an absolute URL or `undefined`. Defaults to the `origin` + `pathname` of the current web page if running in a browser or `undefined` on Node or React Native.

For example, if you did this:

```js
thwack('foo', {
  baseURL: 'http://example.com',
});
```

the fetched URL will be:

```
http://example.com/foo
```

### `method`

A string containing one of the following HTTP methods: `get`, `post`, `put`, `patch`, `delete`, or `head`.

### `data`

If the `method` is `post`, `put`, or `patch`, this is the data that will be used to build the request body.

### `headers`

This is where you can place any optional HTTP request headers. Any header you specify here are merged in with any instance header values.

For example, if we set a Thwack instance like this:

```js
const api = thwack.create({
  headers: {
    'x-app-name': 'My Awesome App',
  },
});
```

Then later, when you use the instance, you make a call like this:

```js
const { data } = await api.get('foo', {
  headers: {
    'some-other-header': 'My Awesome App',
  },
});
```

The headers that would be sent are:

```
x-app-name: My Awesome App
some-other-header': 'My Awesome App'

```

### `defaults`

This allows you to read/set the default options for this instance and, in effect, any child instances.

Example:

```js
thwack.defaults.baseURL = 'https://example.com/api';
```

For an instance, `defaults` is the same object passed to `create`. For example, the following will output "https://example.com/api".

```js
const instance = thwack.create({
  baseURL: 'https://example.com/api',
});
console.log(instance.defaults.baseURL);
```

Also note that setting `defaults` on an instance (or even passing `options`) to an instance does NOT effect the parent. So for the following example, `thwack.defaults.baseURL` will still be "https://api1.example.net/".

```js
thwack.defaults.baseURL = 'https://api1.example.net/';
const instance = thwack.create();
instance.defaults.baseURL = 'https://example.com/api';

console.log(thwack.defaults.baseURL);
```

### `params`

This is an optional object that contains the key/value pairs that will be used to build the fetch URL. Is there are any `:key` segments of the `baseURL` or the `url`, they will be replaced with the value of the matching key. For example, if you did this:

```js
thwack('orders/:id', {
  params: { id: 123 },
  baseURL: 'http://example.com',
});
```

the fetched URL will be:

```
http://example.com/orders/123
```

If you don't specify a `:name`, or there are more `param`s than there are `:name`s, then the remaining key/values will be set as search parameters (i.e. `?key=value`).

### `maxDepth`

The maximum level of recursive requests that can be made in a callbck before Thwack throws an error. This is used to prevent an event callback from causing a recursive loop, This if it issues another `request` without proper safeguards in place. Default = 3.

### `responseType`

By default, Thwack will automatically determine how to decode the response data based on the value of the response header `content-type`. However, if the server responds with an incorrect value, you can override the parser by setting `responseType`. Valid values are `arraybuffer`, `document` (i.e. `formdata`), `json`, `text`, `stream`, and `blob`. Defaults to automatic.

What is returned by Thwack is determined by the following table. The "fetch method" column is what is resolved in `data`. If you do not specify a `responseType`, Thwack will automatically determine the fetch method based on `content-type` and the `responseParserMap` table (see below).

|     Content-Type      | `responseType` |                      `fetch` method                      |
| :-------------------: | :------------: | :------------------------------------------------------: |
|  `application/json`   |     `json`     |                    `response.json()`                     |
| `multipart/form-data` |   `formdata`   |                  `response.formData()`                   |
| `text/event-stream` |    `stream`    | passes back `response.body` as `data` without processing |
|                       |     `blob`     |                    `response.blob()`                     |
|                       | `arraybuffer`  |                 `response.arrayBuffer()`                 |
|         `*/*`         |     `text`     |                    `response.text()`                     |

> Note: `stream` is currently unsupported in React Native due to [#27741](https://github.com/facebook/react-native/issues/27741)

### `responseParserMap`

Another useful way to determine which response parser to use is with `responseParserMap`. It allows you to set up a mapping between the resulting `content-type` from the response header and the parser type.

Thwack uses the following map as the default, which allows `json` and `formdata` decoding. If there are no matches, the response parser defaults to `text`. You may specify a default by setting the special `*/*` key.

```json
{
  "application/json": "json",
  "multipart/form-data": "formdata",
  "*/*": "text"
};
```

Any value you specify in `responseParserMap` is merged into the default map. That is to say that you can override the defaults and/or add new values.

Let's say, for example, you would like to download an image into a blob. You could set the `baseURL` to your API endpoint and a `responseParserMap` that will download images of any type as blobs, but will still allow `json` downloads (as this is the default for a `content-type: application/json`).

```js
import thwack from 'thwack';

thwack.defaults.responseParserMap = { 'image/*': 'blob' };
```

Any URL that you download with an `image/*` content type (e.g. `image/jpeg`, `image/png`, etc) will be parsed with the `blob` parser.

```js
const getBlobUrl = async (url) => {
  const blob = (await thwack.get(url)).data;
  const objectURL = URL.createObjectURL(blob);
  return objectURL;
};
```

See this example running on [CodeSandbox](https://codesandbox.io/s/load-image-as-blob-410uq).

> Note that you can use this technique for other things other than images.

As you can see, using `responseParserMap` is a great way to eliminate the need to set `responseType` for different Thwack calls.

### `validateStatus`

This optional function is used to determine what status codes Thwack uses to return a promise or throw. It is passed the response `status`. If this function returns truthy, the promise is resolved, else the promise is rejected.

The default function throws for any status not in the 2xx (i.e. 200-299)

### `paramsSerializer`

This is an optional function which Thwack will call to serialize the `params`. For example, given an object `{a:1, b:2, foo: 'bar'}`, it should serialize to the string `a=1&b=2&foo=bar`.

For most people, the [default serializer](https://github.com/donavon/thwack/blob/master/src/core/utils/buildUrl/defaultParamSerializer.js) should work just fine. This is mainly for edge case and Axios compatibility.

> Note that the default serializer alphabetizes the parameters, which is a good practice to follow. If, however, this doesn't work for your situation, you can roll your own serializer.

### `resolver`

This is a function that you can provide to override the [default resolver](https://github.com/donavon/thwack-resolve) behavior. `resolver` takes two arguments: a `url` and a `baseURL` which must be undefined, or an absolute URL. There should be little reason for you to to replace the resolver, but this is your escape hatch in case you need to.

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
ThwackResponse
</h2>

### `status`

A `number` representing the 3 digit [HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) that was received.

- 1xx - Informational response
- 2xx - Success
- 3xx - Redirection
- 4xx - Client errors
- 5xx - Server errors

### `ok`

A `boolean` set to true is the `status` code in the 2xx range (i.e. a success). This value is not effected by `validateStatus`.

### `statusText`

A `string` representing the text of the `status` code. You should use the `status` code (or `ok`) in any program logic.

### `headers`

A key/value object with the returned HTTP headers. Any duplicate headers will be concatenated into a single header separated by semicolons.

### `data`

This will hold the returned body of the HTTP response after it has been streamed and converted. The only exception is if you used the `responseType` of `stream`, in which case `data` is set directly to the `body` element.

If a `ThwackResponseError` was thrown, `data` will be the plain text representation of the response body.

### `options`

The complete `options` object that processed the request. This `options` will be fully merged with any parent instance(s), as well as with `defaults`.

### `response`

The complete HTTP `Response` object as returned by `fetch` or the `response` from a synthetic event callback.

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
ThwackResponseError
</h2>

If the response from a Thwack request results in a non-2xx `status` code (e.g. 404 Not Found) then a `ThwackResponseError` is thrown.

> Note: It is possible that other types of errors could be thrown (e.g. a bad event listener callback), so it is a best practice to interrogate the caught error to see if it is of type `ThwackResponseError`.

```js
try {
  const { data } = await thwack.get(someUrl)
} catch (ex) {
  if (ex instanceof thwack.ThwackResponseError)
    const { status, message } = ex;
    console.log(`Thwack status ${status}: ${message}`);
  } else {
    throw ex; // If not, rethrow the error
  }
}
```

A `ThwackResponseError` has all of the properties of a normal JavaScript `Error` plus a `thwackResponse` property with the same properties as a success status.

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
Instances
</h2>

Instances created in Thwack are based on the parent instance. A parent's default options pass down through the instances. This can come in handy for setting up options in the parent that can affect the children, such as `baseURL`,

Inversely, parents can use `addEventListener` to monitor their children (see the [How to log every API call](#how-to-log-every-api-call) below for an example of this).

<img alt="flow char" src="https://user-images.githubusercontent.com/887639/79186980-06040480-7de9-11ea-8362-a5b187d231b8.png" width="476">

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
Thwack events
</h2>

Combined with instances, the Thwack event system is what makes Thwack extremely powerful. With it, you can listen for different events.

Here is the event flow for all events. AS you can see, it is possible for your code to get into an endless loop, should your callback blindly issue a `request()` without checking to see if it's already done so, so take caution.

![thwack events](https://user-images.githubusercontent.com/887639/79867660-aee3ce00-83ac-11ea-94fd-4078c1a36244.png)

### The `request` event

Whenever any part of the application calls one of the data fetching methods, a `request` event is fired. Any listeners will get a `ThwackRequestEvent` object which has the `options` of the call in `event.options`. These event listeners can do something as simple as ([log the event](#log-every-request)) or as complicated as preventing the request and returning a response with ([mock data](#return-mock-data))

```js
// callback will be called for every request made in Thwack
thwack.addEventListener('request', callback);
```

> Note that callbacks can be `async` allowing you to defer Thwack so that you might, for example, go out and fetch data a different URL before proceeding.

### The `response` event

The event is fired _after_ the HTTP headers are received, but _before_ the body is streamed and parsed. Listeners will receive a `ThwackResponseEvent` object with a `thwackResponse` key set to the response.

### The `data` event

The event is fired after the body is streamed and parsed. It is fired only if the fetch returned a 2xx status code. Listeners will receive a `ThwackDataEvent` object with a `thwackResponse` key set to the response.

### The `error` event

The event is fired after the body is streamed and parsed. It is fired if the fetch returned a non-2xx status code. Listeners will receive a `ThwackErrorEvent` object with a `thwackResponse` key set to the response.

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
NodeJS
</h2>

Thwack will work on NodeJS, but requires a polyfill for `window.fetch`. Luckily, there is a wonderful polyfill called [`node-fetch`](https://github.com/node-fetch/node-fetch) that you can use.

If you are using NodeJS version 10, you will also need a polyfill for `Array#flat` and `Object#fromEntries`. NodeJS version 11+ has these methods and does not require a polyfill.

You can either provide these polyfills yourself, or use one of the following convenience imports instead. If you are running NodeJS 11+, use:

```js
import thwack from 'thwack/node'; // NodeJS version 12+
```

If you are running on NodeJS 10, use:

```js
import thwack from 'thwack/node10'; // NodeJS version 10
```

If you wish to provide these polyfills yourself, then to use Thwack, you must import from `thwack/core` and set `fetch` as the default for `fetch` as so.

```js
import thwack from 'thwack/code';
thwack.defaults.fetch = global.fetch;
```

This should be done in your app startup code, usually `index.js`.

> Note: The `responseType` of `blob` is not supported on NodeJS.

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
React Native
</h2>

Thwack is compatible with React Native and needs no additional polyfills. See below for a sample app written in React Native.

> Note: React Native does not support `stream` due to [#27741](https://github.com/facebook/react-native/issues/27741)

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
How to
</h2>

### Multiple concurrent requests

You can use `thwack.all()` and `thwack.spread()` to make simultaneous requests. Data is then presented to your callback as one array.

Here we display information for two GitHub users.

```js
function displayGitHubUsers() {
  return thwack
    .all([
      thwack.get('https://api.github.com/users/donavon'),
      thwack.get('https://api.github.com/users/revelcw'),
    ])
    .then(
      thwack.spread((...results) => {
        const output = results
          .map(
            ({ data }) => `${data.login} has ${data.public_repos} public repos`
          )
          .join('\n');
        console.log(output);
      })
    );
}
```

Note the these are simply helper functions. If you are using `async`/`await` you can write this without the Thwack helpers using `Promise.all`.

```js
async function displayGitHubUsers() {
  const results = await Promise.all([
    thwack.get('https://api.github.com/users/donavon'),
    thwack.get('https://api.github.com/users/revelcw'),
  ]);
  const output = results
    .map(({ data }) => `${data.login} has ${data.public_repos} public repos`)
    .join('\n');
  console.log(output);
}
```

You can see this running live in the [CodeSandbox](https://codesandbox.io/s/thwack-allspread-demo-zx2nt?file=/src/index.js:140-642).

(Demo inspired by [this blob post](https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/) on axios/fetch)

### Cancelling a request

Use an `AbortController` to cancel requests by passing its `signal` in the `thwack` options.

In the browser, you can use the built-in [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

```js
import thwack from 'thwack';

const controller = new AbortController();
const { signal } = controller;

thwack(url, { signal }).then(handleResponse).catch(handleError);

controller.abort();
```

In NodeJS, you can use something like [abort-controller](https://www.npmjs.com/package/abort-controller).

```js
import thwack from 'thwack';
import AbortController from 'abort-controller';

const controller = new AbortController();
const { signal } = controller;

thwack(url, { signal }).then(handleResponse).catch(handleError);

controller.abort();
```

In case you want to perform some action on request cancellation, you can listen to the `abort` event on `signal` too:

```js
signal.addEventListener('abort', handleAbort);
```

### Log every request

Add an `addEventListener('request', callback)` and log each request to the console.

```js
import thwack from 'thwack';

thwack.addEventListener('request', (event) => {
  console.log('hitting URL', thwack.getUri(event.options));
});
```

If you are using React, here is a Hook that you can "use" in your App that will accomplish the same thing.

```js
import { useEffect } from 'react';
import thwack from 'thwack';

const logUrl = (event) => {
  const { options } = event;
  const fullyQualifiedUrl = thwack.getUri(options);
  console.log(`hitting ${fullyQualifiedUrl}`);
};

const useThwackLogger = () => {
  useEffect(() => {
    thwack.addEventListener('request', logUrl);
    return () => thwack.removeEventListener('request', logUrl);
  }, []);
};

export default useThwackLogger;
```

Here is a code snippet on how to use it.

```js
const App = () ={
  useThwackLogger()

  return (
    <div>
      ...
    </div>
  )
}
```

### Return mock data

Let's say you have an app that has made a request for some user data. If the app is hitting a specific URL (say `users`) and querying for a particular user ID (say `123`), you would like to prevent the request from hitting the server and instead mock the results.

The `status` in the `ThwackResponse` defaults to 200, so unless you need to mock a non-OK response, you only need to return `data`.

```js
thwack.addEventListener('request', async (event) => {
  const { options } = event;
  if (options.url === 'users' && options.params.id === 123) {
    // tells Thwack to use the returned value instead of handling the event itself
    event.preventDefault();

    // stop other listeners (if any) from further processing
    event.stopPropagation();

    // because we called `preventDefault` above, the caller's request
    // will be resolved to this `ThwackResponse` (defaults to status of 200 and ok)
    return new thwack.ThwackResponse(
      {
        data: {
          name: 'Fake Username',
          email: 'fakeuser@example.com',
        },
      },
      options
    );
  }
});
```

### Convert DTO to Model

Often it is desirable to convert a DTO (Data Transfer Object) into something easier to consume by the client. In this example below, we convert a complex DTO into `firstName`, `lastName`, `avatar`, and `email`. Other data elements that are returned from the API call, but not needed by the applications, are ignored.

You can see an example of DTO conversion, logging, and returning fake data in this sample app.

<div>
<img src="https://user-images.githubusercontent.com/887639/79865700-94f4bc00-83a9-11ea-9de6-9f204d5857c8.png" width="500" height="526" alt="Mickey Mouse sample app">
</div>

You can [view the source code](https://codesandbox.io/s/sharp-chatelet-mje3w?file=/src/App.js) on CodeSandbox.

### Load an Image as a Blob

In this example, we have a React Hook that loads an image as a Blob URL. It caches the URL to Blob URL mapping in session storage. Once loaded, any refresh of the page will instantaneously load the image from Blob URL.

```js
const useBlobUrl = (imageUrl) => {
  const [objectURL, setObjectURL] = useState('');

  useEffect(() => {
    let url = sessionStorage.getItem(imageUrl);

    async function fetchData() {
      if (!url) {
        const { data } = await thwack.get(imageUrl, {
          responseType: 'blob',
        });
        url = URL.createObjectURL(data);
        sessionStorage.setItem(imageUrl, url);
      }
      setObjectURL(url);
    }

    fetchData();
  }, [imageUrl]);

  return objectURL;
};
```

See this example on [CodeSandbox](https://codesandbox.io/s/thwack-demo-load-image-as-blob-x0rnl?file=/src/ImageBlob/useBlobUrl.js)

### Selective routing

Right now you have a REST endpoint at `https://api.example.com`. Suppose you've published a new REST endpoint to a different URL and would like to start slowly routing 2% of network traffic to these new servers.

> Note: normally this would be handled by your load balancer on the back-end. It's shown here for demonstration purposes only.

We could accomplish this by replacing `options.url` in the request event listener as follows.

```js
thwack.addEventListener('request', (event) => {
  if (Math.random() >= 0.02) {
    return;
  }

  // the code will be executed for approximately 2% of the requests
  const { options } = event;
  const oldUrl = thwack.getUri(options);
  const url = new URL('', oldUrl);
  url.origin = 'https://api2.example.com'; // point the origin at the new servers
  const newUrl = url.href; // Get the fully qualified URL
  event.options = { ...event.options, url: newUrl }; // replace `options`]
});
```

### React Native sample app

Along with `use-thwack`, writing a data fetching app for React Native couldn't be easier.

View the entire app [running on Expo](https://snack.expo.io/@donavon/random-dog).

<img alt="good dog app" src="https://user-images.githubusercontent.com/887639/80429496-3dc77d80-88ba-11ea-84e2-ebe9a2d69cc8.png" height="800" width="380">

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
Credits
</h2>

Thwack is **heavily** inspired by the [Axios](https://github.com/Axios/Axios). Thanks [Matt](https://twitter.com/mzabriskie)!

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
License
</h2>

Licensed under [MIT](LICENSE)

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79779619-a8037f80-8308-11ea-8c4d-e7193fa15ae8.png" width="22">
Contributors ✨
</h2>

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://donavon.com"><img src="https://avatars3.githubusercontent.com/u/887639?v=4" width="100px;" alt=""/><br /><sub><b>Donavon West</b></sub></a><br /><a href="#infra-donavon" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/donavon/thwack/commits?author=donavon" title="Tests">⚠️</a> <a href="#example-donavon" title="Examples">💡</a> <a href="#ideas-donavon" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-donavon" title="Maintenance">🚧</a> <a href="https://github.com/donavon/thwack/pulls?q=is%3Apr+reviewed-by%3Adonavon" title="Reviewed Pull Requests">👀</a> <a href="#tool-donavon" title="Tools">🔧</a> <a href="https://github.com/donavon/thwack/commits?author=donavon" title="Code">💻</a></td>
    <td align="center"><a href="http://jeremytice.com"><img src="https://avatars0.githubusercontent.com/u/1740479?v=4" width="100px;" alt=""/><br /><sub><b>Jeremy Tice</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=jetpacmonkey" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/yurm04"><img src="https://avatars0.githubusercontent.com/u/4642404?v=4" width="100px;" alt=""/><br /><sub><b>Yuraima Estevez</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=yurm04" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/bargar"><img src="https://avatars2.githubusercontent.com/u/1666818?v=4" width="100px;" alt=""/><br /><sub><b>Jeremy Bargar</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=bargar" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/brookescarlett"><img src="https://avatars1.githubusercontent.com/u/26016393?v=4" width="100px;" alt=""/><br /><sub><b>Brooke Scarlett Yalof</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=brookescarlett" title="Documentation">📖</a></td>
    <td align="center"><a href="https://twitter.com/karlhorky"><img src="https://avatars2.githubusercontent.com/u/1935696?v=4" width="100px;" alt=""/><br /><sub><b>Karl Horky</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=karlhorky" title="Documentation">📖</a></td>
    <td align="center"><a href="https://kojikanao.netlify.com/"><img src="https://avatars0.githubusercontent.com/u/474225?v=4" width="100px;" alt=""/><br /><sub><b>Koji</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=koji" title="Documentation">📖</a> <a href="https://github.com/donavon/thwack/commits?author=koji" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/tomByrer"><img src="https://avatars2.githubusercontent.com/u/1308419?v=4" width="100px;" alt=""/><br /><sub><b>Tom Byrer</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=tomByrer" title="Documentation">📖</a></td>
    <td align="center"><a href="https://iansutherland.ca/"><img src="https://avatars2.githubusercontent.com/u/433725?v=4" width="100px;" alt=""/><br /><sub><b>Ian Sutherland</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=iansu" title="Code">💻</a></td>
    <td align="center"><a href="https:///www.blakeyoder.com"><img src="https://avatars0.githubusercontent.com/u/5393338?v=4" width="100px;" alt=""/><br /><sub><b>Blake Yoder</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=blakeyoder" title="Code">💻</a></td>
    <td align="center"><a href="http://www.ryanhinchey.co"><img src="https://avatars0.githubusercontent.com/u/3943764?v=4" width="100px;" alt=""/><br /><sub><b>Ryan Hinchey</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=ryhinchey" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/MiroDojkic"><img src="https://avatars2.githubusercontent.com/u/9119913?v=4" width="100px;" alt=""/><br /><sub><b>Miro Dojkic</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=MiroDojkic" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/santicevic"><img src="https://avatars3.githubusercontent.com/u/45316219?v=4" width="100px;" alt=""/><br /><sub><b>santicevic</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=santicevic" title="Documentation">📖</a> <a href="https://github.com/donavon/thwack/commits?author=santicevic" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
