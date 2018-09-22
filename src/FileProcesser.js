const TYPE_AUDIO = "TYPE_AUDIO";
const TYPE_IMAGE = "TYPE_IMAGE";
const TYPE_UNKNOWN = "TYPE_UNKNOWN";

export default class FileProcessor {
  process(file) {
    if (!file) {
      return;
    }
    this.currentFile = file;
    const type = file.type.split("/");
    switch (type[0]) {
      case "audio":
        console.log("this file is a audio");
        this.currentType = TYPE_AUDIO;
        break;
      case "image":
        console.log("this file is a image");
        this.currentType = TYPE_IMAGE;
        break;
      default:
        console.log("this file is something else");
        this.currentType = TYPE_UNKNOWN;
        break;
    }
  }
  start() {
    console.log("start", this.currentFile, this.currentType);
  }
}
