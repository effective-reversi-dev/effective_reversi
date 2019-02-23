import { handleActions, createActions } from 'redux-actions';

// Websocket Management
const SETUP_SOCKET = 'SETUP_SOCKET'; // with Saga
const CLOSE_CHAT_SOCKET = 'CLOSE_CHAT_SOCKET'; //with Saga

// WebSocket Management for chat
const REGISTER_CHAT_INFO = 'REGISTER_CHAT_INFO'; // with Saga
const CLEAR_CHAT_INFO = 'CLEAR_CHAT_INFO'; // with Saga
const SEND_CHAT_INFO = 'SEND_CHAT_INFO'; // with Saga

export const chatActions = createActions(
    SETUP_SOCKET, 
    CLOSE_CHAT_SOCKET,
    REGISTER_CHAT_INFO,
    CLEAR_CHAT_INFO,
    SEND_CHAT_INFO,
);

const initialState = {
    chatInfo: [], // list of {userName: xxx, message: xxx, time: xxx}
}

export default handleActions({
    [chatActions.registerChatInfo]: (state, action) => {
        return Object.assign(
            {},
            state,
            {chatInfo: Object.assign([], state.chatInfo.concat([action.payload]))},
        )
    },
    [chatActions.clearChatInfo]: (state) => {
        return Object.assign(
            {},
            state,
            {chatInfo: []},
        )
    }
}, initialState);
