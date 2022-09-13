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

function transformImage(data, func,options) {
  for (var t = 0; t < data.length; t += 4) {
    data[t] = func(data[t],options);
    data[t + 1] = func(data[t + 1],options);
    data[t + 2] = func(data[t + 2],options);
  }
}

function getMax(arr) {
  return arr.reduce((max, v) => max >= v ? max : v, -Infinity);
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



//teste
function conv3x(data, idx, w, m){
  return (m[0]*data[idx - w - 4] + m[1]*data[idx - 4] + m[2]*data[idx + w - 4]
      -m[0]*data[idx - w + 4] - m[1]*data[idx + 4] - m[2]*data[idx + 4 + 4]);
}

function conv3y(data, idx, w, m){
  return (m[0]*data[idx - w - 4] + m[1]*data[idx - w] + m[2]*data[idx - w + 4]
      -(m[0]*data[idx + w - 4] + m[1]*data[idx + w] + m[2]*data[idx + w + 4]));
}


/**
* @param pixels - Object of image parameters
* @param mask - gradient operator e.g. Prewitt, Sobel, Scharr, etc. 
*/
function gradient_internal(pixels, {mask,width}){
  var data = pixels;
  var w = width*4;
  var l = data.length - w - 4;
  var buff = new data.constructor(new ArrayBuffer(data.length));
  
  for (var i = w + 4; i < l; i+=4){
    var dx = conv3x(data, i, w, mask);
    var dy = conv3y(data, i, w, mask);
    buff[i] = buff[i + 1] = buff[i + 2] = Math.sqrt(dx*dx + dy*dy);
    buff[i + 3] = 255;
  }
  pixels.set(buff);
}

function suavizacao_media(pixels, {mask,width,height}){
  for(let i = 1; i<= width;i++){
    for(let j=1; j<= height;j++){
      const temp = pixels[width*(i-1)+j-1]*mask[0]+pixels[width*(i-1)+j]*mask[1]+pixels[width*(i-1)+j + 1]*mask[2]+pixels[width*(i)+ j-1]*mask[3]+ pixels[width*i+ j]*mask[4]+pixels[width*(i)+j + 1]*mask[5]+pixels[width*(i + 1)+ j-1]*mask[6]+pixels[width*(i + 1)+ j]*mask[7]+pixels[width*(i + 1)+ j + 1]*mask[8]
      pixels[i*width+j] = temp
    }
  }
}


//teste final

function laplacian(data,options){
  pixesl = [...data]
    gradient_internal(data,options);
    for(let i =0;i <pixesl.length;i++){
     data[i] = pixesl[i] +data[i]
    }
}

function suavizacao_mediaTeste(data,options){
  pixesl = [...data]
  suavizacao_media(data,options);
    for(let i =0;i <pixesl.length;i++){
     data[i] = pixesl[i] +data[i]
    }
}


var imageObj = new Image();
imageObj.onload = function () {
  canvas.width = imageObj.width
  canvas.height = imageObj.height
  context.drawImage(imageObj, 0, 0);
  var canvasColor = context.getImageData(0, 0, imageObj.width, imageObj.height);

  const c = 255/Math.log(1+getMax(canvasColor.data))
  console.log("c",canvasColor)
  suavizacao_media(canvasColor.data,{mask:maskTest,width:imageObj.width,height:imageObj.height})
  console.log("c",canvasColor)

 // suavizacao_mediaTeste(canvasColor.data,{width:canvasColor.width,mask:maskTest})
  //transformImage(canvasColor.data, laplacian,{gama:0.3,constant:c});
  context.putImageData(canvasColor, 0, 0);
};
imageObj.src = "test.jpg";
