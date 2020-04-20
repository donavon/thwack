import ThwackEvent from './ThwackEvent';

export default class ThwackRequestEvent extends ThwackEvent {
  constructor(options) {
    super('request', options);

    Object.defineProperty(this, 'options', {
      get() {
        return this._payload;
      },
    });
  }
}
