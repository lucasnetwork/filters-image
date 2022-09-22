function conv3x(data, idx, w, m) {
  return (
    m[0] * data[idx - w - 4] +
    m[1] * data[idx - 4] +
    m[2] * data[idx + w - 4] -
    m[0] * data[idx - w + 4] -
    m[1] * data[idx + 4] -
    m[2] * data[idx + 4 + 4]
  );
}

function conv3y(data, idx, w, m) {
  return (
    m[0] * data[idx - w - 4] +
    m[1] * data[idx - w] +
    m[2] * data[idx - w + 4] -
    (m[0] * data[idx + w - 4] + m[1] * data[idx + w] + m[2] * data[idx + w + 4])
  );
}

/**
 * @param pixels - Object of image parameters
 * @param mask - gradient operator e.g. Prewitt, Sobel, Scharr, etc.
 */
function gradient_internal(pixels, { maskX, maskY, width }) {
  var data = [...pixels];
  var w = width * 4;
  var l = data.length - w - 4;
  var buff = new data.constructor(new ArrayBuffer(data.length));

  for (var i = w + 4; i < l; i += 4) {
    var dx = conv3x(data, i, w, maskX);
    var dy = conv3y(data, i, w, maskY);
    pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.sqrt(dx * dx + dy * dy);
    pixels[i + 3] = 255;
  }
}

//teste final

export function borderDetect({ data, ...rest }) {
  const pixels = [...data];
  gradient_internal(data, rest);

  for (let i = 0; i < pixels.length; i++) {
    data[i] = pixels[i] + data[i];
  }
}
