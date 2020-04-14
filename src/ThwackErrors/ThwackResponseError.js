const thwackResponseError = 'ThwackResponseError';

class ThwackResponseError extends Error {
  constructor(thwackResponse) {
    super(thwackResponseError);
    this.message = `Status ${thwackResponse.status}`;
    this.name = thwackResponseError;
    this.thwackResponse = thwackResponse;
  }
}

export default ThwackResponseError;
