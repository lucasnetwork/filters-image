function spatialFilterSharpen(image, ksize) {
  const src = cv.imread(image);
  const dst = new cv.Mat();
  cv.boxFilter(src, dst, -1, new cv.Size(ksize, ksize), new cv.Point(-1, -1), true, cv.BORDER_DEFAULT);
  const highboost = new cv.Mat();
  cv.addWeighted(src, 1.5, dst, -0.5, 0, highboost);
  cv.imshow('canvas', highboost);
  src.delete();
  dst.delete();
  highboost.delete();
}
