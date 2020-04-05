import { useAnimationClip } from ".";

export const example = {
  uuid: "example",
  name: "example",
  duration: 1,
  tracks: [
    {
      type: "number",
      name: "Pelvis.position[x]",
      times: [0, 1],
      values: [0, 10],
      interpolation: "default",
    },
  ],
};

export const useExampleClip = () => {
  const { clip, action } = useAnimationClip(example);
  action.play();
  action.weight = 1;
  console.log(clip, action);
};

export const TestClip = () => {
  useExampleClip();
  return null;
};
