//make Spatial Smoothing Filters with canvas
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

  
export function medianSmoothingFilter(data, { mask, width, height }) {
  const maskSize = Math.sqrt(mask.length);
  const halfMaskSize = Math.floor(maskSize / 2);

  for (let i = 0; i < data.length; i += 4) {
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

export function averageSmoothingFilter(data, { mask, width, height }) {
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