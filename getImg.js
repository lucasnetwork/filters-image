const inputfiles = document.getElementById ("input-files")
inputfiles.addEventListener("change",function(a){
    console.log(a.target.files[0].name);
    const getFile = a.target.files[0];
    const urlFiles = URL.createObjectURL(getFile);
    console.log(urlFiles);
}) 