//!! Global selections
const colorPalettes = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type = "range"]');
const currentHex = document.querySelectorAll('.color h2');
let intialColors;

//!! Event Listeners

sliders.forEach((slider) => {
  slider.addEventListener('input', hslControls);
});

colorPalettes.forEach((div, index) => {
  div.addEventListener('change', () => {
    updateText(index);
  });
});

//!! Functions

function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

let randomHex = generateHex();
// console.log(randomHex);

function randomColors() {
  intialColors = [];

  colorPalettes.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    const icons = colorPalettes[index].querySelectorAll('.controls button');

    intialColors.push(chroma(randomColor).hex());

    // Set color palette background to random color
    // Make hex text values equal to random color
    // Check contrast of text and icons compared to random color

    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    checkContrast(randomColor, hexText);

    checkContrast(randomColor, hexText);
    for (icon of icons) {
      checkContrast(randomColor, icon);
    }

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

function hslControls(e) {
  const index =
    e.target.getAttribute('data-bright') || e.target.getAttribute('data-hue') || e.target.getAttribute('data-sat');

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');

  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = intialColors[index];

  let color = chroma(bgColor).set('hsl.s', saturation.value).set('hsl.l', brightness.value).set('hsl.h', hue.value);

  colorPalettes[index].style.backgroundColor = color;
}

function updateText(index) {
  const activeDiv = colorPalettes[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const hexText = activeDiv.querySelector('h2');
  const icons = activeDiv.querySelectorAll('.controls button');
  hexText.innerText = color.hex();

  checkContrast(color, hexText);
  for (icon of icons) {
    checkContrast(color, icon);
  }
}

randomColors();
