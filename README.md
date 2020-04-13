# 💥 What the heck is Twack!? 💥

## TL;DR:

- It's a modern HTTP data fetching
- Small — ~1k gzipped
- Smarter — (say something here)
- Familiar — Uses an Axios-like interface

This README is a work in progress. More later...

> It's in alpha, so read the source to get started or see the tests! You can also ask me a question [on Twitter](https://twitter.com/donavon).

## Methods

- `thwack(url: string [,options: ThwackOptions]): Promise<ThwackResponse>`
- `thwack.request(options: ThwackOptions): Promise<ThwackResponse>`
- `thwack.get(url: string [,options: ThwackOptions]): Promise<ThwackResponse>`
- `thwack.delete(url: string [,options: ThwackOptions]): Promise<ThwackResponse>`
- `thwack.head(url: string [,options: ThwackOptions]): Promise<ThwackResponse>`
- `thwack.post(url: string, data:any [,options: ThwackOptions]): Promise<ThwackResponse>`
- `thwack.put(url: string, data:any [,options: ThwackOptions]): Promise<ThwackResponse>`
- `thwack.patch(url: string, data:any [,options: ThwackOptions]): Promise<ThwackResponse>`

## Options

The `options` argument has the following properties.

### `url`

This is either a fully qualified or a relative URL.

### `baseUrl`

Defines a base URL that will be used to build a fully qualified url from `url` above. Defaults to the `origin` + `pathname` of the current web page.

For example, if you did this:

```js
thwack('foo', {
  baseUrl: 'http://example.com',
});
```

the fetched URL will be:

```
http://example.com/foo
```

### `method`

### `data`

If the `method` is `post`, `put`, or `patch`, this is the data that will be used to build the request body.

### `headers`

This is where you can place any optional HTTP request headers. Any header you spwecify here are merged in with any instance header values.

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
const { data } = await thwack.get('foo', {
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

This is an optional object that contains the key/value pairs that will be used to build the fetch URL. Is there are any `:key` segments of the `baseUrl` or the `url`, they will be replaced with the value of the maything key. For example, if you did this:

```js
thwack('orders/:id', {
  params: { id: 123 },
  baseUrl: 'http://example.com',
});
```

the fetched URL will be:

```
http://example.com/orders/123
```

If you don't specify a `:name`, or there are more `param`s than there are `:name`s, then the remaining key/values will be set as search parmameters (i.e. `?key=value`).

### `responseType`

By default, Thwack will automatically determine how to decode the response data based on the value of the response header `content-type`. However, if the server responds with an incorect value, you can override the parser by setting `responseType`. Valid values are `arraybuffer`, `document` (i.e. `formdata`), `json`, `text`, `stream`, and `blob`. Defaults to automatic.

What is returned by Thwack is determined by the following table. The "fetch method" column is what is resolved in `data`. If you do not specify a `responseType`, Thwack with automatically determine the fetch method based on `content-type` and the `responseParserMap` table (se below).

|     Content-Type      | `responseType` |                 `fetch` method                 |
| :-------------------: | :------------: | :--------------------------------------------: |
|  `application/json`   |     `json`     |               `response.json()`                |
| `multipart/form-data` |   `formdata`   |             `response.formData()`              |
|                       |    `stream`    | passes back `response.body` without processing |
|                       |     `blob`     |               `response.blob()`                |
|                       | `arraybuffer`  |            `response.arrayBuffer()`            |
|         `*.*`         |     `text`     |               `response.text()`                |

### `responseParserMap`

Another useful way to determine which response parser to use is with `responseParserMap`. It allows you to setup a mapping between content types and parser types.

Thwack uses the following map as the default, which allows `json` and `formdata` decoding. If there are no matches, the response parser defaults to `text`. You may specify a default by setting the special `.default` key.

```json
{
  "application/json": "json",         // ex: { "foo": 123, "bar": 456 }
  "multipart/form-data": "formdata",  // ex: foo=123&bar=456
  ".default": "text"
};
```

Any value you specify in `responseParserMap` is merged into the default map. That is to say that you can ovwerride the defaults and/or add new values.

Let's say, for example, you would like to download an image into a blob. You could create an instance of Thwack (using `thwack.create()`) and share it throughout your entire application. Here we set the `baseUrl` to our API endpoint and a `responseParserMap` that will download images of any type as blobs, but will still allow `json` downloads (as this is the default for a `content-type: application/json`).

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

## How to

### How to log every API call

Make a file module (here called `api.js`). IN the file create a Thwack instance, setting any `options` that you need throughout your app.

Then, add an `addEventListener('request', callback)` and export the instance.

```js
import thwack from 'thwack';

const api = thwack.create({
  baseURL: 'https://example.com/api/',
});

api.addEventListener('request', (options) => {
  console.log('hitting URL', api.getUri(options));
});

export default api;
```

Then, whenever you want to fetch in your app, import the Thwack instance from `api.js`.

```js
```

Because you setup an `eventListener` in `api.js`, your `callback` function every time that any place in the app
