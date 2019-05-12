import shortid from 'shortid';
import { handleActions, createActions } from 'redux-actions';

// WebSocket Management for chat
export const CLOSE_CHAT_SOCKET = 'CLOSE_CHAT_SOCKET'; // with Saga
export const REGISTER_CHAT_INFO = 'REGISTER_CHAT_INFO'; // with Saga
export const CLEAR_CHAT_INFO = 'CLEAR_CHAT_INFO'; // with Saga
export const SEND_CHAT_INFO = 'SEND_CHAT_INFO'; // with Saga

export const chatActions = createActions(
  CLOSE_CHAT_SOCKET,
  REGISTER_CHAT_INFO,
  CLEAR_CHAT_INFO,
  SEND_CHAT_INFO
);

const initialState = {
  chatInfo: []
};

export default handleActions(
  {
    [chatActions.registerChatInfo]: (state, action) => {
      return Object.assign({}, state, {
        chatInfo: state.chatInfo.concat([
          Object.assign({}, action.payload, { id: shortid.generate() })
        ])
      });
    },
    [chatActions.clearChatInfo]: state => {
      return Object.assign({}, state, { chatInfo: [] });
    }
  },
  initialState
);
