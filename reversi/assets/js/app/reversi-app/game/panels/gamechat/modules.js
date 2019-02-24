import { handleActions, createActions } from 'redux-actions';

// TODO: move websocket actions to a proper file
// Websocket Management
export const SETUP_GAME_SOCKET = 'SETUP_GAME_SOCKET'; // with Saga
export const CLOSE_CHAT_SOCKET = 'CLOSE_CHAT_SOCKET'; //with Saga

// WebSocket Management for chat
export const REGISTER_CHAT_INFO = 'REGISTER_CHAT_INFO'; // with Saga
export const CLEAR_CHAT_INFO = 'CLEAR_CHAT_INFO'; // with Saga
export const SEND_CHAT_INFO = 'SEND_CHAT_INFO'; // with Saga

export const chatActions = createActions(
    SETUP_GAME_SOCKET, 
    CLOSE_CHAT_SOCKET,
    REGISTER_CHAT_INFO,
    CLEAR_CHAT_INFO,
    SEND_CHAT_INFO,
);

const initialState = {
    chatInfo: []
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
