import React from "react";

import App from "./../src/App";
import "./../src/css/reset.css";
import "./../src/css/basic.css";

export default class Index extends React.Component {
  state = {
    ready: false
  };
  componentDidMount() {
    this.setState({
      ready: true
    });
  }
  render() {
    return this.state.ready ? <App /> : false;
  }
}
