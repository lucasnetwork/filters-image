
function conv3x(data, idx, w, m){
    return (m[0]*data[idx - w - 4] + m[1]*data[idx - 4] + m[2]*data[idx + w - 4]
        -m[0]*data[idx - w + 4] - m[1]*data[idx + 4] - m[2]*data[idx + 4 + 4]);
  }
  
  function conv3y(data, idx, w, m){
    return (m[0]*data[idx - w - 4] + m[1]*data[idx - w] + m[2]*data[idx - w + 4]
        -(m[0]*data[idx + w - 4] + m[1]*data[idx + w] + m[2]*data[idx + w + 4]));
  }
  
  
  /**
  * @param pixels - Object of image parameters
  * @param mask - gradient operator e.g. Prewitt, Sobel, Scharr, etc. 
  */
  function gradient_internal(pixels, {mask,width}){
    var data = pixels;
    var w = width*4;
    var l = data.length - w - 4;
    var buff = new data.constructor(new ArrayBuffer(data.length));
    
    for (var i = w + 4; i < l; i+=4){
      var dx = conv3x(data, i, w, mask);
      var dy = conv3y(data, i, w, mask);
      buff[i] = buff[i + 1] = buff[i + 2] = Math.sqrt(dx*dx + dy*dy);
      buff[i + 3] = 255;
    }
    pixels.set(buff);
  }
  
  
  
  
  //teste final
  
export function laplacian({data,...rest}){
    pixesl = [...data]
      gradient_internal(data,rest);
    for(let i =0;i <pixesl.length;i++){
    data[i] = pixesl[i] +data[i]
    }
  }