export interface KeyValue {
  [key: string]: string;
}

export type ThwackEventType = 'request' | 'response' | 'data' | 'error';

export type ResponseType =
  | 'arraybuffer'
  | 'arrayBuffer'
  | 'formdata'
  | 'formData'
  | 'json'
  | 'text'
  | 'stream'
  | 'blob';

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH';

export interface ThwackOptions {
  method?: Method; // One of the supported HTTP request methods.
  url?: string; // A string containing a URL with optional `:name` params.
  fetch?: (url: string, options?: any) => Promise<Response>; // A function that implements `window.fetch`. Default = `window.fetch`.
  params?: KeyValue; // A key/value object used for search parameters.
  data?: any; // The data that you would like to send. Not valid for GET and HEAD methods.
  headers?: KeyValue; // A key/value object used for HTTP headers.
  responseParserMap?: KeyValue;
  responseType?: ResponseType;
}

export interface ThwackResponse {
  status: number;
  statusText: string;
  headers: KeyValue;
  data: any;
  response: Response;
  options: ThwackOptions;
}

export interface ThwackError extends Error {
  status: number;
  statusText: string;
  headers: KeyValue;
  data: any;
  response: Response;
}

export interface ThwackRequestEvent extends Event {
  options: ThwackOptions;
}
export interface ThwackResponseEvent extends Event {
  thwackResponse: ThwackResponse;
}
export interface ThwackDataEvent extends Event {
  thwackResponse: ThwackResponse;
}
export interface ThwackErrorEvent extends Event {
  thwackResponse: ThwackResponse;
}

export type ThwackCallbackType =
  | void
  | ThwackResponse
  | Promise<ThwackResponse>;

export type ThwackRequestCallbackType =
  | void
  | ThwackResponse
  | Promise<ThwackResponse>
  | ThwackOptions
  | Promise<ThwackOptions>;

export interface ThwackInstance {
  (url: string, options?: ThwackOptions): Promise<ThwackResponse>;

  request(config: ThwackOptions): Promise<ThwackResponse>;
  get(url: string, config?: ThwackOptions): Promise<any>;
  delete(url: string, config?: ThwackOptions): Promise<any>;
  head(url: string, config?: ThwackOptions): Promise<any>;
  post(url: string, data?: any, config?: ThwackOptions): Promise<any>;
  put(url: string, data?: any, config?: ThwackOptions): Promise<any>;
  patch(url: string, data?: any, config?: ThwackOptions): Promise<any>;

  create(config?: ThwackOptions): ThwackInstance;
  getUri(config?: ThwackOptions): string;

  addEventListener(
    type: 'request',
    callback: (event: ThwackRequestEvent) => ThwackRequestCallbackType
  ): void;
  addEventListener(
    type: 'response',
    callback: (event: ThwackResonseEvent) => ThwackCallbackType
  ): void;
  addEventListener(
    type: 'data',
    callback: (event: ThwackDataEvent) => ThwackCallbackType
  ): void;
  addEventListener(
    type: 'error',
    callback: (event: ThwackErrorEvent) => ThwackCallbackType
  ): void;

  removeEventListener(
    type: 'request',
    callback: (event: ThwackRequestEvent) => ThwackRequestCallbackType
  ): void;
  removeEventListener(
    type: 'response',
    callback: (event: ThwackResonseEvent) => ThwackCallbackType
  ): void;
  removeEventListener(
    type: 'data',
    callback: (event: ThwackDataEvent) => ThwackCallbackType
  ): void;
  removeEventListener(
    type: 'error',
    callback: (event: ThwackErrorEvent) => ThwackCallbackType
  ): void;
}

declare const thwack: ThwackInstance;

export default thwack;
