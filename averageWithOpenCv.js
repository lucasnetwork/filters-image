function averageFilterWithOpencv(image, ksize) {
  const src = cv.imread(image);
  const dst = new cv.Mat();
  cv.blur(src, dst, new cv.Size(ksize, ksize), new cv.Point(-1, -1), cv.BORDER_DEFAULT);
  cv.imshow('canvas', dst);
  src.delete();
  dst.delete();
}
