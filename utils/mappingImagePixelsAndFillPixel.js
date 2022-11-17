import { getMiddlePositionOfArray } from "./getMiddlePositionOfArray.js";

export function mappingImagePixelsAndFillPixel({width,height,context,canvas,callback,mask}){

    const getMiddleMask = getMiddlePositionOfArray(mask,0)
    const getMiddleMaskInto =getMiddlePositionOfArray(getMiddleMask.value,0)
    console.log(width,height)
    for(let y=0; y < height;y++){
    for(let x = 0; x < width;x++){
            const currentPixel = context.getImageData(x, y, 1, 1);
            
            const fillPixel = callback({currentPixel,context,getMiddleMask,getMiddleMaskInto,imagePositionX:x,imagePositionY:y,mask,height,width})
            if(!fillPixel){
                canvas.fillStyle = "#000";

            }else{
                canvas.fillStyle = "#fff";

            }
            canvas.fillRect(x, y, 1, 1);
            

        }
    }
}