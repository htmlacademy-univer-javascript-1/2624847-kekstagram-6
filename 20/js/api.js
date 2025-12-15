const Urls = {
  GET: 'https://29.javascript.htmlacademy.pro/kekstagram/data',
  POST: 'https://29.javascript.htmlacademy.pro/kekstagram',
};

const sendRequest = (onSuccess, onError, method, body) => {
  fetch(Urls[method],
    {
      method: method,
      body: body,
    },
  )
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    })
    .catch((err) => {
      onError(err);
    });
};

const getDataFromServer = (onSuccess, onError) => {
  sendRequest(onSuccess, onError, 'GET');
};

const sendDataToServer  = (onSuccess, onError, body) => {
  sendRequest(onSuccess, onError, 'POST', body);
};

export { getDataFromServer, sendDataToServer };
