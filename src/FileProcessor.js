export default class FileProcessor {
  static TYPE_AUDIO = "TYPE_AUDIO";
  static TYPE_IMAGE = "TYPE_IMAGE";
  static TYPE_UNKNOWN = "TYPE_UNKNOWN";
  constructor() {
    this.eventListeners = {
      process: [],
      start: []
    };
    // this.onProcessListeners = [];
    // this.onStartListeners = [];
  }
  addEventListener(event, listener) {
    const arr = this.eventListeners[event];
    if (arr) {
      arr.push(listener);
      return this.removeEventListener.bind(this, event, listener);
    } else {
      console.log(`Event ${event} not found. `);
    }
  }
  removeEventListener(event, listener) {
    const arr = this.eventListeners[event];
    if (arr) {
      this.eventListeners[event] = arr.filter(f => f !== listener);
    } else {
      console.warn(`Event ${event} not found. `);
    }
  }
  process(file) {
    if (!file) {
      return;
    }
    this.currentFile = file;
    this.currentType = this.identifyType(file);
    //
    this.eventListeners.process.forEach(listener => {
      listener(this.currentFile, this.currentType, this);
    });
  }
  identifyType(file) {
    const type = file.type.split("/");
    switch (type[0]) {
      case "audio":
        return FileProcessor.TYPE_AUDIO;
      case "image":
        return FileProcessor.TYPE_IMAGE;
      default:
        return FileProcessor.TYPE_UNKNOWN;
    }
  }
  start() {
    this.eventListeners.start.forEach(listener => {
      listener(this.currentFile, this.currentType, this);
    });
  }
}
