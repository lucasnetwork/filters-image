const inputfiles = document.getElementById("input-files");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const context2 = canvas2.getContext("2d");
let width = canvas.width;
let height = canvas.height;

const addImageInCanvasObject = {
  "image/tiff": ({ url }) => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "arraybuffer";
    xhr.open("GET", url);
    xhr.onload = function (e) {
      var tiff = new Tiff({ buffer: xhr.response });
      width = tiff.width();
      height = tiff.height();
      var canvasTif = tiff.toCanvas();
      if (canvasTif) {
        const contextTiff = canvasTif.getContext("2d");
        var canvasColor = contextTiff.getImageData(0, 0, width, height);
        canvas.width = width;
        canvas.height = height;
        canvas2.width = width;
        canvas2.height = height;
        context.putImageData(canvasColor, 0, 0);
      }
    };
    xhr.send();
  },
  __default__: ({ url }) => {
    const imageObj = new Image();
    imageObj.onload = function () {
      canvas.width = imageObj.width;
      canvas.height = imageObj.height;
      width = imageObj.width;
      height = imageObj.height;
      canvas2.width = width;
      canvas2.height = height;
      context.drawImage(imageObj, 0, 0);
    };
    imageObj.src = url;
  },
};

function addImageInCanvas({ url, type }) {
  const existFunction = addImageInCanvasObject[type] ?? addImageInCanvasObject.__default__;
  existFunction({ url });
}

inputfiles.addEventListener("change", function (a) {
  const getFile = a.target.files[0];
  const urlFiles = URL.createObjectURL(getFile);
  addImageInCanvas({ url: urlFiles, type: getFile.type });
});
