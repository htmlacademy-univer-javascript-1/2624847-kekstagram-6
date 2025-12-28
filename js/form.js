import { form, initFormEffects, resetFormEffects, destroyFormEffects } from './effects.js';
import { sendDataToServer } from './api.js';
import { isEscKey } from './util.js';

const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;
const MAX_DESCRIPTION_LENGTH = 140;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const body = document.body;

const uploadInput = form.querySelector('#upload-file');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const submitButton = form.querySelector('.img-upload__submit');
const hashtagsInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

let errorMessage = '';

function getError() {
  return errorMessage;
}

function hashtagsHandler(value) {
  errorMessage = '';
  const inputText = value.toLowerCase().trim();

  if (!inputText) {
    return true;
  }

  const inputArray = inputText.split(/\s+/);

  const rules = [
    {
      check: inputArray.some((item) => item.indexOf('#', 1) >= 1),
      getError: 'Хэш-теги разделяются пробелами',
    },
    {
      check: inputArray.some((item) => item[0] !== '#'),
      getError: 'Хэш-тег должен начинаться с "#"',
    },
    {
      check: inputArray.some((item, num, arr) => arr.includes(item, num + 1)),
      getError: 'Хэш-теги не должны повторяться',
    },
    {
      check: inputArray.some((item) => item.length > MAX_SYMBOLS),
      getError: `Максимальная длина одного хэш-тега ${MAX_SYMBOLS} символов, включая решётку`,
    },
    {
      check: inputArray.some((item) => item.indexOf('#', 1) >= 1),
      getError: `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`,
    },
    {
      check: inputArray.some((item) => !/^#[A-Za-zА-Яа-я0-9]{0,19}$/.test(item)),
      getError: 'Хэш-тег содержит недопустимые символы',
    },
    {
      check: inputArray.some((item) => item === '#'),
      getError: 'Хэш-тег не может стоять только из решетки',
    }
  ];

  return rules.every((rule) => {
    if (rule.check) {
      errorMessage = rule.getError;
      return false;
    }
    return true;
  });
}

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error',
});

pristine.addValidator(hashtagsInput, hashtagsHandler, getError);
pristine.addValidator(
  descriptionInput,
  (value) => value.length <= MAX_DESCRIPTION_LENGTH,
  `Комментарий не может быть длиннее ${MAX_DESCRIPTION_LENGTH} символов`
);

const disableSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.style.opacity = '0.5';
};

const enableSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.style.opacity = '1';
};

function onHashtagsInput() {
  pristine.validate();
  updateSubmitButton();
}

function onDescriptionInput() {
  pristine.validate();
  updateSubmitButton();
}

function updateSubmitButton() {
  if (pristine.validate()) {
    enableSubmitButton();
  } else {
    disableSubmitButton();
  }
}

hashtagsInput.addEventListener('input', onHashtagsInput);
descriptionInput.addEventListener('input', onDescriptionInput);

const onDocumentKeydown = (evt) => {
  if (
    isEscKey(evt) &&
    document.activeElement !== hashtagsInput &&
    document.activeElement !== descriptionInput
  ) {
    evt.preventDefault();
    closeForm();
  }
};

function openForm() {
  const file = uploadInput.files[0];

  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));
  if (!matches) {
    return;
  }

  const imageURL = URL.createObjectURL(file);

  const previewImage = form.querySelector('.img-upload__preview img');
  previewImage.src = imageURL;

  const effectPreviews = form.querySelectorAll('.effects__preview');
  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${imageURL})`;
  });

  overlay.classList.remove('hidden');
  body.classList.add('modal-open');

  initFormEffects();
  enableSubmitButton();
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeForm() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');

  form.reset();
  pristine.reset();

  resetFormEffects();
  destroyFormEffects();

  disableSubmitButton();
  document.removeEventListener('keydown', onDocumentKeydown);
}

const blockSubmit = () => {submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmit = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
  submitButton.style.opacity = '1';
};

const showSuccessMessage = () => {
  const template = successTemplate;
  const messageElement = template.cloneNode(true);

  document.body.appendChild(messageElement);

  function closeMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onOutsideClick);
  }

  function onEscKeydown(evt) {
    if (isEscKey(evt)) {
      closeMessage();
    }
  }

  function onOutsideClick(evt) {
    if (!evt.target.closest('.success__inner')) {
      closeMessage();
    }
  }

  const closeButton = messageElement.querySelector('.success__button');
  closeButton.addEventListener('click', closeMessage);

  document.addEventListener('keydown', onEscKeydown);
  document.addEventListener('click', onOutsideClick);
};

const showErrorMessage = () => {
  const template = errorTemplate;
  const messageElement = template.cloneNode(true);

  messageElement.style.zIndex = '1000';
  document.body.appendChild(messageElement);

  function closeMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onOutsideClick);
  }

  function onEscKeydown(evt) {
    if (isEscKey(evt)) {
      evt.stopPropagation();
      closeMessage();
    }
  }

  function onOutsideClick(evt) {
    if (!evt.target.closest('.error__inner')) {
      closeMessage();
    }
  }

  const closeButton = messageElement.querySelector('.error__button');
  closeButton.addEventListener('click', closeMessage);

  document.addEventListener('keydown', onEscKeydown);
  document.addEventListener('click', onOutsideClick);

  document.addEventListener('keydown', (evt) => {
    if (isEscKey(evt)) {
      evt.stopPropagation();
    }
  }, { capture: true });
};

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    disableSubmitButton();
    return;
  }

  blockSubmit();

  sendDataToServer(
    () => {
      unblockSubmit();
      closeForm();
      showSuccessMessage();
    },
    () => {
      unblockSubmit();
      showErrorMessage();
    },
    new FormData(form)
  );
});

const onUploadInputChange = () =>{
  openForm();
};

const onCancelButtonClick = () => {
  closeForm();
};

uploadInput.addEventListener('change', onUploadInputChange);
cancelButton.addEventListener('click', onCancelButtonClick);

disableSubmitButton();

export { closeForm };
