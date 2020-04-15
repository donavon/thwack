export default class ThwackResponse {
  constructor(response, options) {
    const { status, ok, statusText, headers } = response;
    this.status = status;
    this.statusText = statusText;
    this.ok = ok;
    this.headers = Object.fromEntries(headers.entries());
    this.options = options;
    this.response = response;
  }
}
