const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;

const formUpload = document.querySelector('.img-upload__form');
const uploadInput = document.querySelector('#upload-file');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('.img-upload__cancel');
const body = document.body;

const pristine = new Pristine(formUpload, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper-valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error',
});

const inputHashtag = formUpload.querySelector('.text__hashtags');
const submitButton = formUpload.querySelector('#upload-submit');
let errorMessage = '';

const error = () => errorMessage;
const hashtagsHandler = (value) => {
  errorMessage = '';
  const inputText = value.toLowerCase().trim();

  if(!inputText) {
    return true;
  }

  const inputArray = inputText.split(/\s+/);

  const rules = [
    {
      check: inputArray.some((item) => item.indexOf('#', 1) >= 1),
      error: 'Хэш-теги разделяются пробелами',
    },
    {
      check: inputArray.some((item) => item[0] !== '#'),
      error: 'Хэш-тег должен начинаться с "#"',
    },
    {
      check: inputArray.some((item, num, arr) => arr.includes(item, num + 1)),
      error: 'Хэш-теги не должны повторяться',
    },
    {
      check: inputArray.some((item) => item.length > MAX_SYMBOLS),
      error: `Максимальная длина одного хэш-тега ${MAX_SYMBOLS} символов, включая решётку`,
    },
    {
      check: inputArray.some((item) => item.indexOf('#', 1) >= 1),
      error: `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`,
    },
    {
      check: inputArray.some((item) => !/^#[A-Za-zА-Яа-я0-9]{0,19}$/.test(item)),
      error: 'Хэш-тег содержит недопустимые символы',
    },
    {
      check: inputArray.some((item) => item === '#'),
      error: 'Хэш-тег не может стоять только из решетки',
    }
  ];

  return rules.every((rule) => {
    const isInvalid = rule.check;
    if (isInvalid) {
      errorMessage = rule.error;
    }
    return !isInvalid;
  });
};

pristine.addValidator(inputHashtag, hashtagsHandler, error, 2, false);

const toggleSubmitButton = (isValid) => {
  submitButton.disabled = !isValid;
  if (isValid) {
    submitButton.style.opacity = '1';
  } else {
    submitButton.style.opacity = '0.5';
  }
};

const closeForm = () => {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  formUpload.reset();
  pristine.reset();
  toggleSubmitButton(false);
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    if (document.activeElement === inputHashtag) {
      return;
    }
    evt.preventDefault();
    closeForm();
  }
}

const openForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  const isValid = pristine.validate();
  toggleSubmitButton(isValid);
};

const onHashTagInput = () => {
  const isValid = pristine.validate();
  toggleSubmitButton(isValid);
};

const onUploadInputChange = () => {
  openForm();
};

const onUploadCancelClick = () => {
  closeForm();
};

const initForm = () => {
  uploadInput.addEventListener('change', onUploadInputChange);
  uploadCancel.addEventListener('click', onUploadCancelClick);
  inputHashtag.addEventListener('input', onHashTagInput);

  toggleSubmitButton(false);
};

export { initForm };
