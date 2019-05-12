import { call, put, take } from 'redux-saga/effects';
import { userConfigActions, REQUEST_STATUS } from './modules';

const { receiveChange, requestChange } = userConfigActions;

const ERROR_EMPTY_PAYLOAD = '変更内容が入力されていません。';
const ERROR_SERVER_ERROR = 'サーバとの通信に失敗しました。';

const USER_CHANGE_URL = 'users/change_user/';

async function fetchChangeResponse(currentConfigs) {
  // ページの body 内にinput要素として置いてあるcsrfTokenを取りに行く。
  const csrfToken = document.getElementsByName('csrfmiddlewaretoken').item(0)
    .value;
  const data = new FormData();
  data.append('displayName', currentConfigs.displayName);
  data.append('emailAddress', currentConfigs.emailAddress);
  // ここでcsrfTokenを詰める。
  data.append('csrfmiddlewaretoken', csrfToken);
  return fetch(USER_CHANGE_URL, {
    method: 'POST',
    body: data,
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(ERROR_SERVER_ERROR);
    })
    .then(responseObj => {
      let result;
      if (responseObj.err === true) {
        result = { status: REQUEST_STATUS.FAIL, errMsg: responseObj.err_msg };
      } else {
        result = { status: REQUEST_STATUS.SUCCESS, errMsg: null };
      }
      return { payload: result };
    })
    .catch(() => {
      const err = { status: REQUEST_STATUS.FAIL, errMsg: ERROR_SERVER_ERROR };
      return { err };
    });
}

function* userConfigSaga() {
  while (true) {
    const action = yield take([requestChange]);
    const currentConfigs = action.payload;
    if (
      currentConfigs.displayName === '' &&
      currentConfigs.emailAddress === ''
    ) {
      yield put(
        receiveChange({
          status: REQUEST_STATUS.FAIL,
          errMsg: ERROR_EMPTY_PAYLOAD
        })
      );
    } else {
      const { payload, err } = yield call(fetchChangeResponse, currentConfigs);
      if (payload && !err) {
        yield put(receiveChange(payload));
      } else {
        yield put(receiveChange(err));
      }
    }
  }
}

export default userConfigSaga();
