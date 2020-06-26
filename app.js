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

    const color = chroma(randomColor);
    const sliders = div.querySelectorAll('.sliders input');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
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

function colorizeSliders(color, hue, brightness, saturation) {
  // Saturation
  const noSat = color.set('hsl.s', 0);
  const maxSat = color.set('hsl.s', 1);
  const scaleSaturation = chroma.scale([noSat, color, maxSat]);
  // Brightness
  const defaultBrightness = color.set('hsl.l', 0.5);
  const scaleBrightness = chroma.scale(['black', defaultBrightness, 'white']);

  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(0)},
                                                                ${scaleBrightness(0.5)},
                                                                ${scaleBrightness(1)})`;

  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturation(0)}, ${scaleSaturation(1)})`;

  hue.style.backgroundImage = `linear-gradient(to right, rgb(255, 0, 0),
                                                         rgb(255,255 ,0),
                                                         rgb(0, 255, 0),
                                                         rgb(0, 255, 255),
                                                         rgb(0,0,255),
                                                         rgb(255,0,255),
                                                         rgb(255,0,0))`;
}

randomColors();
