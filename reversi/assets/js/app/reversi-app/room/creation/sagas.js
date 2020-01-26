import { all, call, put, take } from 'redux-saga/effects';
import { roomActions, REQUEST_STATUS } from '../modules';
import { post } from '../../api/http/methods';

const {
  receiveCreateRoomResponse,
  createRoom,
  markCurrentRoomId
} = roomActions;

const CREATE_ROOM_URL = 'create_room';

async function requestCreateRoom(roomInfo) {
  return post(CREATE_ROOM_URL, roomInfo)
    .then(responseObj => {
      if (responseObj.succeeded === false) {
        return {
          payload: {
            status: REQUEST_STATUS.FAIL,
            errMsg: responseObj.err_msg
          }
        };
      }
      return {
        payload: {
          status: REQUEST_STATUS.SUCCESS,
          roomId: responseObj.room_id,
          errMsg: null
        }
      };
    })
    .catch(errorObj => {
      const err = { status: REQUEST_STATUS.FAIL, errMsg: errorObj.message };
      return { err };
    });
}

function* createRoomSaga() {
  while (true) {
    const action = yield take([createRoom]);
    const { payload, err } = yield call(requestCreateRoom, action.payload);
    if (payload && !err) {
      if (!payload.errMsg) {
        const configuration = {
          // 部屋を作成するのは対戦者
          isSpectator: action.payload.isSpectator,
          roomId: payload.roomId
        };
        yield put(markCurrentRoomId(configuration));
      }
      yield put(receiveCreateRoomResponse(payload));
    } else {
      yield put(receiveCreateRoomResponse(err));
    }
  }
}

export default all([createRoomSaga()]);
