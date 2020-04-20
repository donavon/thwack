import ThwackEvent from './ThwackEvent';

export default class ThwackResponseBaseEvent extends ThwackEvent {
  constructor(type, thwackResponse) {
    super(type, thwackResponse);

    Object.defineProperty(this, 'thwackResponse', {
      get() {
        return this._payload;
      },
    });
  }
}
