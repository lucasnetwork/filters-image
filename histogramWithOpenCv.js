

function globalHistogramFilter({src,dst}){
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.equalizeHist(src, dst);

}


function localHistogramFilter({src,dst}) {
  globalHistogramFilter({src,dst})
  let tileGridSize = new cv.Size(8, 8);
  let clahe = new cv.CLAHE(40, tileGridSize);
  clahe.apply(src, dst);

}