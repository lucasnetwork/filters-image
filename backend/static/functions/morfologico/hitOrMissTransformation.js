import { mappingImagePixelsAndFillPixel } from "../../utils/mappingImagePixelsAndFillPixel.js";


const MASK = [
    [[null,1,null],[0,1,1],[0,0,null]],
    [[null,1,null],[1,1,0],[null,0,0]],
    [[null,0,0],[1,1,0],[null,1,null]],
    [[0,0,null],[0,1,1],[null,1,null]]
]


export function hitOrMissTransformationFunction({currentPixel,context,getMiddleMask,getMiddleMaskInto,imagePositionX,imagePositionY,mask}) {
    let allfill = true
    if(currentPixel.data[0] === 255){
        for(let k=0;k < mask.length; k++){
             allfill = true

            for(let i=0; i< mask[k].length;i++){
                for(let j=0; j < mask[k][i].length;j++){
                    const newX =i-getMiddleMask.position
                    const newY = j-getMiddleMaskInto.position
                    const currentPixelLeftCenter =(newX+imagePositionX < 0 || newY+imagePositionY < 0 || newY+ imagePositionY > context.height || newX+imagePositionX > context.width) ? {data:[255]}:context.getImageData(imagePositionX+newX, imagePositionY+newY, 1, 1);
                    
                    if(!((currentPixelLeftCenter.data[0] === 255 && mask[k][i][j] ===1 )|| (currentPixelLeftCenter.data[0] === 0 && mask[k][i][j] ===0 ) || mask[k][i][j] === null)){
                        allfill = false
                    }
                }
            }
        }
    }else{
        allfill=false
    }

    return allfill
}

export function hitOrMissTransformation({width,height,canvas}){
    const canvas3 = document.createElement("canvas")
    canvas3.width = width;
    canvas3.height = height;
    const context = canvas3.getContext("2d")
    const currentPixel = canvas.getImageData(0, 0, width, height);

    context.putImageData(currentPixel,0,0)
    mappingImagePixelsAndFillPixel({width,height,context,canvas,callback:hitOrMissTransformationFunction,mask:MASK})
}