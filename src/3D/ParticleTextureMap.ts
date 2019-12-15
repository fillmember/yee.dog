// prettier-ignore
export const ParticleTextureMap01: Record<number | string, number> = [
  0, 1, 2, 3, 4, 5, 6, 7,
  8, 9, "a","b","c","d","e","f",
  "g","h","i","j","k","l","m","n",
  "o","p","q","r","s","t","u","v",
  "w","x","y","z","!","?",".","_",
  "❤","♫","×"
].reduce((object, value, index) => {
  object[value] = index;
  return object;
}, {});
