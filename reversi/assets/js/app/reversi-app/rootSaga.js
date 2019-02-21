import { all } from 'redux-saga/effects'

import chatSagas from './game/panels/gamechat/chatSagas';

export default function* rootSaga() {
    yield all([
        Object.assign(
            [],
            chatSagas
        )
    ])
}
