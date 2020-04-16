<p align="center">
  <img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79361317-23cd8880-7f13-11ea-9a80-94f1d7e2eb93.png" width="640">
</p>

<h1 align="center">
Thwack. A tiny modern data fetching solution
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/thwack"><img src="https://img.shields.io/npm/v/thwack.svg?style=flat-square"></a>
  <a href="https://travis-ci.com/donavon/thwack"><img src="https://img.shields.io/travis/donavon/thwack/master.svg?style=flat-square"></a>
  <img src="https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square">
</p>

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
TL;DR
</h2>

Thwack is:

- 💻 Modern - Thwack is an HTTP data fetching solution build for modern browsers
- 🔎 Small — Thwack is only ~1.5k gzipped
- 👩‍🏫 Smarter — Built with modern JavaScript
- 😘 Familiar — Thwack uses an Axios-like interface

> This README is a work in progress. You can also ask me a question [on Twitter](https://twitter.com/donavon).

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
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
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
Why Thwack over Axios?
</h2>

Axios was great when it was released back in the day. It gave us a promise based wrapper around `XMLHttpRequest`, which was difficult to use. But that was a long time ago and times have changed — browsers have gotten smarter. Maybe it's time for your data fetching solution to keep up?

Thwack was built from the ground up with modern browsers in mind. Because of this, it doesn't have the baggage that Axios has. Axios weighs in at around ~5k gzipped. Thwack, on the other hand, is a slender ~1.5k.

They support the same API, but there are some differences — mainly around `options` — but for the most part, they should be able to be used interchangeably for many applications.

Thwack doesn't try to solve every problem, like Axios does, but instead provides the solution for 98% of what users _really_ need. This is what gives Thwack its feather-light footprint.

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
Methods
</h2>

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

### Event listeners

For more information on Thwack's event system, see [Thwack events](#thwack-events) below.

- `thwack.addEventListener(type: string,callback: (event:ThwackEvent) => void ): void;`

- `thwack.removeEventListener(type: string,callback: (event:ThwackEvent) => void ): void;`

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
ThwackOptions
</h2>

The `options` argument has the following properties.

### `url`

This is either a fully qualified or a relative URL.

### `baseURL`

Defines a base URL that will be used to build a fully qualified URL from `url` above. Defaults to the `origin` + `pathname` of the current web page.

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

### `responseType`

By default, Thwack will automatically determine how to decode the response data based on the value of the response header `content-type`. However, if the server responds with an incorrect value, you can override the parser by setting `responseType`. Valid values are `arraybuffer`, `document` (i.e. `formdata`), `json`, `text`, `stream`, and `blob`. Defaults to automatic.

What is returned by Thwack is determined by the following table. The "fetch method" column is what is resolved in `data`. If you do not specify a `responseType`, Thwack will automatically determine the fetch method based on `content-type` and the `responseParserMap` table (see below).

|     Content-Type      | `responseType` |                      `fetch` method                      |
| :-------------------: | :------------: | :------------------------------------------------------: |
|  `application/json`   |     `json`     |                    `response.json()`                     |
| `multipart/form-data` |   `formdata`   |                  `response.formData()`                   |
|                       |    `stream`    | passes back `response.body` as `data` without processing |
|                       |     `blob`     |                    `response.blob()`                     |
|                       | `arraybuffer`  |                 `response.arrayBuffer()`                 |
|         `*.*`         |     `text`     |                    `response.text()`                     |

### `responseParserMap`

Another useful way to determine which response parser to use is with `responseParserMap`. It allows you to set up a mapping between content types and parser types.

Thwack uses the following map as the default, which allows `json` and `formdata` decoding. If there are no matches, the response parser defaults to `text`. You may specify a default by setting the special `.default` key.

```json
{
  "application/json": "json",
  "multipart/form-data": "formdata",
  ".default": "text"
};
```

Any value you specify in `responseParserMap` is merged into the default map. That is to say that you can override the defaults and/or add new values.

Let's say, for example, you would like to download an image into a blob. You could create an instance of Thwack (using `thwack.create()`) and share it throughout your entire application. Here we set the `baseURL` to our API endpoint and a `responseParserMap` that will download images of any type as blobs, but will still allow `json` downloads (as this is the default for a `content-type: application/json`).

```js
// api.js
import thwack from 'thwack';

export default thwack.create({
  responseParserMap: { 'image/*': 'blob' },
});
```

Then `import` the `api.js` file to use these options in other parts of your application. Any URL that you download with an `image/*` content type (e.g. `image/jpeg`, `image/png`, etc) will be parsed with the `blob` parser.

```js
import api from './api';

const getBlobUrl = async (url) => {
  const blob = (await api.get(url)).data;
  const objectURL = URL.createObjectURL(blob);
  return objectURL;
};
```

See this example running on [CodeSandbox]().

> Note that this works for other things besides images.

As you can see, using `responseParserMap` is a great way to eliminate the need to set `responseType` for different Thwack calls.

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
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

A `boolean` set to true is the `status` code in the 2xx range (i.e. a success). If the promise resolves successfully, this value will always be `true`. If the request has a status outside of the 2xx range Thwack will throw a `ThwackResponseError` and `ok` will be false.

### `statusText`

A `string` representing the text of the `status` code. You should use the `status` code (or `ok`) in any program logic.

### `headers`

A key/value object with the returned HTTP headers. Any duplicate headers will be concatenated into a single header separated by semicolons.

### `data`

This will hold the returned body of the HTTP response after it has been streamed and converted. The only exception is if you used the `responseType` of `stream`, in which case `data` is set directly to the `body` element.

If a `ThwackResponseError` was thrown, `data` will be the plain text representation of the response body.

### `options`

The complete `options` object that processed the request. This `options` will be fully merged with parent instances (if any) as well as with defaults.

### `response`

The complete HTTP `Response` object as returned by `fetch`.

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
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
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
Instances
</h2>

Instances created in Thwack are based on the parent instance. A parents's default options pass down through the instances. This can come in handy for setting up options in the parent that can affect the children, such as `baseURL`,

Inversely, parents can use `addEventListener` to monitor their children (see the [How to log every API call](#how-to-log-every-api-call) below for an example of this).

<img alt="flow char" src="https://user-images.githubusercontent.com/887639/79186980-06040480-7de9-11ea-8362-a5b187d231b8.png" width="476">

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
Thwack events
</h2>

Combined with instances, the Thwack event system is what makes Thwack extremely powerful. With it, you can listen for different events.

### The `request` event

Whenever any part of the application calls one of the data fetching methods, a `request` event is fired. Any listeners will get a `ThwackRequestEvent` object which has the `options` of the call in `event.options`. These event listeners can do something as simple as ([log the event](#log-every-request)) or as complicated as preventing the request and returning a response with ([mock data](#return-mock-data))

```js
// callback will be called for every request made in Thwack
thwack.addEventListener('request', callback);
```

### The `response` event

The event is fired _after_ the HTTP headers are received, but _before_ the body is streamed and parsed. Listeners will receive a `ThwackResponseEvent` object with a `thwackResponse` key set to the response.

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
How to
</h2>

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

```js
thwack.addEventListener('request', (event) => {
  const { options } = event;
  if (options.url === 'users' && options.params.id === 123) {

    // the caller's request will be resolved to this `ThwackResponse`
    event.promise = Promise.resolve({
      status: 200,
      ok: true
      headers: {
        'content-type': 'application/json',
      },
      data: {
        name: 'Fake Username',
        email: 'fakeuser@example.com',
      }
    });

    // tells Thwack to return `event.promise` instead of handling the event itself
    event.preventDefault();

    // stop other listeners (if any) from further processing
    event.stopPropagation();
  }
});
```

### Load an Image as a Blob

See this example on [CodeSandbox](https://codesandbox.io/s/thwack-demo-load-image-as-blob-x0rnl?file=/src/ImageBlob/useBlobUrl.js)

### Selective routing

Rght now you have a REST endpoint at `https://api.example.com`. Suppose you've published a new REST endpoint o a different URL and would like to start slowly routing 2% of network traffic to these new servers.

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
  consy newUrl = url.href; // Get the fully qualified URL
  event.options = { ...event.options, url: newUrl }; // replace `options`]
});
```

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
Credits
</h2>

Thwack is **heavily** inspired by the [Axios](https://github.com/Axios/Axios). Thanks [Matt](https://twitter.com/mzabriskie)!

<h2>
<img alt="Thwack logo" src="https://user-images.githubusercontent.com/887639/79184401-077dfe80-7de2-11ea-859e-ceaaf1364077.png" width="20">
License
</h2>

[MIT](LICENSE)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://donavon.com"><img src="https://avatars3.githubusercontent.com/u/887639?v=4" width="100px;" alt=""/><br /><sub><b>Donavon West</b></sub></a><br /><a href="#infra-donavon" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/donavon/thwack/commits?author=donavon" title="Tests">⚠️</a> <a href="#example-donavon" title="Examples">💡</a> <a href="#ideas-donavon" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-donavon" title="Maintenance">🚧</a> <a href="https://github.com/donavon/thwack/pulls?q=is%3Apr+reviewed-by%3Adonavon" title="Reviewed Pull Requests">👀</a> <a href="#tool-donavon" title="Tools">🔧</a> <a href="https://github.com/donavon/thwack/commits?author=donavon" title="Code">💻</a></td>
    <td align="center"><a href="http://jeremytice.com"><img src="https://avatars0.githubusercontent.com/u/1740479?v=4" width="100px;" alt=""/><br /><sub><b>Jeremy Tice</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=jetpacmonkey" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/yurm04"><img src="https://avatars0.githubusercontent.com/u/4642404?v=4" width="100px;" alt=""/><br /><sub><b>Yuraima Estevez</b></sub></a><br /><a href="https://github.com/donavon/thwack/commits?author=yurm04" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
