export const getRandomInt = (min: number, max: number): number => {
  const ceiledMin = Math.ceil(min);
  const ceiledMax = Math.floor(max);

  return Math.floor(Math.random() * (ceiledMax - ceiledMin)) + ceiledMin;
};
