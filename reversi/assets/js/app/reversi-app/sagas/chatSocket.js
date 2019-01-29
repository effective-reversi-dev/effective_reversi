import { eventChannel, END } from 'redux-saga';
import { call, fork, put, take, takeEvery, cancel } from 'redux-saga/effects';

function initChatSocket(ws) {
    return eventChannel(emitter => {
        const wsUrl = ws.url;
        ws.onopen = () => {
            console.log('Websocket opening: ' + wsUrl);
        }
        ws.onerror = (error) => {
            console.log('Websocket error: ' + wsUrl);
            console.log('Error: ' + error);
            console.dir(error);
        }
        ws.onmessage = (e) => {
            let msg = null;
            let wsType = null;
            try {
                msg = JSON.parse(e.data)['message'];
                wsType = JSON.parse(e.data)['wsType'];
            } catch(e) {
                console.log('Websocket error: ' + wsUrl);
                console.error('Error parsing: ' + e.data);
            }
            if (msg) {
                switch(wsType) {
                    case 'chat':
                        emitter({ type: 'REGISTER_CHAT_INFO', payload: msg });
                    default:
                        console.log("Websocket Type isn't set yet.");
                        return;
                }
            }
        }
        ws.onclose = () => {
            console.log('Websocket closed: ' + wsUrl);
            emitter(END);
        }
        // unsubscribe function
        return () => {
            console.log('Socket off');
        }
    })

}

function* registerChatMessage(chatSocket) {
    while(true) {
        const action = yield take(['SEND_CHAT_INFO']);
        const message = action.payload;
        const now = new Date();
        const minutesWithZero = (minutes) => {
            if(minutes.toString().length === 1) {
                minutes = '0' + minutes;
            }
            return minutes;
        };
        const time = now.getHours() + ':' + minutesWithZero(now.getMinutes());
        //TODO: get userName from Store
        const info = {userName: 'DummyUser', message: message, time: time}
        chatSocket.send(JSON.stringify({
            'message': info,
        }));
    }
}

function* closeChatSocket(chatSocket, registerMessageTask) {
    yield take(['CLOSE_CHAT_SOCKET']);
    yield cancel(registerMessageTask);
    chatSocket.close();
}

function* setupWebSocket(action) {
    const wsType = action.payload;
    //TODO: get roomName from Store
    const roomName = 'DummyRoom';
    const ws = new WebSocket(`ws://${window.location.host}/ws/${wsType}/${roomName}/`);
    const channel = yield call(initChatSocket, ws);
    switch(wsType) {
        case 'chat':
            yield put({ type: 'CLEAR_CHAT_INFO' });
            const registerMessageTask = yield fork(registerChatMessage, ws);
            yield fork(closeChatSocket, ws, registerMessageTask);
            while(true) { 
                const action = yield take(channel);
                yield put(action);
            }
        default:
            console.log("Websocket Type isn't set yet.");
            break;
    }
}

const chatSagas = [
    // TODO: add actions for other WebSockets
    takeEvery(['SETUP_SOCKET'], setupWebSocket),
]

export default chatSagas;
