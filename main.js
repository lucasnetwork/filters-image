import { borderDetect } from "./functions/borderDetect.js";
import { logarimitFilter } from "./functions/logatimic.js";
import { potenciaFilter } from "./functions/potencia.js";
import {
  localHistogramFilter,
  globalHistogramFilter,
} from "./functions/histogram.js";
import { highBoostFilter } from "./functions/highBoost.js";
import { transformImageFor } from "./functions/transformImageFor.js";
import {
  medianSmoothingFilter,
  averageSmoothingFilter,
} from "./functions/spatialFilter.js";
import {bitplaneSlicing} from './functions/bitSlicing.js'
import {negativergb} from './functions/negative.js'
import {
  sobelX,
  sobelY,
  laplacianMask,
  robertX,
  robertY,
} from "./utils/masks.js";

const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const context = canvas.getContext("2d");
const context2 = canvas2.getContext("2d");





let width = canvas.width;
let height = canvas.height;

function templateFilterImageByPureFunctions({
  filterFunction,
  filterFunctionOptions,
}) {
  const canvasColor = context.getImageData(0, 0, width, height);
  context2.putImageData(canvasColor, 0, 0);
  const canvasColor2 = context2.getImageData(0, 0, width, height);
  filterFunction({
    data: canvasColor2.data,
    ...filterFunctionOptions,
    width,
    height,
  });
  context2.putImageData(canvasColor2, 0, 0);
}

const filtersPureFunctions = {
  negative: {
    filterFunction: transformImageFor,
    filterFunctionOptions: {
      func: negativergb,
      options: {},
    },
  },
  sorbel: {
    filterFunction: borderDetect,
    filterFunctionOptions: {
      maskY: sobelY,
      maskX: sobelX,
    },
  },
  robert: {
    filterFunction: borderDetect,
    filterFunctionOptions: {
      maskY: robertY,
      maskX: robertX,
    },
  },
  laplacian: {
    filterFunction: borderDetect,
    filterFunctionOptions: {
      maskY: laplacianMask,
      maskX: laplacianMask,
    },
  },
  logarithmic: {
    filterFunction: logarimitFilter,
  },
  potencia: {
    filterFunction: potenciaFilter,
  },
  bitSlicing: {
    filterFunction: transformImageFor,
    filterFunctionOptions: {
      func: bitplaneSlicing,
      options: {
        bitplane: 0,
      },
    },
  },
  medianSmoothing: {
    filterFunction: medianSmoothingFilter,
  },
  averageSmoothing: {
    filterFunction: averageSmoothingFilter,
  },
};

const filtersOpenCv = {
  localHistogram: localHistogramFilter,
  globalHistogram: globalHistogramFilter,
  highBoost: highBoostFilter,
};

function templateFilterImagesByOpenCv({ idCanvas, type, canvasShow }) {
  let src = cv.imread(idCanvas);
  let dst = new cv.Mat();
  filtersOpenCv[type]({ src, dst, boost_factor: 1 });
  cv.imshow(idCanvas, src);

  cv.imshow(canvasShow, dst);
  src.delete();
  dst.delete();
}

const filter = {
  pure: ({ type }) => {
    templateFilterImageByPureFunctions(filtersPureFunctions[type]);
  },
  openCV: ({ type }) => {
    templateFilterImagesByOpenCv({
      idCanvas: "canvas",
      type,
      canvasShow: "canvas2",
    });
  },
};

export function getDataImage({ type, typeFunction }) {
  width = canvas.width;
  height = canvas.height;
  filter[type]({ type: typeFunction });
}
