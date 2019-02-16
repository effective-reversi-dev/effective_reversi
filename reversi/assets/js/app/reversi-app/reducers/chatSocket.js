import { handleActions } from 'redux-actions';
import chatActions from '../actions/chatSocket';

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
