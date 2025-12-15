const createThumbnailElement = (photo, onClick) => {
  const template = document.querySelector('#picture');
  const thumbnail = template.content.querySelector('.picture').cloneNode(true);

  thumbnail.querySelector('.picture__img').src = photo.url;
  thumbnail.querySelector('.picture__img').alt = photo.description;
  thumbnail.querySelector('.picture__likes').textContent = photo.likes;
  thumbnail.querySelector('.picture__comments').textContent = photo.comments.length;

  thumbnail.addEventListener('click', () => onClick(photo));

  return thumbnail;
};

const renderThumbnails = (photos, onClick) => {
  const container = document.querySelector('.pictures');
  container.querySelectorAll('.picture').forEach((el) => el.remove());

  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    fragment.appendChild(createThumbnailElement(photo, onClick));
  });

  container.appendChild(fragment);
};

export { renderThumbnails };
