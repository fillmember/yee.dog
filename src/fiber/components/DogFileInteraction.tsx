import random from 'lodash/random'
import { useDropzone } from "react-dropzone";
import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { useFrame, createPortal } from "react-three-fiber";
import { ParticleTextureMap01 } from "../../3D/ParticleTextureMap";
import { useDogBone } from "../hooks/useDogBone";
import { ParticleSystem } from '../particlesystem/ParticleSystem';
import { EmitterOptions } from '../../3D/Particle/Emitter';
import { emit } from '../DogEvent';
export enum Event {
  Surprised = 'dog-file-interaction-surprised',
  Eating = 'dog-file-interaction-eating',
}
enum DropState {
  Enter = "enter",
  Leave = "leave",
  Dropped = "dropped",
}

export const withDropZone = (Component) => () => {
  const [state, setState] = useState<DropState>(null);
  const [file, setFile] = useState(null);
  const onDrop = useCallback((acceptedFiles) => {
    const { name, type, size } = acceptedFiles[0] || {};
    if (name) {
      setFile({ name, type, size });
    } else {
      setFile(null);
    }
    setState(DropState.Dropped);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => {
      setState(DropState.Enter);
    },
    onDragLeave: () => {
      setState(DropState.Leave);
    },
    noClick: true,
    noKeyboard: true,
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Component dropProps={{ isDragActive, state, file }} />
    </div>
  );
};

export const Surprised: React.FC<{enabled: boolean}> = ({enabled}) => {
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (enabled) {
      setActive(true)
      emit(Event.Surprised, true)
      setTimeout(() => {
        setActive(false)
        emit(Event.Surprised, false)
      },3000)
    }
  }, [enabled])
  const head = useDogBone('Head');
  const emitterOptions: EmitterOptions = useMemo(
    () => ({
      enabled: true,
      rate: 1,
      size: 2,
      lifespan: 2,
      sprite: ParticleTextureMap01['!'],
      position: [0,150,-50],
      acceleration: [0, 0.005, 0],
    }),
    [ head ]
  );
  return <>{active && createPortal(<ParticleSystem count={1} emitterOptions={emitterOptions} />, head)}</>
};

export const Eating: React.FC<{ enabled?: boolean; filename?: string }> = ({ enabled = true, filename = '' }) => {
  const [rate, setRate] = useState(0);
  useEffect(() => {
    if (enabled) {
      setRate(16)
      emit(Event.Eating, true)
    }
  },[enabled])
  useEffect(() => {
    if (rate === 0) {
      emit(Event.Eating, false)
    }
  }, [rate])
  useFrame(() => {
    setRate(prev => prev >= 1 ? prev - 0.05 : 0)
  })
  const bone = useDogBone("JawU_1");
  const emitterOptions: EmitterOptions = useMemo(
    () => ({
      enabled: true,
      rate,
      size: [1,0.66,0.33],
      lifespan: 1,
      sprite: filename.split("").map((char) => ParticleTextureMap01[char]),
      position: [0,0,100],
      acceleration: [0, -0.4, 0.001],
      velocity: () => [
        random( -6 ,  6,  true),
        random(  0 ,  2,  true),
        random( -3 , -10, true),
      ]
    }),
    [ bone, filename, rate]
  );
  return <>{createPortal(<ParticleSystem count={32} emitterOptions={emitterOptions} />, bone)}</>
};
export const DogFileInteraction = ({ state, file }) => {
  return (
    <>
      <Surprised enabled={state === 'enter'} />
      <Eating enabled={state === 'dropped'} filename={file?.name} />
    </>
  );
};
