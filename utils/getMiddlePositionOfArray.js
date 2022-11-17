export function getMiddlePositionOfArray(array,i) {
    if (array[i] !== undefined) {
       return getMiddlePositionOfArray(array,i+1);
    } else {
        const position =Math.floor(i / 2)
       return {value:array[position],position};
   }
}