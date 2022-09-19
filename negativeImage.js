const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function negativergb(pixel) {
  return 255 - pixel;
}

function logarithmicRgb(pixel,{constant}) {
  return constant*Math.log(pixel + 1);
}

function potencia(pixel,{gama,constant}){
  return constant*Math.pow(pixel,gama)
} 

function bitplaneSlicing(pixel, { bitplane }) {
  return pixel >> bitplane & 1;
}

function transformImageFor({data, func,options}) {
  for (var t = 0; t < data.length; t += 4) {
    data[t] = func(data[t],options);
    data[t + 1] = func(data[t + 1],options);
    data[t + 2] = func(data[t + 2],options);
  }
}

function getMax(arr) {
  return arr.reduce((max, v) => max >= v ? max : v, 0);
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
  }
}

function getDataImage(){
  transformImage(filters.laplacian)

  //var canvasColor = context.getImageData(0, 0, width, height);
  
  //const c = 255/Math.log(1+getMax(canvasColor.data))
  //medianFilter(canvasColor.data,{mask:maskTest,width:width,height:height})
 //laplacian(canvasColor.data,{mask:sobel_h,width:imageObj.width})
//transformImage(canvasColor.data, laplacian,{mask:sobel_h,width:imageObj.width});
}


const addImageInCanvasObject={
  "image/tiff":  ({url}) =>{
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', url);
    xhr.onload = function (e) {
      var tiff = new Tiff({buffer: xhr.response});
      width = tiff.width();
      height = tiff.height();
      var canvasTif = tiff.toCanvas();
      if (canvasTif) {
        const contextTiff = canvasTif.getContext("2d");
        var canvasColor = contextTiff.getImageData(0, 0,width,height);
        canvas.width = width
        canvas.height = height
        context.putImageData(canvasColor, 0, 0);

      }
    };
    xhr.send();}
}

function addImageInCanvas({url,type}){
  const existFunction = addImageInCanvasObject[type]
  if(existFunction){
    existFunction({url})
    return
  }

  const imageObj = new Image();
  imageObj.onload = function () {
    canvas.width = imageObj.width
    canvas.height = imageObj.height
    width = imageObj.width
    height = imageObj.height
    context.drawImage(imageObj, 0, 0);
    getDataImage()
  };
  imageObj.src = url;
  
}


