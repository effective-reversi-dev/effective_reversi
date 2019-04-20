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
import webSocketMap from './map';

function initSocket(ws, registerAction) {
  return eventChannel(emitter => {
    const webSocket = ws;
    const wsUrl = webSocket.url;
    webSocket.onopen = () => {
      console.log(`Opening Websocket: ${wsUrl}`);
    };
    webSocket.onerror = error => {
      console.error(`Websocket error: ${wsUrl}`);
      console.error(`Error: ${error}`);
      console.dir(error);
    };
    webSocket.onmessage = e => {
      let msg = null;
      try {
        msg = JSON.parse(e.data).message;
      } catch (error) {
        console.log(`Websocket error: ${wsUrl}`);
        console.error(`Error parsing: ${e.data}`);
      }
      if (msg) {
        emitter({ type: registerAction, payload: msg });
      }
    };
    webSocket.onclose = () => {
      console.log(`Closed websocket: ${wsUrl}`);
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
  let url = `ws://${window.location.host}/ws/`;
  for (const urlPath of urlPaths) {
    if (typeof urlPath === 'string') {
      url += `${urlPath}/`;
    } else if (typeof urlPath === 'function') {
      const urlPart = yield select(urlPath);
      url += `${urlPart}/`;
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
  for (const wsActions of wsActionsList) {
    const url = yield call(getUrl, wsActions.urlPaths);
    const ws = new WebSocket(url);
    const channel = yield call(initSocket, ws, wsActions.register);
    yield put({ type: wsActions.prepare });
    const sendMessageTask = yield fork(sendMessage, ws, wsActions.send);
    yield fork(closeSocket, ws, sendMessageTask, wsActions.close);
    yield fork(dispatchChannelAction, channel);
  }
}

const webSocketSagas = () => {
  const keyValList = Object.keys(webSocketMap).map(wsSetupAction => [
    wsSetupAction,
    webSocketMap[wsSetupAction]
  ]);
  const wsSagas = [];
  for (const keyVal of keyValList) {
    wsSagas.push(takeEvery([keyVal[0]], setupWebSocket, keyVal[1]));
  }
  return all(...wsSagas);
};

export default webSocketSagas();
