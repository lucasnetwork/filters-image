function slicingByBitWithOpencv2() {
  var src = cv.imread("canvasInput");
  var dst = new cv.Mat();
  var M = cv.Mat.ones(5, 5, cv.CV_8U);
  var anchor = new cv.Point(-1, -1);
  cv.bitwise_not(src, src);
  cv.dilate(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
  cv.imshow("canvas", dst);
  src.delete();
  dst.delete();
}


