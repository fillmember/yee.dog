import React from "react";
import { Absolute } from "rebass";
import { DogPetter } from "./../DogContext.js";

const Debug = () => {
  return (
    <DogPetter>
      {stage => {
        return (
          <Absolute top={0} left={0} width="100vw" height="100vh">
            {stage.camera.position.x}
          </Absolute>
        );
      }}
    </DogPetter>
  );
};

export default Debug;
