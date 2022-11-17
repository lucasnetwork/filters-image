import { mappingImagePixelsAndFillPixel } from "../../utils/mappingImagePixelsAndFillPixel.js";
import { erosion } from "./erosion.js";

const MASK =[
    [1,1,1],
    [1,1,1],
    [1,1,1]
]

export function dilationFunction({currentPixel,context,getMiddleMask,getMiddleMaskInto,imagePositionX,imagePositionY,mask}) {
            
    let allfill = false
    if(currentPixel.data[0] === 0){
        for(let i=0; i< mask.length;i++){
            for(let j=0; j < mask[i].length;j++){
                const newX =i-getMiddleMask.position
                const newY = j-getMiddleMaskInto.position
                const currentPixelLeftCenter =(newX+imagePositionX < 0 || newY+imagePositionY < 0 || newY+ imagePositionY > context.height || newX+imagePositionX > context.width) ? {data:[255]}:context.getImageData(imagePositionX+newX, imagePositionY+newY, 1, 1);
                
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

export function abertura({width,height,canvas}){
    erosion({width,height,canvas,mask:MASK})
    dilation({width,height,canvas,mask:MASK})
}