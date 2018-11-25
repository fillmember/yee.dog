import React, { Fragment } from "react";
import { WebGLRenderer, Scene } from "three";

export const Stage3DContext = React.createContext(null);

export default class Stage3D extends React.Component {
  $container = React.createRef();
  renderer = new WebGLRenderer();
  scene = new Scene();
  updateWebGLRenderer(prevProps) {
    const updateAll = !prevProps;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    if (updateAll || prevProps.clearColor !== this.props.clearColor) {
      this.renderer.setClearColor(this.props.clearColor);
    }
    if (
      updateAll ||
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height
    ) {
      this.renderer.setSize(this.props.width, this.props.height);
    }
  }
  componentDidMount() {
    this.updateWebGLRenderer();
    this.$container.current.appendChild(this.renderer.domElement);
  }
  componentDidUpdate(prevProps) {
    this.updateWebGLRenderer(prevProps);
  }
  render() {
    return (
      <Stage3DContext.Provider value={this}>
        <Fragment>
          <div
            className="3d-container"
            ref={this.$container}
            style={{ fontSize: 0, lineHeight: 0 }}
          />
          {this.props.children}
        </Fragment>
      </Stage3DContext.Provider>
    );
  }
}
