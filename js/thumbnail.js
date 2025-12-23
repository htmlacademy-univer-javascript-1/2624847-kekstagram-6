import { openBigPicture } from './big-picture.js';

const createThumbnailElement = (photo) => {
  const template = document.querySelector('#picture').content;
  const thumbnail = template.querySelector('.picture').cloneNode(true);

  const img = thumbnail.querySelector('.picture__img');
  img.src = photo.url;
  img.alt = photo.description;

  thumbnail.querySelector('.picture__likes').textContent = photo.likes;
  thumbnail.querySelector('.picture__comments').textContent = photo.comments.length;

  thumbnail.addEventListener('click', () => {
    openBigPicture(photo);
  });

  return thumbnail;
};

const renderThumbnails = (photos) => {
  const container = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    fragment.appendChild(createThumbnailElement(photo));
  });

  container.appendChild(fragment);
};

export { renderThumbnails };
