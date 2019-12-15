import { TweenMax } from "gsap";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import { ParticleTextureMap01 } from "./3D/ParticleTextureMap";
import DogStore from "./DogStore";

export default function() {
  // Helper Functions
  this.transformMouseCoordinate = ({ offsetX, offsetY }) => {
    const renderer = DogStore.stage3D.renderer;
    if (renderer) {
      const canvas = renderer.domElement;
      const x = (offsetX / canvas.offsetWidth) * 2 - 1;
      const y = -(offsetY / canvas.offsetHeight) * 2 + 1;
      return { x, y };
    }
    return { x: -999, y: -999 };
  };
  // Bind & Unbind
  this.bind = () => {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    const canvas = DogStore.stage3D.renderer.domElement;
    canvas.addEventListener("mousemove", this.onMouseMove);
    canvas.addEventListener("mousedown", this.onMouseDown);
    canvas.addEventListener("mouseup", this.onMouseUp);
    canvas.addEventListener("touchmove", this.onMouseMove);
    canvas.addEventListener("touchstart", this.onMouseDown);
    canvas.addEventListener("touchend", this.onMouseUp);
  };
  this.unbind = () => {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    const canvas = DogStore.stage3D.renderer.domElement;
    canvas.removeEventListener("mousemove", this.onMouseMove);
    canvas.removeEventListener("mousedown", this.onMouseDown);
    canvas.removeEventListener("mouseup", this.onMouseUp);
    canvas.removeEventListener("touchmove", this.onMouseMove);
    canvas.removeEventListener("touchstart", this.onMouseDown);
    canvas.removeEventListener("touchend", this.onMouseUp);
  };
  //
  this.onResize = debounce(evt => {
    DogStore.emit(DogStore.Event.resize, {
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, 1000 / 10);
  /**
   *
   * Key Events
   *
   */
  this.onKeyDown = evt => {
    DogStore.emit(DogStore.Event.key_down, evt);
  };
  this.onKeyUp = evt => {
    DogStore.emit(DogStore.Event.key_up, evt);
  };
  /**
   *
   * Mouse Events
   *
   */
  this.onMouseMove = throttle(evt => {
    DogStore.emit(DogStore.Event.pointer_move, evt);
  }, 1000 / 40);
  this.onMouseDown = evt => {
    DogStore.emit(DogStore.Event.pointer_down, evt);
  };
  this.onMouseUp = evt => {
    DogStore.emit(DogStore.Event.pointer_up, evt);
  };
  /**
   *
   * Drag Events
   *
   */
  this.onDragEnter = evt => {
    DogStore.emit("drag_enter", evt);
  };
  // like mousemove
  this.onDragOver = evt => {
    DogStore.emit("drag_over", evt);
  };
  this.onDrop = files => {
    DogStore.emit("drop", files);
  };
  this.onDragLeave = () => {
    DogStore.emit("drag_leave");
  };
}
