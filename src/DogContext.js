import React from "react";

const { Provider, Consumer } = React.createContext("dog");

export const DogProvider = Provider;
export const DogPetter = Consumer;
