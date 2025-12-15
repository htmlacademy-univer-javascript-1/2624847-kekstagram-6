import { renderThumbnails } from './thumbnail.js';
import { openBigPicture } from './big-picture.js';
import { getDataFromServer } from './api.js';
import './hashtags-pristine.js';

getDataFromServer(
  (photos) => {
    renderThumbnails(photos, openBigPicture);
  },
  () => {
    alert('Не удалось загрузить данные');
  }
);

initForm();
