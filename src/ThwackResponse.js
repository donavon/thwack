export default class ThwackResponse {
  constructor(response, options) {
    const {
      status = 200,
      statusText = `Status ${status}`,
      data,
      headers = [],
    } = response;
    this.status = status;
    this.statusText = statusText;
    this.ok = status >= 200 && status < 300;
    this.data = data;
    this.headers = Array.isArray(headers)
      ? headers
      : Object.fromEntries(headers.entries());
    this.options = options;
    this.response = response;
  }
}
