const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function negativergb(pixel) {
  return 255 - pixel;
}

function bitplaneSlicing(pixel, { bitplane=0 }) {
  const bits = []
  for (var i = 7; i >= 0; i--) {
    var bit = pixel & (1 << i) ? 1 : 0;
    bits.push(bit);
 }

 for(var i = 7; i >= 0 ; i--){
  if(i === bitplane){
    bits[i] = 0
  }
 }
 return parseInt(bits.join(""),2)
}

function transformImageFor({data, func,options}) {
  for (var t = 0; t < data.length; t += 4) {
    data[t] = func(data[t],options);
    data[t + 1] = func(data[t + 1],options);
    data[t + 2] = func(data[t + 2],options);
  }
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
   0.0,  0.0,  0.0,
  +1.0, +2.0, +1.0
];

const maskTest =
[
  100.0, 2.0, 1.0,
   2.0,  4.0,  20.0,
  +10.0, +2.0, +1.0
];

let width = 0
let height = 0


function transformImage({filterFunction,filterFunctionOptions}){
  const canvasColor = context.getImageData(0, 0, width, height);
  filterFunction({data:canvasColor.data,...filterFunctionOptions,width,height})
  context.putImageData(canvasColor, 0, 0);
}

const filters = {
  negative:{
    filterFunction:transformImageFor,
    filterFunctionOptions:{
      func:negativergb,
      options:{}
    }
  },
  laplacian:{
    filterFunction:laplacian,
    filterFunctionOptions:{
      mask:sobel_v,
    }
  },
  logarithmic:{
    filterFunction:executeLogarimitFilter
  },
  potencia:{
    filterFunction:executePotenciaFilter
  },
  bitSlicing:{
    filterFunction:transformImageFor ,
    filterFunctionOptions:{
      func:bitplaneSlicing,
      options:{
        bitplane:0,

      }
    }
  }
}

function getDataImage(){
// slicingByBitWithOpencv('canvas')
  transformImage(filters.bitSlicing)

  //var canvasColor = context.getImageData(0, 0, width, height);
  
  //const c = 255/Math.log(1+getMax(canvasColor.data))
  //medianFilter(canvasColor.data,{mask:maskTest,width:width,height:height})
 //laplacian(canvasColor.data,{mask:sobel_h,width:imageObj.width})
//transformImage(canvasColor.data, laplacian,{mask:sobel_h,width:imageObj.width});
}

