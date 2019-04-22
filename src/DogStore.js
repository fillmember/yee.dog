import Stage3D from "./3D/Stage3D.js";
import EventEmitter from "events";

const storeEmitter = new EventEmitter();
storeEmitter.setMaxListeners(100);

class DogStore {
  Event = {
    resize: "resize",
    key_down: "key_down",
    key_up: "key_up",
    pointer_move: "pointer_move",
    pointer_down: "pointer_down",
    pointer_up: "pointer_up",
    drag: "drag",
    drop: "drop",
    //
    dog_ready: "dog_ready",
    update: "update",
    render: "render"
  };
  events = storeEmitter;
  emit(evt, payload) {
    this.events.emit(evt, payload);
  }
  stage3D = new Stage3D({
    width: window.innerWidth,
    height: window.innerHeight,
    onUpdate: dt => {
      this.events.emit(this.Event.update, dt);
    },
    onRender: dt => {
      this.events.emit(this.Event.render, dt);
    }
  });
  load(url) {
    return this.stage3D.load(url).then(() => {
      this.stage3D.start();
      this.dog = this.stage3D.dog;
      this.events.emit(this.Event.dog_ready, this.dog);
    });
  }
  dog = null;
  //
  behaviours = [];
  addBehaviour(b) {
    this.behaviours.push(b);
    b.onAdd();
  }
  removeBehaviour(b) {
    const index = this.behaviours.indexOf(b);
    if (index > -1) {
      this.behaviours.splice(index, 1);
      b.onRemove();
    }
  }
  //
}

export default new DogStore();
