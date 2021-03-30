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
  | 'PATCH';

export interface ThwackOptions extends RequestInit {
  method?: Method; // One of the supported HTTP request methods.
  url?: string; // A string containing a URL with optional `:name` params.
  baseURL?: string; // A string containing a base URL to build a FQ URL
  fetch?: (url: string, options?: RequestInit) => Promise<Response>; // A function that implements `window.fetch`. Default = `window.fetch`.
  params?: KeyValue; // A key/value object used for search parameters.
  data?: any; // The data that you would like to send. Not valid for GET and HEAD methods.
  responseParserMap?: KeyValue;
  responseType?: ResponseType;
  headers?: KeyValue | Headers;
}

interface ThwackSyntheticResponse<T = any> {
  status: number;
  statusText?: string;
  data?: T;
  headers?: KeyValue | Headers;
}

export interface ThwackResponse<T = any> {
  status: number;
  statusText: string;
  headers: KeyValue;
  data: T;
  response: Response | ThwackSyntheticResponse;
  options: ThwackOptions;
}

interface ThwackResponseConstructor {
  new (
    response: Response | ThwackSyntheticResponse,
    options: ThwackOptions
  ): ThwackResponse;
}

export interface ThwackResponseError extends Error {
  thwackResponse: ThwackResponse;
}

export interface ThwackEvent extends Event {}
export interface ThwackResponseBaseEvent extends ThwackEvent {
  thwackResponse: ThwackResponse;
}
export interface ThwackRequestEvent extends ThwackEvent {
  type: 'request';
  options: ThwackOptions;
}
export interface ThwackResponseEvent extends ThwackResponseBaseEvent {
  type: 'response';
}
export interface ThwackDataEvent extends ThwackResponseBaseEvent {
  type: 'data';
}
export interface ThwackErrorEvent extends ThwackResponseBaseEvent {
  type: 'error';
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

  request<T = any, R = ThwackResponse<T>>(config: ThwackOptions): Promise<R>;
  get<T = any, R = ThwackResponse<T>>(
    url: string,
    config?: ThwackOptions
  ): Promise<R>;
  delete<T = any, R = ThwackResponse<T>>(
    url: string,
    config?: ThwackOptions
  ): Promise<R>;
  head<T = any, R = ThwackResponse<T>>(
    url: string,
    config?: ThwackOptions
  ): Promise<R>;
  post<T = any, R = ThwackResponse<T>>(
    url: string,
    data?: any,
    config?: ThwackOptions
  ): Promise<R>;
  put<T = any, R = ThwackResponse<T>>(
    url: string,
    data?: any,
    config?: ThwackOptions
  ): Promise<R>;
  patch<T = any, R = ThwackResponse<T>>(
    url: string,
    data?: any,
    config?: ThwackOptions
  ): Promise<R>;

  create(config?: ThwackOptions): ThwackInstance;
  getUri(config?: ThwackOptions): string;

  defaults: ThwackOptions;

  addEventListener(
    type: 'request',
    callback: (event: ThwackRequestEvent) => ThwackRequestCallbackType
  ): void;
  removeEventListener(
    type: 'request',
    callback: (event: ThwackRequestEvent) => ThwackRequestCallbackType
  ): void;

  addEventListener(
    type: 'response',
    callback: (event: ThwackResponseEvent) => ThwackCallbackType
  ): void;
  removeEventListener(
    type: 'response',
    callback: (event: ThwackResponseEvent) => ThwackCallbackType
  ): void;

  addEventListener(
    type: 'data',
    callback: (event: ThwackDataEvent) => ThwackCallbackType
  ): void;
  removeEventListener(
    type: 'data',
    callback: (event: ThwackDataEvent) => ThwackCallbackType
  ): void;

  addEventListener(
    type: 'error',
    callback: (event: ThwackErrorEvent) => ThwackCallbackType
  ): void;
  removeEventListener(
    type: 'error',
    callback: (event: ThwackErrorEvent) => ThwackCallbackType
  ): void;
}

export interface ThwackMainInstance extends ThwackInstance {
  ThwackResponse: ThwackResponseConstructor;
  ThwackResponseError: ThwackResponseError;
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;
}

declare const thwack: ThwackMainInstance;

export default thwack;
