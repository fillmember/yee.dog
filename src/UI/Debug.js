import React from "react";
import {
  Absolute,
  Flex,
  Box,
  Heading,
  Checkbox,
  Text,
  Button,
  Label,
  Slider
} from "rebass";
import { DogPetter } from "./../DogContext.js";

export const ValueSlider = ({
  label,
  object,
  property,
  update,
  min = 0,
  max = 1,
  step = 0.01
}) => {
  return (
    <Flex>
      <Label>{label}</Label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={object[property]}
        onChange={evt => {
          object[property] = evt.target.value;
          update();
        }}
      />
      <Text>{Math.round(object[property] * 10) / 10}</Text>
    </Flex>
  );
};

export const Vector3Control = ({
  vec,
  update,
  min = -10,
  max = 10,
  step = 0.01
}) => {
  return (
    <Box>
      <ValueSlider
        min={min}
        max={max}
        step={step}
        label="X"
        object={vec}
        property="x"
        update={update}
      />
      <ValueSlider
        min={min}
        max={max}
        step={step}
        label="Y"
        object={vec}
        property="y"
        update={update}
      />
      <ValueSlider
        min={min}
        max={max}
        step={step}
        label="Z"
        object={vec}
        property="z"
        update={update}
      />
    </Box>
  );
};

/*
<Button
  onClick={() => {
    stage.orbitcontrols.autoRotate = !stage.orbitcontrols
      .autoRotate;
    update();
  }}
>
  {stage.orbitcontrols.autoRotate
    ? "disable Auto Rotate"
    : "enable Auto Rotate"}
</Button>
*/

export default class Debug extends React.Component {
  render() {
    return (
      <Absolute p={2} top={0} left={0}>
        <DogPetter>
          {({ stage, dog, update }) => {
            if (!stage || !dog) {
              return <Button onClick={update}>Doggo?</Button>;
            }
            return (
              <React.Fragment>
                <Heading fontSize={[3, 5]}>Particles</Heading>
                <Box>
                  {Object.keys(dog.particles.systems).map(key => {
                    const system = dog.particles.systems[key];
                    const config = system.config;
                    return (
                      <Box key={key}>
                        <Heading fontSize={[2, 4]}>{key}</Heading>
                        <Checkbox
                          defaultChecked={system.visible}
                          onInput={evt => {
                            system.visible = evt.target.checked;
                            update();
                          }}
                        />
                        <ValueSlider
                          label="rate"
                          min={0}
                          max={60}
                          step={0.1}
                          object={config.emitter}
                          property="rate"
                          update={update}
                        />
                      </Box>
                    );
                  })}
                </Box>
                <Heading fontSize={[3, 5]}>Animation</Heading>
                <Box>
                  {Object.keys(dog.animation.actions).map(key => {
                    const action = dog.animation.actions[key];
                    return (
                      <ValueSlider
                        key={key}
                        label={key}
                        object={action}
                        property="weight"
                        update={update}
                      />
                    );
                  })}
                </Box>
                <Heading fontSize={[2, 4]}>IKs</Heading>
                <Box>
                  {Object.keys(dog.ik.chains).map(key => {
                    const chain = dog.ik.chains[key];
                    return (
                      <Box key={key}>
                        <Heading fontSize={[2, 4]}>{key}</Heading>
                        <ValueSlider
                          label="Influence"
                          object={chain}
                          property="influence"
                          update={update}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </React.Fragment>
            );
          }}
        </DogPetter>
      </Absolute>
    );
  }
}
