import { all } from 'redux-saga/effects'

import webSocketSagas from './api/websocket/sagas';

export default function* rootSaga() {
    yield all(...[
        Object.assign(
            [],
            webSocketSagas
        )
    ])
}
