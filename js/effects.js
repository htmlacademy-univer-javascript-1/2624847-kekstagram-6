const MAX_SCALE = 100;
const MIN_SCALE = 25;
const STEP_SCALE = 25;
const DEFAULT_SCALE = 100;

const form = document.querySelector('.img-upload__form');

const scaleInput = form.querySelector('.scale__control--value');
const scaleSmaller = form.querySelector('.scale__control--smaller');
const scaleBigger = form.querySelector('.scale__control--bigger');
const imagePreview = form.querySelector('.img-upload__preview img');

let currentScale = DEFAULT_SCALE;

const updateScale = (value) => {
  currentScale = value;
  scaleInput.value = `${value}%`;
  imagePreview.style.transform = `scale(${value / 100})`;
};

const onScaleSmaller = () => {
  updateScale(Math.max(currentScale - STEP_SCALE, MIN_SCALE));
};

const onScaleBigger = () => {
  updateScale(Math.min(currentScale + STEP_SCALE, MAX_SCALE));
};

const resetScale = () => updateScale(DEFAULT_SCALE);

const effectLevel = form.querySelector('.img-upload__effect-level');
const effectLevelValue = form.querySelector('.effect-level__value');
const effectLevelSlider = form.querySelector('.effect-level__slider');
const effectsList = form.querySelector('.effects__list');

const Effects = {
  NONE: { min: 0, max: 100, step: 1, filter: '', unit: '' },
  CHROME: { min: 0, max: 1, step: 0.1, filter: 'grayscale', unit: '' },
  SEPIA: { min: 0, max: 1, step: 0.1, filter: 'sepia', unit: '' },
  MARVIN: { min: 0, max: 100, step: 1, filter: 'invert', unit: '%' },
  PHOBOS: { min: 0, max: 3, step: 0.1, filter: 'blur', unit: 'px' },
  HEAT: { min: 1, max: 3, step: 0.1, filter: 'brightness', unit: '' },
};

let currentEffect = 'NONE';

const createSlider = () => {
  noUiSlider.create(effectLevelSlider, {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    connect: 'lower',
  });
};

const updateSlider = (effect) => {
  const effectConfig = Effects[effect];
  if (!effectConfig) {
    return;
  }

  const { min, max, step } = effectConfig;
  effectLevelSlider.noUiSlider.updateOptions({
    range: { min, max },
    start: max,
    step,
  });
};

const applyEffect = (effect, value) => {
  const effectConfig = Effects[effect];
  if (!effectConfig) {
    return;
  }

  const { filter, unit } = effectConfig;

  if (effect === 'NONE') {
    imagePreview.style.filter = 'none';
    effectLevel.classList.add('hidden');
  } else {
    imagePreview.style.filter = `${filter}(${value}${unit})`;
    effectLevel.classList.remove('hidden');
  }

  effectLevelValue.value = value;
};

const onSliderUpdate = () => {
  applyEffect(currentEffect, Number(effectLevelSlider.noUiSlider.get()));
};

const onEffectChange = (evt) => {
  if (evt.target.classList.contains('effects__radio')) {
    currentEffect = evt.target.value.toUpperCase();
    updateSlider(currentEffect);
    const effectConfig = Effects[currentEffect];
    if (effectConfig) {
      applyEffect(currentEffect, effectConfig.max);
    }
  }
};

const resetEffects = () => {
  currentEffect = 'NONE';
  document.querySelector('#effect-none').checked = true;
  applyEffect('NONE', 0);
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
  effectLevelSlider.noUiSlider.destroy();
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

export { form, initFormEffects, resetFormEffects, destroyFormEffects };
