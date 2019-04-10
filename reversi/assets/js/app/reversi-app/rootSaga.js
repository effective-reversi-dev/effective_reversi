import { all } from 'redux-saga/effects';

import webSocketSagas from './api/websocket/sagas';
import userConfigSaga from './userconfig/sagas';

export default function* rootSaga() {
  yield all(...[Object.assign([], webSocketSagas, [userConfigSaga])]);
}
