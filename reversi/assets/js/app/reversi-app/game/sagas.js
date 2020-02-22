import { all, take, call } from 'redux-saga/effects';

import { post } from '../api/http/methods';
import { REQUEST_STATUS } from '../room/modules';
import { panelActions } from './parts/modules';

const { startGame } = panelActions;

const START_GAME_URL = 'start_game';

async function startGameAsPlayer(roomInfo) {
  return post(START_GAME_URL, roomInfo)
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

function* gameStartSaga() {
  while (true) {
    const action = yield take([startGame]);
    const roomInfo = action.payload;
    yield call(startGameAsPlayer, roomInfo); // TODO: add put
  }
}

export default all([gameStartSaga()]);
