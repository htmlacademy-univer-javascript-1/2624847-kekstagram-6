import './hashtags-pristine.js';
import { renderThumbnails } from './thumbnail.js';
import { openBigPicture } from './big-picture.js';
import { getDataFromServer } from './api.js';

const onSuccessLoad = (photos) => {
  renderThumbnails(photos);

  const thumbnails = document.querySelectorAll('.picture');
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      openBigPicture(photos[index]);
    });
  });
};

const onErrorLoad = () => {
  const errorBlock = document.createElement('div');
  errorBlock.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 15px;
    background: red;
    color: white;
    text-align: center;
    z-index: 1000;
  `;
  errorBlock.textContent = 'Ошибка загрузки данных';
  document.body.appendChild(errorBlock);
};

getDataFromServer(onSuccessLoad, onErrorLoad);
