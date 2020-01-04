import { all, call, put, take } from 'redux-saga/effects';
import { roomActions, REQUEST_STATUS } from '../modules';
import { get, post, SERVER_CONNECTION_ERROR } from '../../api/http/methods';

const {
  resolveRoomData,
  registerRoomData,
  receiveEnterRoomResponse,
  enterRoom,
  markCurrentRoomId,
  exitRoom
} = roomActions;

const ROOM_DATA_URL = 'fetch_room_data';
const ENTER_ROOM_URL = 'enter_room';
const EXIT_ROOM_URL = 'exit_room';

async function fetchRoomData() {
  return get(ROOM_DATA_URL)
    .then(responseObj => {
      const result = { roomData: responseObj.room_data, errMsg: null };
      return { payload: result };
    })
    .catch(errorObj => {
      const err = { roomData: [], errMsg: errorObj.message };
      return { err };
    });
}

async function requestEnterRoom(roomToEnter) {
  return post(ENTER_ROOM_URL, roomToEnter)
    .then(responseObj => {
      if (responseObj.succeeded === false) {
        return {
          payload: {
            status: REQUEST_STATUS.FAIL,
            errMsg: responseObj.err_msg
          }
        };
      }
      return { payload: { status: REQUEST_STATUS.SUCCESS, errMsg: null } };
    })
    .catch(errorObj => {
      const err = { status: REQUEST_STATUS.FAIL, errMsg: errorObj.message };
      return { err };
    });
}

async function requestExitRoom() {
  post(EXIT_ROOM_URL)
    .then(responseObj => {
      if (responseObj.succeeded === false) {
        return {
          payload: {
            status: REQUEST_STATUS.FAIL,
            errMsg: SERVER_CONNECTION_ERROR
          }
        };
      }
      return { payload: { status: REQUEST_STATUS.SUCCESS, errMsg: null } };
    })
    .catch(errorObj => {
      const err = { status: REQUEST_STATUS.FAIL, errMsg: errorObj.message };
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
