const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const isEscKey = (evt) => evt.key === 'Escape';

export {getRandomInteger, isEscKey};
