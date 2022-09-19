function slicingByBitWithOpencv(image, bit) {
  const src = cv.imread(image);
  const dst = new cv.Mat();
  cv.bitwise_and(src, src, dst, new cv.Mat());
  cv.imshow('canvas', dst);
  src.delete();
  dst.delete();

}