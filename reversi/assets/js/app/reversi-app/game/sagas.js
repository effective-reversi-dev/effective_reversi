import { all, take, call, put } from 'redux-saga/effects';

import { post } from '../api/http/methods';
import { panelActions } from './parts/modules';
import { informationActions } from './panels/gameinfo/modules';

const { startGame } = panelActions;
const { registerLogMessage } = informationActions;

const START_GAME_URL = 'start_game';

async function startGameAsPlayer(roomInfo) {
  return post(START_GAME_URL, roomInfo)
    .then(responseObj => {
      if (responseObj.succeeded === false) {
        return { errMsg: responseObj.err_msg };
      }
      return { errMsg: null };
    })
    .catch(errorObj => {
      // サーバ側でハンドルする想定で無視。
      return { ignored: errorObj.message, errMsg: null };
    });
}

function* gameStartSaga() {
  while (true) {
    const action = yield take([startGame]);
    const roomInfo = action.payload;
    const { errMsg } = yield call(startGameAsPlayer, roomInfo);
    if (errMsg !== null) {
      yield put(registerLogMessage({ logMessage: errMsg }));
    }
  }
}

export default all([gameStartSaga()]);
