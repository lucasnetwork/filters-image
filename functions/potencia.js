import { calculeGame } from "../utils/functions.js";

function potencia(pixel, { gama, constant }) {
  return constant * Math.pow(pixel, gama);
}

export function potenciaFilter({ data, gama = 1 }) {
  const constant = calculeGame(data);
  transformImageFor({
    data,
    func: potencia,
    options: {
      constant,
      gama,
    },
  });
}
