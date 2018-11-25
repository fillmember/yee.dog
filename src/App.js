import React, { Component } from "react";
import { Provider as ThemeProvider } from "rebass";
import DropZone from "react-dropzone";
import DogStore from "./DogStore.js";
import AppEventHandlers from "./AppEventHandlers.js";
import theme from "./theme.js";

class App extends Component {
  $canvasContainer = React.createRef();
  componentDidMount() {
    AppEventHandlers.apply(this);
    DogStore.load("/static/model/wt").then(() => {
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
      <ThemeProvider theme={theme}>
        <DropZone
          onDragEnter={this.onDragEnter}
          onDragOver={this.onDragOver}
          onDragStart={this.onDragStart}
          onDrop={this.onDrop}
          onDragLeave={this.onDragLeave}
          getDataTransferItems={this.getDataTransferItems}
          disableClick
          disablePreview
          activeStyle={{}}
          acceptStyle={{}}
          disabledStyle={{}}
          multiple={false}
        >
          <div className="App">
            <div
              className="3d-container"
              ref={this.$canvasContainer}
              style={{ fontSize: 0, lineHeight: 0 }}
            />
            {this.props.children}
          </div>
        </DropZone>
      </ThemeProvider>
    );
  }
}

export default App;
