export function extracao({src, dst}){
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);

        cv.Canny(src, dst, 50, 100, 3, false);
}