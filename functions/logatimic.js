import { calculeGame } from '../utils/functions.js'
import { transformImageFor } from './transformImageFor.js'

function logarithmicRgb(pixel, { constant }) {
  return constant * Math.log(pixel + 1);
}

export function logarimitFilter({ data }) {
  const constant = calculeGame(data)
  transformImageFor({
    data, func: logarithmicRgb, options: {
      constant
    }
  })
}