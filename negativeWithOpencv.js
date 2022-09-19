function negativeWithOpencv(image) {
  const src = cv.imread(image);
  const dst = new cv.Mat();
  cv.bitwise_not(src, dst);
  cv.imshow('canvas', dst);
  src.delete();
  dst.delete();
}