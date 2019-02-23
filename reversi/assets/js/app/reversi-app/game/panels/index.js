import { combineReducers } from 'redux';
import chat from './gamechat/modules';

export default combineReducers({
    chat: chat
});
