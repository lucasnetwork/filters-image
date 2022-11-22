import { mappingImagePixelsAndFillPixel } from "../../utils/mappingImagePixelsAndFillPixel.js";
import { dilation } from "./dilation.js";
import { erosion } from "./erosion.js";

const MASK =[
    [1,1,1],
    [1,1,1],
    [1,1,1]
]

export function closing({width,height,canvas}){
    dilation({width,height,canvas,mask:MASK})
    erosion({width,height,canvas,mask:MASK})
}