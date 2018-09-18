import React from "react";
import {
  Absolute,
  Input,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Label,
  Slider
} from "rebass";
import { DogPetter } from "./../DogContext.js";

export default class Debug extends React.Component {
  render() {
    return (
      <DogPetter>
        {({ stage, dog, update }) => {
          if (!stage || !dog) {
            return false;
          }
          return (
            <Absolute p={2} top={0} left={0} width="100vw" height="100vh">
              <Box>
                <Heading>Camera Position</Heading>
                {stage.camera.position
                  .toArray()
                  .map(v => v.toFixed(1))
                  .map((v, i) => (
                    <Text key={i}>{v}</Text>
                  ))}
              </Box>
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
              <Heading>Particles</Heading>
              <Box>
                {Object.keys(dog.particles.systems).map(key => {
                  const system = dog.particles.systems[key];
                  const config = system.config;
                  return (
                    <Box key={key}>
                      <Heading>{key}</Heading>
                      <Heading>Emitter</Heading>
                      <Flex>
                        <Label>Rate</Label>
                        <Slider
                          min="0"
                          max="60"
                          step="1"
                          value={config.emitter.rate}
                          onChange={evt => {
                            config.emitter.rate = evt.target.value;
                            update();
                          }}
                        />
                        <Text>{config.emitter.rate}</Text>
                      </Flex>
                    </Box>
                  );
                })}
              </Box>
              <Heading>Animation</Heading>
              <Box>
                {Object.keys(dog.animation.actions).map(key => {
                  const action = dog.animation.actions[key];
                  return (
                    <Box key={key}>
                      <Heading>{key}</Heading>
                      <button
                        onClick={() => {
                          action.paused = false;
                          update();
                        }}
                      >
                        Play
                      </button>
                      <button
                        onClick={() => {
                          action.paused = true;
                          update();
                        }}
                      >
                        Pause
                      </button>
                      {action.time.toFixed(1)}
                      {action.timeScale}
                    </Box>
                  );
                })}
              </Box>
              <Heading>IKs</Heading>
              <Box>
                {Object.keys(dog.ik.chains).map(key => {
                  return (
                    <Box key={key}>
                      <Heading>{key}</Heading>
                    </Box>
                  );
                })}
              </Box>
            </Absolute>
          );
        }}
      </DogPetter>
    );
  }
}
