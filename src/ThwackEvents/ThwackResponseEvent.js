import ThwackEvent from './ThwackEvent';

export default class ThwackResponseEvent extends ThwackEvent {
  constructor(thwackResponse) {
    super('response');
    this.thwackResponse = thwackResponse;

    // if a listener calls `preventDefault` it MUST set to `Promise<ThwackResponse>`
    this.promise = undefined;
  }
}
