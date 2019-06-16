import { all, call, put, take } from 'redux-saga/effects';
import { roomActions, REQUEST_STATUS } from '../modules';

const {
  resolveRoomData,
  registerRoomData,
  receiveEnterRoomResponse,
  enterRoom,
  markCurrentRoomId,
  exitRoom
} = roomActions;

// TODO この手の定数の置き場所を作りたい。
const SERVER_ERROR = 'サーバとの通信に失敗しました。';

const ROOM_DATA_URL = 'fetch_room_data';
const ENTER_ROOM_URL = 'enter_room';
const EXIT_ROOM_URL = 'exit_room';

async function fetchRoomData() {
  const csrfToken = document.getElementsByName('csrfmiddlewaretoken').item(0)
    .value;
  const data = new FormData();
  // ここでcsrfTokenを詰める。
  data.append('csrfmiddlewaretoken', csrfToken);
  return fetch(ROOM_DATA_URL, {
    method: 'POST',
    body: data,
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(SERVER_ERROR);
    })
    .then(responseObj => {
      const result = { roomData: responseObj.room_data, errMsg: null };
      return { payload: result };
    })
    .catch(() => {
      const err = { roomData: [], errMsg: SERVER_ERROR };
      return { err };
    });
}

async function requestEnterRoom(roomToEnter) {
  // ページの body 内にinput要素として置いてあるcsrfTokenを取りに行く。
  const csrfToken = document.getElementsByName('csrfmiddlewaretoken').item(0)
    .value;
  const data = new FormData();
  data.append('isSpectator', roomToEnter.isSpectator);
  data.append('roomId', roomToEnter.roomId);
  // ここでcsrfTokenを詰める。
  data.append('csrfmiddlewaretoken', csrfToken);
  return fetch(ENTER_ROOM_URL, {
    method: 'POST',
    body: data,
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(SERVER_ERROR);
    })
    .then(responseObj => {
      if (responseObj.succeeded === false) {
        return {
          payload: {
            status: REQUEST_STATUS.FAIL,
            errMsg: responseObj.err_msg
          }
        };
      }
      if (responseObj.succeeded === true) {
        return { payload: { status: REQUEST_STATUS.SUCCESS, errMsg: null } };
      }
      return { payload: { status: REQUEST_STATUS.FAIL, errMsg: SERVER_ERROR } };
    })
    .catch(() => {
      const err = { status: REQUEST_STATUS.FAIL, errMsg: SERVER_ERROR };
      return { err };
    });
}

async function requestExitRoom() {
  // ページの body 内にinput要素として置いてあるcsrfTokenを取りに行く。
  const csrfToken = document.getElementsByName('csrfmiddlewaretoken').item(0)
    .value;
  const data = new FormData();
  // ここでcsrfTokenを詰める。
  data.append('csrfmiddlewaretoken', csrfToken);
  return fetch(EXIT_ROOM_URL, {
    method: 'POST',
    body: data,
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(SERVER_ERROR);
    })
    .then(responseObj => {
      if (responseObj.succeeded === false) {
        return {
          payload: {
            status: REQUEST_STATUS.FAIL,
            errMsg: SERVER_ERROR
          }
        };
      }
      if (responseObj.succeeded === true) {
        return { payload: { status: REQUEST_STATUS.SUCCESS, errMsg: null } };
      }
      return { payload: { status: REQUEST_STATUS.FAIL, errMsg: SERVER_ERROR } };
    })
    .catch(() => {
      const err = { status: REQUEST_STATUS.FAIL, errMsg: SERVER_ERROR };
      return { err };
    });
}

function* roomDataSaga() {
  while (true) {
    yield take([resolveRoomData]);
    const { payload, err } = yield call(fetchRoomData);
    if (payload && !err) {
      yield put(registerRoomData(payload));
    } else {
      yield put(registerRoomData(err));
    }
  }
}

function* enterRoomSaga() {
  while (true) {
    const action = yield take([enterRoom]);
    const roomInfo = action.payload;
    const { payload, err } = yield call(requestEnterRoom, roomInfo);
    if (payload && !err) {
      if (!payload.errMsg) {
        yield put(markCurrentRoomId(roomInfo));
      }
      yield put(receiveEnterRoomResponse(payload));
    } else {
      yield put(receiveEnterRoomResponse(err));
    }
  }
}

function* exitRoomSaga() {
  while (true) {
    yield take([exitRoom]);
    yield call(requestExitRoom);
    yield put(markCurrentRoomId({ roomId: null, isSpectator: null }));
  }
}

export default all([enterRoomSaga(), roomDataSaga(), exitRoomSaga()]);
