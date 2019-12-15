import React, { Component } from "react";
import DropZone from "react-dropzone";
import DogStore from "./DogStore";
import AppEventHandlers from "./AppEventHandlers";

class App extends Component {
  $canvasContainer = React.createRef();
  constructor(props) {
    super(props);
    AppEventHandlers.apply(this);
  }
  componentDidMount() {
    DogStore.load("/static/model/wt.glb").then(() => {
      this.$canvasContainer.current.appendChild(
        DogStore.stage3D.renderer.domElement
      );
      this.bind();
    });
  }
  componentWillUnmount() {
    this.unbind();
  }
  render() {
    return (
      <DropZone
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        onDragLeave={this.onDragLeave}
        disableClick
        disablePreview
        activeStyle={{}}
        acceptStyle={{}}
        disabledStyle={{}}
        multiple={false}
      >
        <main className="App">
          <section
            className="3d-container"
            ref={this.$canvasContainer}
            style={{ fontSize: 0, lineHeight: 0 }}
          />
          <section className="ui-container">{this.props.children}</section>
        </main>
      </DropZone>
    );
  }
}

export default App;
