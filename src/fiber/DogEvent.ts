import { EventEmitter } from "events";

export const emitter = new EventEmitter();

export const unsubscribe = (event: string, listener) => {
  emitter.off(event, listener);
};

export const subscribe = (event: string, listener) => {
  emitter.on(event, listener);
  return () => unsubscribe(event, listener);
};

export function emit<T>(event: string, payload: T) {
  emitter.emit(event, payload);
}
