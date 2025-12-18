import { form, initFormEffects, resetFormEffects, destroyFormEffects } from './effects.js';
import { sendDataToServer } from './api.js';

const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;
const MAX_DESCRIPTION_LENGTH = 140;

const body = document.body;

const uploadInput = form.querySelector('#upload-file');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const submitButton = form.querySelector('.img-upload__submit');
const hashtagsInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const isEscKey = (evt) => evt.key === 'Escape';

let errorMessage = '';

function error() {
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
    if (rule.check) {
      errorMessage = rule.error;
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

pristine.addValidator(hashtagsInput, hashtagsHandler, error);
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

const onFormValidate = () => {
  if (pristine.validate()) {
    enableSubmitButton();
  } else {
    disableSubmitButton();
  }
};

hashtagsInput.addEventListener('input', onFormValidate);
descriptionInput.addEventListener('input', onFormValidate);

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
  onFormValidate();
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

const showMessage = (template) => {
  const message = template.cloneNode(true);

  const close = () => {
    message.remove();
    document.removeEventListener('keydown', onEsc);
    document.removeEventListener('click', onClickOutside);
  };

  function onEsc(evt) {
    if (isEscKey(evt)) {
      close();
    }
  }

  function onClickOutside(evt) {
    if (!evt.target.closest('.success__inner, .error__inner')) {
      close();
    }
  }

  message.querySelector('button').addEventListener('click', close);
  document.addEventListener('keydown', onEsc);
  document.addEventListener('click', onClickOutside);

  body.appendChild(message);
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
      showMessage(successTemplate);
    },
    () => {
      unblockSubmit();
      showMessage(errorTemplate);
    },
    new FormData(form)
  );
});


uploadInput.addEventListener('change', openForm);
cancelButton.addEventListener('click', closeForm);

disableSubmitButton();

export { closeForm };
