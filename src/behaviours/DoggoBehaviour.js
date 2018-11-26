import DogStore from "./../DogStore.js";

export default class DoggoBehaviour {
  constructor() {
    this.DogStore = DogStore;
    this.on("dog_ready", dog => this.onDogReady(dog));
  }
  on(event, func) {
    this.DogStore.events.on(event, func);
  }
  off(event, func) {
    this.DogStore.events.off(event, func);
  }
  set(key, value) {
    this[key] = value;
  }
  _enabled = true;
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    if (this._enabled) {
      this.onEnabled();
    } else {
      this.onDisabled();
    }
  }
  onAdd() {}
  onEnabled() {}
  onDisabled() {}
  onDogReady() {}
  onRemove() {}
  renderUI() {
    return false;
  }
}
