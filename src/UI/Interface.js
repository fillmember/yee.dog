import React, { Fragment } from "react";
import Loading from "./Loading";
import PoseEditor from "./PoseEditor";

export default class Interface extends React.Component {
  render() {
    return (
      <Fragment>
        <Loading />
        <PoseEditor />
      </Fragment>
    );
  }
}
