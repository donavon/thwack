import ThwackStopPropagationError from '../ThwackErrors/ThwackStopPropagationError';
// https://medium.com/@zandaqo/eventtarget-the-future-of-javascript-event-systems-205ae32f5e6b

// TODO make this extend CustomEvent and use EventTarget some day.
export default class ThwackEvent {
  constructor(type) {
    this.type = type;
    this.defaultPrevented = false;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }

  // eslint-disable-next-line class-methods-use-this
  stopPropagation() {
    throw new ThwackStopPropagationError();
  }
}
