import { take, call, put } from 'redux-saga/effects';

import { get } from '../api/http/methods';
import { userInfoActions } from './modules';

const { getUserInfo, registerUserInfo } = userInfoActions;

const GET_USER_URL = 'users/get_user/';

async function fetchUserInfo() {
  return get(GET_USER_URL)
    .then(responseObj => {
      // eslint-disable-next-line camelcase
      const { display_name, email, username } = responseObj;
      const result = {
        displayName: display_name,
        emailAddress: email,
        userName: username
      };
      return { result };
    })
    .catch(errorObj => {
      return { errMsg: errorObj.message };
    });
}
function* topPageSaga() {
  while (true) {
    yield take(getUserInfo);
    const { result, errMsg } = yield call(fetchUserInfo);
    yield put(registerUserInfo({ result, errMsg }));
  }
}

export default topPageSaga();
