import { eventChannel, END } from 'redux-saga';
import {
  all,
  call,
  fork,
  put,
  take,
  takeEvery,
  cancel,
  select
} from 'redux-saga/effects';
import webSocketMapApi from './mapApi';

function initSocket(ws, registerAction) {
  return eventChannel(emitter => {
    const wsUrl = ws.url;
    ws.onopen = () => {
      console.log('Opening Websocket: ' + wsUrl);
    };
    ws.onerror = error => {
      console.error('Websocket error: ' + wsUrl);
      console.error('Error: ' + error);
      console.dir(error);
    };
    ws.onmessage = e => {
      let msg = null;
      try {
        msg = JSON.parse(e.data)['message'];
      } catch (e) {
        console.log('Websocket error: ' + wsUrl);
        console.error('Error parsing: ' + e.data);
      }
      if (msg) {
        emitter({ type: registerAction, payload: msg });
      }
    };
    ws.onclose = () => {
      console.log('Closed websocket: ' + wsUrl);
      emitter(END);
    };
    // unsubscribe function
    return () => {
      console.log('Socket off');
    };
  });
}

function* sendMessage(ws, sendAction) {
  while (true) {
    const action = yield take([sendAction]);
    const message = action.payload;
    ws.send(
      JSON.stringify({
        data: message
      })
    );
  }
}

function* closeSocket(ws, sendMessageTask, closeAction) {
  yield take([closeAction]);
  yield cancel(sendMessageTask);
  ws.close();
}

function* getUrl(urlPaths) {
  let url = 'ws://' + window.location.host + '/ws/';
  for (let urlPath of urlPaths) {
    if (typeof urlPath === 'string') {
      url += urlPath + '/';
    } else if (typeof urlPath === 'function') {
      let urlPart = yield select(urlPath);
      url += urlPart + '/';
    }
  }
  return url;
}

function* dispatchChannelAction(channel) {
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function* setupWebSocket(wsActionsList) {
  for (let wsActions of wsActionsList) {
    let url = yield call(getUrl, wsActions.urlPaths);
    const ws = new WebSocket(url);
    const channel = yield call(initSocket, ws, wsActions.register);
    yield put({ type: wsActions.prepare });
    const sendMessageTask = yield fork(sendMessage, ws, wsActions.send);
    yield fork(closeSocket, ws, sendMessageTask, wsActions.close);
    yield fork(dispatchChannelAction, channel);
  }
}

const webSocketSagas = () => {
  const webSocketMap = webSocketMapApi.getWebSocketMap();
  const keyValList = Object.keys(webSocketMap).map(wsSetupAction => [
    wsSetupAction,
    webSocketMap[wsSetupAction]
  ]);
  let wsSagas = [];
  for (let keyVal of keyValList) {
    wsSagas.push(takeEvery([keyVal[0]], setupWebSocket, keyVal[1]));
  }
  return all(...wsSagas);
};

export default webSocketSagas();
