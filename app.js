//!! Global selections
const colorPalettes = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type = "range"]');
const currentHex = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
const lockButton = document.querySelectorAll('.lock');
const adjustButton = document.querySelectorAll('.adjust');
const closeAdjustment = document.querySelectorAll('.close-adjustment');
const sliderContainer = document.querySelectorAll('.sliders');
let initialColors;

//!! Local Storage

let savedPalettes = [];

//!! Event Listeners

sliders.forEach((slider) => {
  slider.addEventListener('input', hslControls);
});

colorPalettes.forEach((div, index) => {
  div.addEventListener('change', () => {
    updateText(index);
  });
});

currentHex.forEach((hex) => {
  hex.addEventListener('click', () => {
    copyToClipboard(hex);
  });
});

popup.addEventListener('transitionend', () => {
  const popupBox = popup.children[0];
  popup.classList.remove('active');
  popupBox.classList.remove('active');
});

adjustButton.forEach((buttton, index) => {
  buttton.addEventListener('click', () => {
    openAdjustmentPanel(index);
  });
});

closeAdjustment.forEach((button, index) => {
  button.addEventListener('click', () => {
    closeAdjustmentPanel(index);
  });
});

lockButton.forEach((button, index) => {
  button.addEventListener('click', () => {
    lockControl(index);
  });
});

generateBtn.addEventListener('click', randomColors);

//!! Functions

function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

let randomHex = generateHex();
// console.log(randomHex);

function randomColors() {
  initialColors = [];

  colorPalettes.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    if (div.classList.contains('locked')) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomColor).hex());
    }

    // Set color palette background to random color
    // Make hex text values equal to random color
    // Check contrast of text and icons compared to random color

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

  resetInputs();

  // Check icon contrast
  adjustButton.forEach((button, index) => {
    checkContrast(initialColors[index], button);
    checkContrast(initialColors[index], lockButton[index]);
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

  const bgColor = initialColors[index];

  let color = chroma(bgColor).set('hsl.s', saturation.value).set('hsl.l', brightness.value).set('hsl.h', hue.value);

  colorPalettes[index].style.backgroundColor = color;

  // Update saturation/brightness slider colors

  colorizeSliders(color, hue, brightness, saturation);
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

function resetInputs() {
  const sliders = document.querySelectorAll('.sliders input');

  sliders.forEach((slider) => {
    if (slider.name === 'hue') {
      const hueColor = initialColors[slider.getAttribute('data-hue')];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }

    if (slider.name === 'brightness') {
      const brightColor = initialColors[slider.getAttribute('data-bright')];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }

    if (slider.name === 'saturation') {
      const satColor = initialColors[slider.getAttribute('data-sat')];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

function copyToClipboard(hex) {
  const element = document.createElement('textarea');
  element.value = hex.innerText;
  document.body.appendChild(element);
  element.select();
  document.execCommand('copy');
  document.body.removeChild(element);

  // Pop up animation

  const popupBox = popup.children[0];
  popup.classList.add('active');
  popupBox.classList.add('active');
}

function openAdjustmentPanel(index) {
  sliderContainer[index].classList.toggle('active');
}

function closeAdjustmentPanel(index) {
  sliderContainer[index].classList.remove('active');
}

function lockControl(index) {
  colorPalettes[index].classList.toggle('locked');
  lockButton[index].children[0].classList.toggle('fa-lock-open');
  lockButton[index].children[0].classList.toggle('fa-lock');
}

// **************************************************************
//!! Save to palette and Local Storage

const saveBtn = document.querySelector('.save');
const submitSave = document.querySelector('.save-submit');
const closeSave = document.querySelector('.close-save');
const saveContainer = document.querySelector('.save-container');
const saveInput = document.querySelector('.save-container input');
const libraryContainer = document.querySelector('.library-container');
const libraryBtn = document.querySelector('.library');
const closeLibrary = document.querySelector('.close-library');

//!! Event listeners

saveBtn.addEventListener('click', openPalette);
closeSave.addEventListener('click', closePalette);
submitSave.addEventListener('click', savePalette);
libraryBtn.addEventListener('click', openLibraryMenu);
closeLibrary.addEventListener('click', closeLibraryMenu);

//!! Functions

function openPalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add('active');
  popup.classList.add('active');
}

function closePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove('active');
  popup.classList.remove('active');
}

function savePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove('active');
  popup.classList.remove('active');
  const name = saveInput.value;
  const colors = [];
  currentHex.forEach((hex) => {
    colors.push(hex.innerText);
  });
  // Generate object

  let paletteNum = savedPalettes.length;
  const paletteObject = { name, colors, num: paletteNum };

  savedPalettes.push(paletteObject);
  console.log(savedPalettes);

  // Save to local storage

  saveToLocal(paletteObject);
  saveInput.value = '';

  // Generate palette for library

  const palette = document.createElement('div');
  palette.classList.add('custom-palette');

  const title = document.createElement('h4');
  title.innerText = paletteObject.name;

  const preview = document.createElement('div');
  preview.classList.add('small-preview');
  paletteObject.colors.forEach((color) => {
    const smallDiv = document.createElement('div');
    smallDiv.style.backgroundColor = color;
    preview.appendChild(smallDiv);
  });

  const paletteBtn = document.createElement('button');
  paletteBtn.classList.add('pick-palette-btn');
  paletteBtn.classList.add(paletteObject.num);
  paletteBtn.innerText = 'Select';

  // Attach event to button

  paletteBtn.addEventListener('click', (e) => {
    closeLibraryMenu();

    const paletteIndex = e.target.classList[1];

    initialColors = [];
    savedPalettes[paletteIndex].colors.forEach((color, index) => {
      initialColors.push(color);
      colorPalettes[index].style.backgroundColor = color;
      const text = colorPalettes[index].children[0];
      checkContrast(color, text);
      updateText(index);
    });

    resetInputs();
  });

  // Append to library

  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);

  libraryContainer.children[0].appendChild(palette);
}

function saveToLocal(paletteObject) {
  let localPalettes;

  if (localStorage.getItem('palettes') === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem('palettes'));
  }

  localPalettes.push(paletteObject);
  localStorage.setItem('palettes', JSON.stringify(localPalettes));
}

function openLibraryMenu() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add('active');
  popup.classList.add('active');
}

function closeLibraryMenu() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove('active');
  popup.classList.remove('active');
}

function getLocal() {
  if (localStorage.getItem('palettes') === null) {
    localStorage = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem('palettes'));
    paletteObjects.forEach((paletteObject) => {
      const palette = document.createElement('div');
      palette.classList.add('custom-palette');

      const title = document.createElement('h4');
      title.innerText = paletteObject.name;

      const preview = document.createElement('div');
      preview.classList.add('small-preview');
      paletteObject.colors.forEach((color) => {
        const smallDiv = document.createElement('div');
        smallDiv.style.backgroundColor = color;
        preview.appendChild(smallDiv);
      });

      const paletteBtn = document.createElement('button');
      paletteBtn.classList.add('pick-palette-btn');
      paletteBtn.classList.add(paletteObject.num);
      paletteBtn.innerText = 'Select';

      // Attach event to button

      paletteBtn.addEventListener('click', (e) => {
        closeLibraryMenu();

        const paletteIndex = e.target.classList[1];

        initialColors = [];
        paletteObjects[paletteIndex].colors.forEach((color, index) => {
          initialColors.push(color);
          colorPalettes[index].style.backgroundColor = color;
          const text = colorPalettes[index].children[0];
          checkContrast(color, text);
          updateText(index);
        });

        resetInputs();
      });

      // Append to library

      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteBtn);

      libraryContainer.children[0].appendChild(palette);
    });
  }
}

getLocal();
randomColors();
