import { all } from 'redux-saga/effects';

import webSocketSaga from './api/websocket/sagas';
import userConfigSaga from './userconfig/sagas';
import roomSelectionSaga from './room/room/sagas';

export default function* rootSaga() {
  yield all([...[webSocketSaga], ...[userConfigSaga], ...[roomSelectionSaga]]);
}
