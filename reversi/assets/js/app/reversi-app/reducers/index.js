import { combineReducers } from 'redux';
import panels from './gamePanels';
import chatSocket from './chatSocket';

export default combineReducers({
    panels: panels,
    chat: chatSocket,
})
