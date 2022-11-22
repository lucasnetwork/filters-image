// import { MASK } from "../../constants/masks.js";
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

// const MASK = [
//     [0,0,1,0,0],
//     [0,1,1,1,0],
//     [1,1,1,1,1],
//     [0,1,1,1,0],
//     [0,0,1,0,0],
// ]

// const MASK = [
//     [1,1,1,1,1],
//     [1,1,1,1,1],
//     [1,1,1,1,1],
//     [1,1,1,1,1],
//     [1,1,1,1,1],
// ]

// const MASK = [
//     [0,1,0],
//     [1,1,1],
//     [0,1,0],
// ]

// const MASK = [
//     [0,1,0],
//     [1,1,1],
//     [0,1,0],
// ]

const MASK = [
    [-1,-1,-1],
    [-1,8,-1],
    [-1,-1,-1]
]

const MASK_SOBEL_X = [
    [-1,-2,-1],
    [0,0,0],
    [1,2,1]
]

const MASK_SOBEL_Y = [
    [-1,0,1],
    [-2,0,2],
    [-1,0,1]
]


const MASK_ROBERT_X = [
    [1,0],
    [0,-1],
]

const MASK_ROBERT_Y = [
    [0,1],
    [-1,0],
]

const MASK_PREWITT_X = [
    [-1,-1,-1],
    [0,0,0],
    [1,1,1]
]

const MASK_PREWITT_Y = [
    [-1,0,1],
    [-1,0,1],
    [-1,0,1]
]



export function detectionBordersFunctionLaplacian({currentPixel,context,getMiddleMask,getMiddleMaskInto,imagePositionX,imagePositionY,mask,width,height,absolutePixel}) {
            
    let value = 0
    for(let i=0; i< mask.length;i++){
        for(let j=0; j < mask[i].length;j++){
            const newX =i-getMiddleMask.position
            const newY = j-getMiddleMaskInto.position
            const currentPixelLeftCenter =(newX+imagePositionX < 0 || newY+imagePositionY < 0 || newY+ imagePositionY > height || newX+imagePositionX > width) ? {data:[255]}:context.getImageData(imagePositionX+newX, imagePositionY+newY, 1, 1);
            value += currentPixelLeftCenter.data[0]*mask[i][j]
        }
    }
    if(Math.abs(value) >= absolutePixel){
       return  true
    }
    return false
}

export function detectionBordersFunctionRobert({currentPixel,context,getMiddleMask,getMiddleMaskInto,imagePositionX,imagePositionY,mask,width,height,absolutePixel}) {
            
    let valueX = 0
    let valueY = 0
    for(let i=0; i< MASK_PREWITT_X.length;i++){
        for(let j=0; j < MASK_PREWITT_X[i].length;j++){
            const newX =i-getMiddleMask.position
            const newY = j-getMiddleMaskInto.position
            const currentPixelLeftCenter =(newX+imagePositionX < 0 || newY+imagePositionY < 0 || newY+ imagePositionY > height || newX+imagePositionX > width) ? {data:[255]}:context.getImageData(imagePositionX+newX, imagePositionY+newY, 1, 1);
            valueX += currentPixelLeftCenter.data[0]*MASK_PREWITT_X[i][j]
            valueY += currentPixelLeftCenter.data[0]*MASK_PREWITT_Y[i][j]
        }
    }
    const value =Math.sqrt(Math.pow(valueX,2)+Math.pow(valueY,2))
    return `rgba(${value},${value},${value},255)`
}

export function detectionBorders({width,height,canvas,mask=MASK,data}){
    const canvas3 = document.createElement("canvas")
    canvas3.width = width;
    canvas3.height = height;
    const context = canvas3.getContext("2d", { willReadFrequently: true })
    const currentPixel = canvas.getImageData(0, 0, width, height);
    let absolutePixel = 40
      for(let i=0;i < currentPixel.data.length;i+=4){
        if(currentPixel.data[i] > absolutePixel){
            absolutePixel = currentPixel.data[i]
        }
    }
    context.putImageData(currentPixel,0,0)
    // mappingImagePixelsAndFillPixel({width,height,context,canvas,callback:detectionBordersFunctionRobert,mask,absolutePixel})
    mappingImagePixelsAndFillPixel({width,height,context,canvas,callback:detectionBordersFunctionRobert,mask,absolutePixel})


}