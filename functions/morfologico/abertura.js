import { dilation } from "./dilation.js";
import { erosion } from "./erosion.js";

const MASK =[
    [1,1,1],
    [1,1,1],
    [1,1,1]
]

export function abertura({width,height,canvas}){
    erosion({width,height,canvas,mask:MASK})
    dilation({width,height,canvas,mask:MASK})
}