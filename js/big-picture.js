const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

let currentComments = [];
let commentsShown = 0;

const COMMENTS_PER_PORTION = 5;

function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;

  return commentElement;
}

function renderCommentsPortion() {
  const commentsToShow = currentComments.slice(
    commentsShown,
    commentsShown + COMMENTS_PER_PORTION
  );

  commentsToShow.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    socialComments.appendChild(commentElement);
  });

  commentsShown += commentsToShow.length;
  const commentsCountElement = commentCountBlock.querySelector('.comments-count');
  commentsCountElement.textContent = currentComments.length;
  const shownCommentsElement = commentCountBlock.querySelector('.social__comment-shown-count');
  if (!shownCommentsElement) {
    const commentCountText = document.createElement('span');
    commentCountText.classList.add('social__comment-shown-count');
    commentCountText.textContent = commentsShown;
    commentCountBlock.innerHTML = '';
    commentCountBlock.appendChild(commentCountText);
    commentCountBlock.appendChild(document.createTextNode(' из '));
    commentCountBlock.appendChild(commentsCountElement.cloneNode(true));
    commentCountBlock.appendChild(document.createTextNode(' комментариев'));
  } else {
    shownCommentsElement.textContent = commentsShown;
  }
  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
}

function resetComments() {
  currentComments = [];
  commentsShown = 0;
  socialComments.innerHTML = '';
}

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
}

function openBigPicture(photoData) {
  resetComments();

  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  socialCaption.textContent = photoData.description;

  currentComments = photoData.comments;

  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderCommentsPortion();

  bigPicture.classList.remove('hidden');

  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetComments();
  document.removeEventListener('keydown', onDocumentKeydown);
}

function onCommentsLoaderClick() {
  renderCommentsPortion();
}

function onCloseButtonClick() {
  closeBigPicture();
}

closeButton.addEventListener('click', onCloseButtonClick);
commentsLoader.addEventListener('click', onCommentsLoaderClick);

export { openBigPicture };
