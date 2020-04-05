import React, { useContext } from "react";

export const DogContext = React.createContext({
  mesh: null,
  mixer: null,
});
export const { Provider: DogProvider, Consumer: DogPetter } = DogContext;

export const useDogContext = () => useContext(DogContext);
