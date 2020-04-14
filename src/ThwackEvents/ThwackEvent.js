import ThwackStopPropagationError from '../ThwackErrors/ThwackStopPropagationError';

export default class ThwackEvent extends Event {
  constructor(type) {
    super(type);
    Object.defineProperty(this, 'defaultPrevented', {
      value: this.defaultPrevented,
      writable: true,
    });
  }

  preventDefault() {
    this.defaultPrevented = true;
  }

  // eslint-disable-next-line class-methods-use-this
  stopPropagation() {
    throw new ThwackStopPropagationError();
  }
}
