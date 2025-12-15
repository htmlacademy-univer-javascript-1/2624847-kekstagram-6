import { renderThumbnails } from './thumbnail.js';
import { openBigPicture } from './big-picture.js';
import { getDataFromServer } from './api.js';
import './hashtags-pristine.js';

const onSuccessLoad = (photos) => {
  renderThumbnails(photos);
  addThumbnailClickHandlers(photos);
};

const onErrorLoad = () => {
  const errorBlock = document.createElement('div');
  errorBlock.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 15px;
    text-align: center;
    background-color: #ff4d4d;
    color: white;
    font-size: 16px;
    z-index: 1000;
  `;
  errorBlock.textContent = 'Не удалось загрузить данные с сервера 😢';
  document.body.appendChild(errorBlock);
};

const addThumbnailClickHandlers = (photos) => {
  const thumbnails = document.querySelectorAll('.picture');

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      openBigPicture(photos[index]);
    });
  });
};


getDataFromServer(
  (photos) => {
    renderThumbnails(photos, openBigPicture);
  },
  () => {
    alert('Не удалось загрузить данные');
  }
);

initForm();

getDataFromServer(onSuccessLoad, onErrorLoad);
