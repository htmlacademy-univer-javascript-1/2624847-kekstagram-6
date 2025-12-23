import './form.js';
import { renderThumbnails } from './thumbnail.js';
import { openBigPicture } from './big-picture.js';
import { getDataFromServer } from './api.js';
import { initFilters } from './filters.js';

let photos = [];

const updatePhotos = (filteredPhotos) => {
  const picturesContainer = document.querySelector('.pictures');
  const oldPictures = picturesContainer.querySelectorAll('.picture');
  oldPictures.forEach((picture) => picture.remove());

  renderThumbnails(filteredPhotos);

  const thumbnails = document.querySelectorAll('.picture');
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      openBigPicture(filteredPhotos[index]);
    });
  });
};

const onSuccessLoad = (loadedPhotos) => {
  photos = loadedPhotos;

  const filteredPhotos = initFilters(photos, updatePhotos);

  updatePhotos(filteredPhotos);
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


