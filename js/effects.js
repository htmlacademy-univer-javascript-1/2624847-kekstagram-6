const MAX_SCALE = 100;
const MIN_SCALE = 25;
const STEP_SCALE = 25;
const DEFAULT_SCALE = 100;

const scaleInput = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const imagePreview = document.querySelector('.img-upload__preview img');

let currentScale = DEFAULT_SCALE;

const updateScale = (value) => {
  currentScale = value;
  scaleInput.value = `${value}%`;
  imagePreview.style.transform = `scale(${value / 100})`;
};

const onScaleSmaller = () => {
  const newValue = Math.max(currentScale - STEP_SCALE, MIN_SCALE);
  updateScale(newValue);
};

const onScaleBigger = () => {
  const newValue = Math.min(currentScale + STEP_SCALE, MAX_SCALE);
  updateScale(newValue);
};

const resetScale = () => {
  updateScale(DEFAULT_SCALE);
};

const effectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectsList = document.querySelector('.effects__list');

const Effects = {
  none: { min: 0, max: 100, step: 1, filter: '', unit: '' },
  chrome: { min: 0, max: 1, step: 0.1, filter: 'grayscale', unit: '' },
  sepia: { min: 0, max: 1, step: 0.1, filter: 'sepia', unit: '' },
  marvin: { min: 0, max: 100, step: 1, filter: 'invert', unit: '%' },
  phobos: { min: 0, max: 3, step: 0.1, filter: 'blur', unit: 'px' },
  heat: { min: 1, max: 3, step: 0.1, filter: 'brightness', unit: '' }
};

let currentEffect = 'none';

const createSlider = () => {
  noUiSlider.create(effectLevelSlider, {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    connect: 'lower'
  });
};

const updateSlider = (effect) => {
  const { min, max, step } = Effects[effect];
  effectLevelSlider.noUiSlider.updateOptions({
    range: { min, max },
    start: max,
    step
  });
};

const applyEffect = (effect, value) => {
  const { filter, unit } = Effects[effect];

  if (effect === 'none') {
    imagePreview.style.filter = 'none';
    effectLevel.classList.add('hidden');
  } else {
    imagePreview.style.filter = `${filter}(${value}${unit})`;
    effectLevel.classList.remove('hidden');
  }

  effectLevelValue.value = value;
};

const onSliderUpdate = () => {
  const value = effectLevelSlider.noUiSlider.get();
  applyEffect(currentEffect, value);
};

const onEffectChange = (evt) => {
  if (evt.target.classList.contains('effects__radio')) {
    currentEffect = evt.target.value;
    updateSlider(currentEffect);
    applyEffect(currentEffect, Effects[currentEffect].max);
  }
};

const resetEffects = () => {
  currentEffect = 'none';
  const noneRadio = document.querySelector('#effect-none');
  if (noneRadio) {
    noneRadio.checked = true;
  }
  applyEffect('none', 0);
  effectLevel.classList.add('hidden');
};

const initEffects = () => {
  if (!effectLevelSlider.noUiSlider) {
    createSlider();
  }
  effectLevelSlider.noUiSlider.on('update', onSliderUpdate);
  effectsList.addEventListener('change', onEffectChange);
  resetEffects();
};

const destroyEffects = () => {
  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }
  effectsList.removeEventListener('change', onEffectChange);
};

const initFormEffects = () => {
  resetScale();
  scaleSmaller.addEventListener('click', onScaleSmaller);
  scaleBigger.addEventListener('click', onScaleBigger);
  initEffects();
};

const resetFormEffects = () => {
  resetScale();
  resetEffects();
};

const destroyFormEffects = () => {
  scaleSmaller.removeEventListener('click', onScaleSmaller);
  scaleBigger.removeEventListener('click', onScaleBigger);
  destroyEffects();
};

export { initFormEffects, resetFormEffects, destroyFormEffects };
