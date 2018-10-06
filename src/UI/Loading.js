import React from "react";
import { Flex, Box, Heading } from "rebass";
import { DogPetter } from "./../DogContext.js";

const Loading = () => (
  <DogPetter>
    {({ dog }) => {
      if (!dog) {
        return (
          <Flex
            justifyContent="center"
            alignItems="center"
            css={`
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              height: 100vh;
            `}
          >
            <Box>
              <Heading fontSize={[6, 9]}>Loading...</Heading>
            </Box>
          </Flex>
        );
      } else {
        return false;
      }
    }}
  </DogPetter>
);

export default Loading;
