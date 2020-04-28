// TODO make this extend CustomEvent and use EventTarget some day? Maybe?
export default class ThwackEvent {
  constructor(type, payload) {
    this.type = type;
    this.defaultPrevented = false;
    this.propagationStopped = false;
    this._payload = payload;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }

  stopPropagation() {
    this.propagationStopped = true;
  }
}
