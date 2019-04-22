import React from "react";
import isEqual from "lodash/isEqual";
import DogStore from "../DogStore";

export default class DoggoBehaviourReact extends React.PureComponent {
  behaviour = null;
  state = {
    error: null
  };
  getArguments(obj = this.props) {
    const { value, ...others } = obj;
    return others;
  }
  createDoggoBehaviour() {
    const Behaviour = this.props.value;
    this.behaviour = new Behaviour();
    DogStore.addBehaviour(this.behaviour);
  }
  updateDoggoBehaviour() {
    const others = this.getArguments();
    const args = Object.keys(others);
    args.forEach(key => {
      this.behaviour.set(key, others[key]);
    });
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      console.warn("don't change behaviour on the fly!");
    }
    if (!isEqual(this.getArguments(prevProps), this.getArguments())) {
      this.updateDoggoBehaviour();
    }
  }
  render() {
    if (this.state.error) {
      return <pre>DoggoBehaviour Error</pre>;
    }
    if (!this.behaviour) {
      this.createDoggoBehaviour();
      this.updateDoggoBehaviour();
    }
    return this.behaviour.renderUI();
  }
}

export const InReact = function(behaviour, props = {}) {
  return moreProps => (
    <DoggoBehaviourReact value={behaviour} {...props} {...moreProps} />
  );
};
