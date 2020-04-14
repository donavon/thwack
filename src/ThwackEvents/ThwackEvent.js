import ThwackStopPropagationError from '../ThwackErrors/ThwackStopPropagationError';
// https://medium.com/@zandaqo/eventtarget-the-future-of-javascript-event-systems-205ae32f5e6b

export default class ThwackEvent /* extends EventTarget */ {
  constructor(type) {
    // super(type);
    this.type = type;
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
