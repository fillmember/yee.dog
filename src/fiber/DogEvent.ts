import { EventEmitter } from "events";
import { useEffect, useState } from "react";

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

export const useLatestEventPayload = (event: string, initialState: any) => {
  const [state, setState] = useState(initialState);
  useEffect(() => subscribe(event, setState), [event]);
  return state;
};

export const EventHandler = ({
  events,
  children,
  initialStates = [],
}: {
  events: string[];
  children: (payload: any[]) => JSX.Element;
  initialStates?: any[];
}): JSX.Element => {
  const state = events.map((event, index) =>
    useLatestEventPayload(event, initialStates[index])
  );
  return children(state);
};
