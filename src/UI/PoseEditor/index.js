import React from "react";
import { Absolute, Flex, Box, Heading, Button, Text } from "rebass";
import { AnimationClip, NumberKeyframeTrack, Math as Math3 } from "three";
import { DogPetter } from "../../DogContext";
import BoneID from "../../3D/BoneID.js";
import BoneEdit from "./BoneEdit.js";

class FloatInput extends React.Component {
  static noop = n => n;
  static pf = (n, p = 10) => Math.round(n * p) / p;
  static radToDeg = n => FloatInput.pf(Math3.radToDeg(n), 100);
  static degToRad = n => FloatInput.pf(Math3.degToRad(n), 100);
  static defaultProps = {
    getter: FloatInput.pf,
    setter: FloatInput.noop,
    update: FloatInput.noop
  };
  static _target = null;
  static globalMouseMove = evt => {
    if (FloatInput._isMouseDown) {
      FloatInput._target.update(evt.movementY * -1 + evt.movementX * 0.1);
    }
  };
  static globalMouseUp = evt => {
    FloatInput._isMouseDown = false;
    const target = FloatInput._target;
    FloatInput._target = null;
    if (target !== null) {
      target.forceUpdate();
    }
  };
  onMouseDown = () => {
    FloatInput._isMouseDown = true;
    FloatInput._target = this;
  };
  onMouseUp = () => {
    FloatInput._isMouseDown = false;
    if (FloatInput._target !== null) {
      FloatInput._target.forceUpdate();
    }
    FloatInput._target = null;
  };
  update(delta) {
    const { object, property, update, getter, setter } = this.props;
    const value = getter(object[property]);
    object[property] = setter(value + delta);
    update();
  }
  onInputChange = e => {
    const { object, property, update, setter } = this.props;
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      object[property] = setter(value);
      update();
    }
  };
  componentDidMount() {
    if (!FloatInput.windowMouseEventAttached) {
      window.addEventListener("mousemove", FloatInput.globalMouseMove, {
        passive: true
      });
      window.addEventListener("mouseup", FloatInput.globalMouseUp, {
        passive: true
      });
      FloatInput.windowMouseEventAttached = true;
    }
  }
  static Input = ({ value, onChange }) => (
    <Text
      is="input"
      type="number"
      value={value}
      onChange={onChange}
      fontSize={2}
      style={{
        userSelect: `none`,
        width: `100%`
      }}
    />
  );
  render() {
    const { object, property, getter } = this.props;
    const value = getter(object[property]);
    return (
      <Box onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} pr={1}>
        <FloatInput.Input value={value} onChange={this.onInputChange} />
      </Box>
    );
  }
}

class ClipEditor extends React.Component {
  state = {
    selectedBoneIndex: 0
  };
  render() {
    const { clip, dog, update } = this.props;
    const { selectedBoneIndex } = this.state;
    const selectedBone = dog.dog.skeleton.bones[selectedBoneIndex];
    return (
      <Box>
        <Flex>
          <Box width={1 / 5}>
            <select
              value={this.state.selectedBoneIndex}
              onChange={evt => {
                this.setState({
                  selectedBoneIndex: parseInt(evt.target.value)
                });
              }}
            >
              {dog.dog.skeleton.bones.map((b, index) => (
                <option key={b.name} value={index}>
                  {b.name}
                </option>
              ))}
            </select>
          </Box>
          <Box width={2 / 5}>position</Box>
          <Box width={2 / 5}>rotation</Box>
        </Flex>
        <Flex>
          <Box width={1 / 5}>x</Box>
          <Box width={2 / 5}>
            <FloatInput
              update={update}
              object={selectedBone.position}
              property={"x"}
            />
          </Box>
          <Box width={2 / 5}>
            <FloatInput
              update={update}
              object={selectedBone.rotation}
              getter={FloatInput.radToDeg}
              setter={FloatInput.degToRad}
              property={"x"}
            />
          </Box>
        </Flex>
        <Flex>
          <Box width={1 / 5}>y</Box>
          <Box width={2 / 5}>
            <FloatInput
              update={update}
              object={selectedBone.position}
              property={"y"}
            />
          </Box>
          <Box width={2 / 5}>
            <FloatInput
              update={update}
              object={selectedBone.rotation}
              getter={FloatInput.radToDeg}
              setter={FloatInput.degToRad}
              property={"y"}
            />
          </Box>
        </Flex>
        <Flex>
          <Box width={1 / 5}>z</Box>
          <Box width={2 / 5}>
            <FloatInput
              update={update}
              object={selectedBone.position}
              property={"z"}
            />
          </Box>
          <Box width={2 / 5}>
            <FloatInput
              update={update}
              object={selectedBone.rotation}
              getter={FloatInput.radToDeg}
              setter={FloatInput.degToRad}
              property={"z"}
            />
          </Box>
        </Flex>
      </Box>
    );
  }
}

export default class PoseEditor extends React.Component {
  state = {
    clip: null,
    action: null
  };
  resetDogPose({ stage, dog, update }) {
    const keys = Object.keys(dog.animation.actions);
    keys.forEach(key => {
      dog.animation.actions[key].weight = 0;
    });
    dog.animation.actions.reset.weight = 1;
    dog.animation.actions.reset.weight = 0;
    stage.orbitcontrols.autoRotate = false;
    stage.orbitcontrols.enablePan = true;
    stage.orbitcontrols.enableZoom = true;
    update();
  }
  createNewClip({ stage, dog, update }) {
    const clipName = prompt("new clip name", "untitled_clip");
    this.resetDogPose({ stage, dog, update });
    dog.animation.update();
    const { clip, action } = dog.animation.createResetClip({
      clipName,
      initialWeight: 1,
      paused: false
    });
    this.setState({
      clip,
      action
    });
  }
  renderDogBones({ dog, update }) {
    let boneNames = Object.keys(BoneID);
    const exclude = [
      "Tail_3",
      "JawU_1",
      "JawL_1",
      "EarL_1",
      "EarR_1",
      "ArmL_3",
      "ArmR_3",
      "LegL_4",
      "LegR_4"
    ];
    boneNames = boneNames.filter(name => exclude.indexOf(name) === -1);
    return (
      <Flex flexWrap="wrap" fontSize={0}>
        {boneNames.map(boneName => (
          <BoneEdit
            key={boneName}
            dog={dog}
            update={update}
            title={boneName}
            bone={dog.dog.skeleton.bones[BoneID[boneName]]}
          />
        ))}
      </Flex>
    );
  }
  render() {
    return (
      <DogPetter>
        {props => {
          if (!props.dog) {
            return false;
          }
          const { dog, update } = props;
          //
          return (
            <Absolute bottom="0" left="0" right="0" p={1}>
              <Flex mb={2}>
                <Box width={1 / 5}>
                  <Heading fontSize={3} mb={2}>
                    Dog Pose Editor
                  </Heading>
                  {/*<Button
                    fontSize={0}
                    onClick={() => {
                      this.resetDogPose(props);
                    }}
                  >
                    Reset Dog Pose
                  </Button>*/}
                  <Button
                    fontSize={0}
                    onClick={() => {
                      this.createNewClip(props);
                    }}
                  >
                    Create New Clip
                  </Button>
                </Box>
                <Box width={4 / 5}>
                  {this.state.clip && (
                    <Box>
                      <Heading fontSize={2} mt={1} mb={2}>
                        current clip: {this.state.clip.name}
                      </Heading>
                      <ClipEditor
                        dog={dog}
                        clip={this.state.clip}
                        update={update}
                      />
                      {/*<textarea
                        defaultValue={JSON.stringify(
                          AnimationClip.toJSON(this.state.clip),
                          null,
                          2
                        )}
                      />*/}
                    </Box>
                  )}
                  {/*
                  {this.renderDogBones(props)}
                  */}
                </Box>
              </Flex>
            </Absolute>
          );
        }}
      </DogPetter>
    );
  }
}
