function potencia(pixel,{gama,constant}){
  return constant*Math.pow(pixel,gama)
} 


function executePotenciaFilter({data,gama=1}){
    const constant = calculeGame(data)
    transformImageFor({data,func:potencia,options:{
      constant,
      gama
    }})
  }