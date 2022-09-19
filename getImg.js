
const inputfiles = document.getElementById ("input-files")


const addImageInCanvasObject={
    "image/tiff":  ({url}) =>{
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'arraybuffer';
      xhr.open('GET', url);
      xhr.onload = function (e) {
        var tiff = new Tiff({buffer: xhr.response});
        width = tiff.width();
        height = tiff.height();
        var canvasTif = tiff.toCanvas();
        if (canvasTif) {
          const contextTiff = canvasTif.getContext("2d");
          var canvasColor = contextTiff.getImageData(0, 0,width,height);
          canvas.width = width
          canvas.height = height
          context.putImageData(canvasColor, 0, 0);
  
        }
      };
      xhr.send();}
  }
  
  function addImageInCanvas({url,type}){
    const existFunction = addImageInCanvasObject[type]
    if(existFunction){
      existFunction({url})
      return
    }
  
    const imageObj = new Image();
    imageObj.onload = function () {
      canvas.width = imageObj.width
      canvas.height = imageObj.height
      width = imageObj.width
      height = imageObj.height
      context.drawImage(imageObj, 0, 0);
      getDataImage()
    };
    imageObj.src = url;
    
  }  

inputfiles.addEventListener("change",function(a){
    console.log(a.target.files[0].name);
    const getFile = a.target.files[0];
    const urlFiles = URL.createObjectURL(getFile);
    addImageInCanvas({url:urlFiles,type:getFile.type})
}) 