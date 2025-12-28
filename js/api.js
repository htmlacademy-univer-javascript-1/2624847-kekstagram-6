const Urls = {
  GET: 'https://29.javascript.htmlacademy.pro/kekstagram/data',
  POST: 'https://29.javascript.htmlacademy.pro/kekstagram',
};

const getDataFromServer = (onSuccess, onError) => {
  fetch(Urls.GET)
    .then((response) => response.json())
    .then((photos) => onSuccess(photos))
    .catch(() => onError('При загрузке данных с сервера произошла ошибка'));
};

const sendDataToServer = (onSuccess, onError, body) => {
  fetch(Urls.POST,
    {
      method: 'POST',
      body,
    }
  ).then((response) => {
    if (response.ok) {
      onSuccess();
    } else {
      onError('Не удалось опубликовать');
    }
  })
    .catch(() => onError('Не удалось опубликовать'));
};

export { getDataFromServer, sendDataToServer };
