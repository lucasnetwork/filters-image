export function bitplaneSlicing(pixel, { bitplane = 0 }) {
    const bits = [];
    for (var i = 7; i >= 0; i--) {
      var bit = pixel & (1 << i) ? 1 : 0;
      bits.push(bit);
    }
  
    for (var i = 7; i >= 0; i--) {
      if (i === bitplane) {
        bits[i] = 0;
      }
    }
    return parseInt(bits.join(""), 2);
  }