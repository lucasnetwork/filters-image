function getMax(arr) {
  return arr.reduce((max, v) => (max >= v ? max : v), 0);
}

export function calculeGame(array) {
  return 255 / Math.log(1 + getMax(array));
}
