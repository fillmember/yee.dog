import React from "react";
import isEqual from "lodash/isEqual";
import DogStore from "../DogStore";

export default class DoggoBehaviourReact extends React.Component {
  behaviour = null;
  getArguments(obj = this.props) {
    const { value, ...others } = obj;
    return others;
  }
  updateBehaviour() {
    const others = this.getArguments();
    const args = Object.keys(others);
    args.forEach(key => {
      this.behaviour.set(key, others[key]);
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      console.warn("don't change behaviour on the fly!");
    }
    if (!isEqual(this.getArguments(prevProps), this.getArguments())) {
      this.updateBehaviour();
    }
  }
  componentDidMount() {
    const Behaviour = this.props.value;
    this.behaviour = new Behaviour();
    this.updateBehaviour();
    DogStore.addBehaviour(this.behaviour);
  }
  render() {
    if (this.behaviour) {
      return this.behaviour.renderUI();
    }
    return false;
  }
}

export const InReact = function(behaviour, props = {}) {
  return moreProps => (
    <DoggoBehaviourReact value={behaviour} {...props} {...moreProps} />
  );
};
