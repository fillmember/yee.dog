import { EventEmitter } from "events";

export const emitter = new EventEmitter();

export const subscribe = (event: string, listener) => {
  emitter.on(event, listener);
};

export const unsubscribe = (event: string, listener) => {
  emitter.off(event, listener);
};
