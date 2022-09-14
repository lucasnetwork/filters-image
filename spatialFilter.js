//make Spatial Smoothing Filters with canvas

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const maskSpatialSmoothing =
  [
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    +1.0, +1.0, +1.0
  ];


const maskMedian =
  [
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    +1.0, +1.0, +1.0
  ];

const maskGrayScale =
  [
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114
  ];

function medianFilter(data, { mask, width, height }) {
  const newImageData = context.createImageData(width, height);
  const newData = data;
  const maskSize = Math.sqrt(mask.length);
  const halfMaskSize = Math.floor(maskSize / 2);

  for (let i = 0; i < data.length; i += 4) {
    let sum = 0;
    let array = [];
    for (let j = 0; j < mask.length; j++) {
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      const maskX = j % maskSize;
      const maskY = Math.floor(j / maskSize);
      const imageX = (x - halfMaskSize + maskX + width) % width;
      const imageY = (y - halfMaskSize + maskY + height) % height;
      const idx = (imageX + imageY * width) * 4;
      array.push(data[idx]);
    }
    array.sort();
    data[i] = array[Math.floor(array.length / 2)];
    data[i + 1] = array[Math.floor(array.length / 2)];
    data[i + 2] = array[Math.floor(array.length / 2)];
    data[i + 3] = 255;
  }
}

function averageFilter(data, { mask, width, height }) {
  const maskSize = Math.sqrt(mask.length);
  const halfMaskSize = Math.floor(maskSize / 2);

  for (let i = 0; i < data.length; i += 4) {
    let sum = 0;
    for (let j = 0; j < mask.length; j++) {
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      const maskX = j % maskSize;
      const maskY = Math.floor(j / maskSize);
      const imageX = (x - halfMaskSize + maskX + width) % width;
      const imageY = (y - halfMaskSize + maskY + height) % height;
      const idx = (imageX + imageY * width) * 4;
      sum += data[idx] * mask[j];
    }
    data[i] = sum / mask.length;
    data[i + 1] = sum / mask.length;
    data[i + 2] = sum / mask.length;
    data[i + 3] = 255;
  }
}

var img = new Image();

img.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);
  const imageData = context.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;
  averageFilter(data, { mask: maskSpatialSmoothing, width: img.width, height: img.height });
  context.putImageData(imageData, 0, 0);
}

img.src = "https://mdn.mozillademos.org/files/5395/backdrop.png";