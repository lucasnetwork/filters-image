import {
  sobelX,
  sobelY,
  laplacianMask,
  robertX,
  robertY,
} from "./utils/masks.js";
import { transformImageFor } from "./functions/transformImageFor.js";
import {
  averageSmoothingFilter,
  bitplaneSlicing,
  borderDetect,
  globalHistogramFilter,
  highBoostFilter,
  localHistogramFilter,
  logarimitFilter,
  medianSmoothingFilter,
  negativergb,potenciaFilter
} from "./functions/filters/index.js";
import { erosion } from "./functions/morfologico/erosion.js";
import { dilation } from "./functions/morfologico/dilation.js";
import { abertura } from "./functions/morfologico/abertura.js";
import { extracao } from "./functions/alg_morfologicos/borderExtraction.js";
import { closing } from "./functions/morfologico/closing.js";
import { hitOrMissTransformation } from "./functions/morfologico/hitOrMissTransformation.js";
import { detectionBorders } from "./functions/segmentation/detectionBorders.js";

const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const context = canvas.getContext("2d");
const context2 = canvas2.getContext("2d",{willReadFrequently:true});

let width = canvas.width;
let height = canvas.height;

function templateFilterImageByPureFunctions({
  filterFunction,
  filterFunctionOptions,
}) {
  const canvasColor = context.getImageData(0, 0, width, height);
  
  context2.putImageData(canvasColor, 0, 0);
  if(filterFunctionOptions.notPutImage){
    let dst = new cv.Mat();
    let src = cv.imread("canvas");
  
    cv.cvtColor(src, dst, cv.COLOR_BGR2GRAY);
    cv.threshold(dst, dst,127,255, cv.THRESH_BINARY)
    cv.imshow("canvas2", dst);
  }

  const canvasColor2 = context2.getImageData(0, 0, width, height);
  filterFunction({
    canvas:context2,
    data: canvasColor2.data,
    ...filterFunctionOptions,
    width,
    height,
  });
  context2.putImageData(canvasColor2, 0, 0);
}

function templateFilterImageByPureFunctionsWithDrawCanvas({
  filterFunction,
  filterFunctionOptions,}){
    const canvasColor = context.getImageData(0, 0, width, height);
  
    context2.putImageData(canvasColor, 0, 0);
    let dst = new cv.Mat();
    let src = cv.imread("canvas");
  
    cv.cvtColor(src, dst, cv.COLOR_BGR2GRAY);
    if(!filterFunctionOptions.notBinary){
      cv.threshold(dst, dst,127,255, cv.THRESH_BINARY)

    }
    cv.imshow("canvas2", dst);
  
    const canvasColor2 = context2.getImageData(0, 0, width, height);
    filterFunction({
      canvas:context2,
      data: canvasColor2.data,
      ...filterFunctionOptions,
      width,
      height,
    });
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
  erosion:{
    filterFunction:erosion,

  },
  dilation:{
    filterFunction:dilation,

  },
  abertura:{
    filterFunction:abertura,

  },
  closing:{
    filterFunction:closing,
  },
  hitOrMissTransformation:{
    filterFunction:hitOrMissTransformation
  },
  detectionBorders:{
    filterFunction:detectionBorders,
    filterFunctionOptions:{
      notBinary:true
    }
  }
};

const filtersOpenCv = {
  localHistogram: localHistogramFilter,
  globalHistogram: globalHistogramFilter,
  highBoost: highBoostFilter,
  extracao: extracao
};

function templateFilterImagesByOpenCv({ idCanvas, type, canvasShow }) {
  let src = cv.imread(idCanvas);
  let dst = new cv.Mat();
  filtersOpenCv[type]({ src, dst, boost_factor: 1 });
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
  newPureFunctions:({type})=>{
    templateFilterImageByPureFunctionsWithDrawCanvas(filtersPureFunctions[type])
  }
};

export function getDataImage({ type, typeFunction }) {
  width = canvas.width;
  height = canvas.height;
  filter[type]({ type: typeFunction });
}
