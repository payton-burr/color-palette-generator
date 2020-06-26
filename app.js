// Global selections
const colorPalettes = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type = "range"]');
const currentHex = document.querySelectorAll('.color h2');
let intialColors;

// Functions

function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

let randomHex = generateHex();
// console.log(randomHex);

function randomColors() {
  colorPalettes.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    checkContrast(randomColor, hexText);
  });
}

function checkContrast(color, text) {
  const luminance = chroma(color).luminance();

  if (luminance > 0.5) {
    text.style.color = '#000000';
  } else {
    text.style.color = '#ffffff';
  }
}

randomColors();
