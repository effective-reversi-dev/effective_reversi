import { all } from 'redux-saga/effects';

import webSocketSaga from './api/websocket/sagas';
import userConfigSaga from './userconfig/sagas';

export default function* rootSaga() {
  yield all([...[webSocketSaga], ...[userConfigSaga]]);
}
