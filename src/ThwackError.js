export default class ThwackError extends Error {
  constructor(message, extras) {
    super(message);

    Object.entries(extras).forEach(([key, value]) => {
      this[key] = value;
    });
  }
}
