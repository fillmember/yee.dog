import DoggoBehaviour from "./DoggoBehaviour";

export default class EatYourFiles extends DoggoBehaviour {
  onDogReady() {
    this.on("drag_enter", this.onDragEnter);
    this.on("drag_over", this.onDragOver);
    this.on("drag_start", this.onDragStart);
    this.on("drop", this.onDrop);
    this.on("drag_leave", this.onDragLeave);
  }
  onDragEnter = () => {};
  onDragOver = () => {};
  onDragStart = () => {};
  onDrop = () => {};
  onDragLeave = () => {};
}
