import React from "react";
import { Absolute, Flex, Box, Heading, Text, Button, Card } from "rebass";

import { DogPetter } from "../../DogContext";
import BoneID from "../../3D/BoneID.js";

import BoneEdit from "./BoneEdit.js";

export default class PoseEditor extends React.Component {
  resetDogPose({ stage, dog, update }) {
    const keys = Object.keys(dog.animation.actions);
    keys.forEach(key => {
      dog.animation.actions[key].weight = 0;
    });
    dog.animation.actions.reset.weight = 1;
    dog.animation.actions.reset.weight = 0;
    stage.orbitcontrols.autoRotate = false;
    update();
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
          //
          return (
            <Absolute bottom="0" left="0" right="0" p={1}>
              <Flex>
                <Box width={1 / 5}>
                  <Heading fontSize={3} mb={2}>
                    Dog Pose Editor
                  </Heading>
                  <Button
                    fontSize={0}
                    onClick={() => {
                      this.resetDogPose(props);
                    }}
                  >
                    Reset Dog Pose
                  </Button>
                </Box>
                <Box width={4 / 5}>
                  <Heading fontSize={2} mt={1} mb={2}>
                    Bones
                  </Heading>
                  {this.renderDogBones(props)}
                </Box>
              </Flex>
            </Absolute>
          );
        }}
      </DogPetter>
    );
  }
}
