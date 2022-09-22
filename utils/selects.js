import options from "../data/options.json" assert { type: "json" };
import { getDataImage } from "../main.js";

const optionsSelect = document.getElementById("filtro");
const button = document.getElementById("btnProcessar");
options.forEach((option) => {
  const optionElement = document.createElement("option");
  optionElement.value = JSON.stringify(option);
  optionElement.innerText = option.name;
  optionsSelect.appendChild(optionElement);
});

button.addEventListener("click", () => {
  const option = JSON.parse(optionsSelect.value);
  console.log(option.value);
  getDataImage(option.value);
});
