import { call, put, take } from 'redux-saga/effects';
import { userConfigActions, REQUEST_STATUS } from './modules';
import { post } from '../api/http/methods';

const { receiveChange, requestChange } = userConfigActions;
const ERROR_EMPTY_PAYLOAD = '変更内容が入力されていません。';

const USER_CHANGE_URL = 'users/change_user/';

async function fetchChangeResponse(currentConfigs) {
  return post(USER_CHANGE_URL, currentConfigs)
    .then(responseObj => {
      let result;
      if (responseObj.err === true) {
        result = { status: REQUEST_STATUS.FAIL, errMsg: responseObj.err_msg };
      } else {
        result = { status: REQUEST_STATUS.SUCCESS, errMsg: null };
      }
      return { payload: result };
    })
    .catch(errorObj => {
      const err = { status: REQUEST_STATUS.FAIL, errMsg: errorObj.message };
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
