import {getRandomArrayElement} from './util.js';

const PHOTO_COUNT = 25;
const MAX_COMMENT = 30;

const NAMES = [
  'Юля',
  'Артём',
  'Вадим',
  'Эльвира',
  'Алмаз',
  'Регина',
  'Вероника',
  'Леша',
  'Римма',
  'Ринат',
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const DESCRIPTIONS = [
  'Я счастлива!',
  'Замечательный день!',
  'После работы...',
  'Один из лучших дней в жизни',
  'Самый вкусный кофе тут',
  'Как же быстро летит время...',
  'Мой лучший кадр!',
  'Запомню этот день навсегда!',
];

const Likes = {
  MIN: 15,
  MAX: 200,
};

const generateUniqId = (count) => {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(getRandomInteger(1, 1000));
  }
  return Array.from(ids);
};

const createComment = (count) => {
  const commentIds = generateUniqId(count);
  const comments = [];

  for (let j = 0; j < count; j++) {
    const messageCount = getRandomInteger(1, 2);
    const messages = [];

    for (let i = 0; i < messageCount; i++) {
      messages.push(getRandomArrayElement(MESSAGES));
    }

    comments.push({
      id: commentIds[j],
      avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
      message: messages.join(' '),
      name: getRandomArrayElement(NAMES)
    });
  }

  return comments;
};

const createPhoto = () => {
  const photos = [];

  for (let i = 1; i <= PHOTO_COUNT; i++) {
    const commentsCount = getRandomInteger(0, MAX_COMMENT);

    photos.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: getRandomArrayElement(DESCRIPTIONS),
      likes: getRandomInteger(Likes.MIN, Likes.MAX),
      comments: createComment(commentsCount)
    });
  }

  return photos;
};

const photo = createPhoto();
export { photo };
