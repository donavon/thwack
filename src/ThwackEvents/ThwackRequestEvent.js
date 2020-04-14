import ThwackEvent from './ThwackEvent';

export default class ThwackRequestEvent extends ThwackEvent {
  constructor(options) {
    super('request');
    this.options = options;

    // if a listener calls `preventDefault` it MUST set to `Promise<ThwackResponse>`
    this.promise = undefined;
  }
}
