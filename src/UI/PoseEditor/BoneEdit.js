import React from "react";
import { Flex, Box, Heading, Text } from "rebass";

const NumericInput = ({ value, object, property, update }) => (
  <input
    type="number"
    step={10}
    value={value}
    onChange={evt => {
      object[property] = (parseFloat(evt.target.value) * Math.PI) / 180;
      update();
    }}
  />
);

export default class BoneEdit extends React.Component {
  render() {
    const { title, bone, dog, update } = this.props;
    return (
      <Box width={1 / 7} mb={1}>
        <Heading fontSize={"10px"} fontFamily="mono">
          {this.props.title}
        </Heading>
        <Flex
          css={`
            input {
              box-sizing: border-box;
              font-size: 10px;
              margin: 0;
              padding: 0;
              background: transparent;
              border: none;
              border-bottom: 1px solid white;
              color: #fff;
              outline: none;
              width: calc(100% - 1px);
            }
          `}
        >
          <Box width={1 / 3}>
            <NumericInput
              value={((bone.rotation.x * 180) / Math.PI).toFixed(0)}
              object={bone.rotation}
              property="x"
              update={update}
            />
          </Box>
          <Box width={1 / 3}>
            <NumericInput
              value={((bone.rotation.y * 180) / Math.PI).toFixed(0)}
              object={bone.rotation}
              property="y"
              update={update}
            />
          </Box>
          <Box width={1 / 3}>
            <NumericInput
              value={((bone.rotation.z * 180) / Math.PI).toFixed(0)}
              object={bone.rotation}
              property="z"
              update={update}
            />
          </Box>
        </Flex>
      </Box>
    );
  }
}
