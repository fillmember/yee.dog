import DogStore from "../DogStore";

export default class DoggoBehaviour {
  DogStore;
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
  onDogReady(dog: unknown) {}
  onRemove() {}
  renderUI() {
    return false;
  }
  //
  getBehavioursByType(type) {
    const resultArray = this.DogStore.behaviours.filter(
      b => b.constructor === type
    );
    return resultArray;
  }
  getFirstBehaviourByType(type) {
    const resultArray = this.getBehavioursByType(type);
    return resultArray.length > 0 ? resultArray[0] : null;
  }
  require(type) {
    const result = this.getFirstBehaviourByType(type);
    if (!result) {
      throw new Error(
        `DoggoBehaviour ${this.constructor.name} requires ${type}. `
      );
    }
    return result;
  }
}
