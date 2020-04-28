import ThwackResponseBaseEvent from './ThwackResponseBaseEvent';

export default class ThwackDataEvent extends ThwackResponseBaseEvent {
  constructor(thwackResponse) {
    super('data', thwackResponse);
  }
}
