import { laplacian } from './laplacian.js'
import { logarimitFilter } from './functions/logatimic.js'
import { potenciaFilter } from './functions/potencia.js'
import { localHistogramFilter, globalHistogramFilter } from './functions/histogram.js'
import { highBoostFilter } from './functions/highBoost.js'
import { transformImageFor } from './functions/transformImageFor.js'
const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const context = canvas.getContext("2d");
const context2 = canvas2.getContext("2d");


function negativergb(pixel) {
  return 255 - pixel;
}

function bitplaneSlicing(pixel, { bitplane = 0 }) {
  const bits = []
  for (var i = 7; i >= 0; i--) {
    var bit = pixel & (1 << i) ? 1 : 0;
    bits.push(bit);
  }

  for (var i = 7; i >= 0; i--) {
    if (i === bitplane) {
      bits[i] = 0
    }
  }
  return parseInt(bits.join(""), 2)
}


const sobel_v =
  [
    -1.0, 0.0, +1.0,
    -2.0, 0.0, +2.0,
    -1.0, 0.0, +1.0
  ];

const sobel_h =
  [
    -1.0, -2.0, -1.0,
    0.0, 0.0, 0.0,
    +1.0, +2.0, +1.0
  ];

const maskTest =
  [
    100.0, 2.0, 1.0,
    2.0, 4.0, 20.0,
    +10.0, +2.0, +1.0
  ];

let width = canvas.width
let height = canvas.height


function templateFilterImageByPureFunctions({ filterFunction, filterFunctionOptions }) {
  const canvasColor = context.getImageData(0, 0, width, height);
  context2.putImageData(canvasColor, 0, 0);
  const canvasColor2 = context2.getImageData(0, 0, width, height);
  filterFunction({ data: canvasColor2.data, ...filterFunctionOptions, width, height })

}

const filtersPureFunctions = {
  negative: {
    filterFunction: transformImageFor,
    filterFunctionOptions: {
      func: negativergb,
      options: {}
    }
  },
  laplacian: {
    filterFunction: laplacian,
    filterFunctionOptions: {
      mask: sobel_v,
    }
  },
  logarithmic: {
    filterFunction: logarimitFilter
  },
  potencia: {
    filterFunction: potenciaFilter
  },
  bitSlicing: {
    filterFunction: transformImageFor,
    filterFunctionOptions: {
      func: bitplaneSlicing,
      options: {
        bitplane: 0,

      }
    }
  }
}

const filtersOpenCv = {
  localHistogram: localHistogramFilter,
  globalHistogram: globalHistogramFilter,
  highBoost: highBoostFilter
}

function templateFilterImagesByOpenCv({ idCanvas, type, canvasShow }) {
  let src = cv.imread(idCanvas);
  let dst = new cv.Mat();
  filtersOpenCv[type]({ src, dst, boost_factor: 1 })
  cv.imshow(canvasShow, dst);
  src.delete();
  dst.delete();
}

const filter = {
  'pure': ({ type }) => {
    templateFilterImageByPureFunctions(filtersPureFunctions[type])

  },
  openCV: ({ type }) => {
    templateFilterImagesByOpenCv({ idCanvas: 'canvas', type, canvasShow: 'canvas2' })
  }
}

export function getDataImage({ type, typeFunction }) {
  width = canvas.width
  height = canvas.height
  filter[type]({ type: typeFunction })
}

