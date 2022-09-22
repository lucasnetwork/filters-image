export function highBoostFilter({ src, dst, boost_factor = 2 }) {
  const highBoost = new cv.Mat();
  const kernel = new cv.Mat(3, 3, cv.CV_32FC1);
  const anchor = new cv.Point(-1, -1);
  cv.filter2D(
    src,
    highBoost,
    src.depth(),
    kernel,
    anchor,
    0,
    cv.BORDER_DEFAULT
  );
  cv.addWeighted(src, 1 + boost_factor, highBoost, -boost_factor, 0, dst);
  cv.imshow("canvas", dst);
  highBoost.delete();
  kernel.delete();
}
