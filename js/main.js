import {renderThumbnails} from './thumbnail.js';
import {generatePhotosArray} from './data.js';
import { openBigPicture } from './big-picture.js';
import { initForm } from './hashtags-pristine.js';

const photos = generatePhotosArray();
renderThumbnails(photos);

const addThumbnailClickHandlers = () => {
  const thumbnails = document.querySelectorAll('.picture');
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      openBigPicture(photos[index]);
    });
  });
};

addThumbnailClickHandlers();
initForm();
