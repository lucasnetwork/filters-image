function calculateHistogram(image) {
  var histogram = new cv.Mat();
  var mask = new cv.Mat();
  var histSize = [256];
  var ranges = [0, 256];
  cv.calcHist([image], [0], mask, histogram, histSize, ranges);
  return histogram;
}

function drawHistogram(histogram) {
  var canvas = document.getElementById('histogram');
  var ctx = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;
  var binWidth = Math.round(width / histogram.rows);
  ctx.clearRect(0, 0, width, height);
  for (var i = 0; i < histogram.rows; i++) {
    var binValue = histogram.data32F[i];
    var binHeight = Math.round(binValue * height / 255);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(i * binWidth, height - binHeight, binWidth, binHeight);
  }
}

function drawHistogramWithOpenCv(image) {
  var histogram = calculateHistogram(image);
  drawHistogram(histogram);
}