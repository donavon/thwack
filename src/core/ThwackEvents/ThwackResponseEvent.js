import ThwackResponseBaseEvent from './ThwackResponseBaseEvent';

export default class ThwackResponseEvent extends ThwackResponseBaseEvent {
  constructor(thwackResponse) {
    super('response', thwackResponse);
  }
}
