import {getRandomArrayElement, getRandomInteger} from './util.js';

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

function generateUniqId () {
  let lastId = 0;
  return function () {
    lastId += 1;
    return lastId;
  };
}

const generatePhotoId = generateUniqId();
const generateCommentId = generateUniqId();

const generateComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

const generateComments = () => Array.from({length: getRandomInteger(0, MAX_COMMENT)}, generateComment);

const generatePhoto = () => {
  const id = generatePhotoId();
  return {
    id: id,
    url: `photos/${id}.jpg`,
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: getRandomInteger(Likes.MIN, Likes.MAX),
    comments: generateComments()
  };
};


const generatePhotosArray = () => Array.from({length: PHOTO_COUNT}, generatePhoto);
export { generatePhotosArray };
