import { defaultValidateStatus } from './utils/defaultValidateStatus';

export default class ThwackResponse {
  constructor(response, options) {
    const {
      status = 200,
      statusText = `Status ${status}`,
      data,
      headers = {},
    } = response;
    this.status = status;
    this.statusText = statusText;
    this.ok = defaultValidateStatus(status);
    this.data = data;
    this.headers =
      typeof headers.entries === 'function' // TODO why can't I do `headers instanceof Headers`?
        ? Object.fromEntries(headers.entries())
        : headers;
    this.options = options;
    this.response = response;
  }
}
