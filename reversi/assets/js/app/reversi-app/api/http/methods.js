export const SERVER_CONNECTION_ERROR = 'サーバとの通信に失敗しました。';

class ServerConnectionError {
  constructor(response) {
    this.message = SERVER_CONNECTION_ERROR;
    this.response = response;
  }
}

export async function get(url) {
  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new ServerConnectionError(response);
  });
}

export async function post(url, sendData = {}) {
  // get csrfToken from input element in body
  const csrfToken = document.getElementsByName('csrfmiddlewaretoken').item(0)
    .value;
  const data = new FormData();
  Object.keys(sendData).forEach(field => {
    data.append(field, sendData[field]);
  });
  data.append('csrfmiddlewaretoken', csrfToken);
  return fetch(url, {
    method: 'POST',
    body: data,
    credentials: 'same-origin'
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new ServerConnectionError(response);
  });
}
