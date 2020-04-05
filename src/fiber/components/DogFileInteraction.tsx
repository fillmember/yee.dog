import { useDropzone } from "react-dropzone";
import { useCallback, useState, useEffect } from "react";
import { useFrame } from "react-three-fiber";

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
  // const onDragEnter
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
      <Component dropProps={{ state, file }} />
    </div>
  );
};

export const DogFileInteraction = ({ state, file }) => {
  return null;
};
