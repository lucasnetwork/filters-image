function RobertsFilterWithOpencv(image) {
  console.log("RobertsFilterWithOpencv");
  const src = cv.imread(image);
  const dst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.Sobel(src, dst, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
  cv.imshow('canvas', dst);
  src.delete();
  dst.delete();
}