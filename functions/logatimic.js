function logarithmicRgb(pixel,{constant}) {
    return constant*Math.log(pixel + 1);
  }

function executeLogarimitFilter({data}){
    const constant = calculeGame(data)
    transformImageFor({data,func:logarithmicRgb,options:{
      constant
    }})
  }