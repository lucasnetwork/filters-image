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



function suavizacao_media(pixels, {mask,width,height}){
  for(let i = 1; i<= width;i++){
    for(let j=1; j<= height;j++){
      const temp = pixels[width*(i-1)+j-1]*mask[0]+pixels[width*(i-1)+j]*mask[1]+pixels[width*(i-1)+j + 1]*mask[2]+pixels[width*(i)+ j-1]*mask[3]+ pixels[width*i+ j]*mask[4]+pixels[width*(i)+j + 1]*mask[5]+pixels[width*(i + 1)+ j-1]*mask[6]+pixels[width*(i + 1)+ j]*mask[7]+pixels[width*(i + 1)+ j + 1]*mask[8]
      pixels[i*width+j] = temp
    }
  }
}

function suavizacao_mediaTeste(data,options){
  pixesl = [...data]
  suavizacao_media(data,options);
    for(let i =0;i <pixesl.length;i++){
     data[i] = pixesl[i] +data[i]
    }
}

function addImageInCanvas(url){

  var imageObj = new Image();
  imageObj.onload = function () {
    canvas.width = imageObj.width
    canvas.height = imageObj.height
    context.drawImage(imageObj, 0, 0);
  };
  imageObj.src = url;
  
}

function transformImage(){
  var canvasColor = context.getImageData(0, 0, imageObj.width, imageObj.height);
  
  const c = 255/Math.log(1+getMax(canvasColor.data))
  console.log("c",canvasColor)
  //suavizacao_media(canvasColor.data,{mask:maskTest,width:imageObj.width,height:imageObj.height})
  console.log("c",canvasColor)

 // suavizacao_mediaTeste(canvasColor.data,{width:canvasColor.width,mask:maskTest})
 //laplacian(canvasColor.data,{mask:sobel_h,width:imageObj.width})
//transformImage(canvasColor.data, laplacian,{mask:sobel_h,width:imageObj.width});
  context.putImageData(canvasColor, 0, 0);
}