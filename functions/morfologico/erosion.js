import { mappingImagePixelsAndFillPixel } from "../../utils/mappingImagePixelsAndFillPixel.js";

// const MASK = [
//     [0,0,0,0,0,1,0,0,0,0,0],
//     [0,0,0,0,1,1,1,0,0,0,0],
//     [0,0,0,1,1,1,1,1,0,0,0],
//     [0,0,1,1,1,1,1,1,1,0,0],
//     [0,1,1,1,1,1,1,1,1,1,0],
//     [1,1,1,1,1,1,1,1,1,1,1],
//     [0,1,1,1,1,1,1,1,1,1,0],
//     [0,0,1,1,1,1,1,1,1,0,0],
//     [0,0,0,1,1,1,1,1,0,0,0],
//     [0,0,0,0,1,1,1,0,0,0,0],
//     [0,0,0,0,0,1,0,0,0,0,0],
// ]

const MASK = [
    [0,0,1,0,0],
    [0,1,1,1,0],
    [1,1,1,1,1],
    [0,1,1,1,0],
    [0,0,1,0,0],
]

// const MASK = [
//     [0,1,0],
//     [1,1,1],
//     [0,1,0],
// ]

export function erosionFunction({currentPixel,context,getMiddleMask,getMiddleMaskInto,imagePositionX,imagePositionY,mask}) {
            
    let allfill = true
    if(currentPixel.data[0] === 255){
        for(let i=0; i< mask.length;i++){
            for(let j=0; j < mask[i].length;j++){
                const newX =i-getMiddleMask.position
                const newY = j-getMiddleMaskInto.position
                const currentPixelLeftCenter =(newX+imagePositionX < 0 || newY+imagePositionY < 0 || newY+ imagePositionY > context.height || newX+imagePositionX > context.width) ? {data:[255]}:context.getImageData(imagePositionX+newX, imagePositionY+newY, 1, 1);
                if(currentPixelLeftCenter.data[0] === 0 && mask[i][j] ===1){
                    allfill = false
                }
            }
        }
    }else{
        allfill = false
    }

    return allfill
}

export function erosion({width,height,canvas}){
    const canvas3 = document.createElement("canvas")
    const context = canvas3.getContext("2d")
    const currentPixel = canvas.getImageData(0, 0, width, height);

    context.putImageData(currentPixel,0,0)
    mappingImagePixelsAndFillPixel({width,height,context,canvas,callback:erosionFunction,mask:MASK})
}