function spatialFilterSmooth(image, ksize) {
  const src = cv.imread(image);
  const dst = new cv.Mat();
  cv.boxFilter(src, dst, -1, new cv.Size(ksize, ksize), new cv.Point(-1, -1), true, cv.BORDER_DEFAULT);
  cv.imshow('canvas', dst);
  src.delete();
  dst.delete();
}