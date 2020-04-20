import ThwackResponseBaseEvent from './ThwackResponseBaseEvent';

export default class ThwackErrorEvent extends ThwackResponseBaseEvent {
  constructor(thwackResponse) {
    super('error', thwackResponse);
  }
}
