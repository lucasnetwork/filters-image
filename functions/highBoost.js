export function highBoostFilter({src,dst:highboost,boost_factor}) {
  const kernel = new cv.Mat(3, 3, cv.CV_32FC1);
  let ksize = new cv.Size(3, 3);
  cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
  const dst = new cv.Mat();
  cv.addWeighted(src, 1 + boost_factor, dst, -boost_factor, 0, highboost);
  kernel.delete();
  dst.delete();
}