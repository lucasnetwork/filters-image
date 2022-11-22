import { MASK } from "../../constants/masks.js";
import { mappingImagePixelsAndFillPixel } from "../../utils/mappingImagePixelsAndFillPixel.js";


export function dilationFunction({currentPixel,context,getMiddleMask,getMiddleMaskInto,imagePositionX,imagePositionY,mask}) {
            
    let allfill = false
    if(currentPixel.data[0] === 0){
        for(let i=0; i< mask.length;i++){
            for(let j=0; j < mask[i].length;j++){
                const newX =i-getMiddleMask.position
                const newY = j-getMiddleMaskInto.position
                const currentPixelLeftCenter =(newX+imagePositionX < 0 || newY+imagePositionY < 0 || newY+ imagePositionY > context.height || newX+imagePositionX > context.width) ? {data:[0]}:context.getImageData(imagePositionX+newX, imagePositionY+newY, 1, 1);
                
                if(currentPixelLeftCenter.data[0] === 255 && mask[i][j] ===1){
                    allfill = true
                }
            }
        }
    }else{
        allfill=true
    }

    return allfill
}

export function dilation({width,height,canvas,mask=MASK}){
    const canvas3 = document.createElement("canvas")
    canvas3.width = width;
    canvas3.height = height;
    const context = canvas3.getContext("2d")
    const currentPixel = canvas.getImageData(0, 0, width, height);

    context.putImageData(currentPixel,0,0)
    mappingImagePixelsAndFillPixel({width,height,context,canvas,callback:dilationFunction,mask})
}