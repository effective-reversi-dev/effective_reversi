import { all } from 'redux-saga/effects'

import chatSagas from './chatSocket';

export default function* rootSaga() {
    yield all([
        Object.assign(
            [],
            chatSagas,
        )
    ])
}
