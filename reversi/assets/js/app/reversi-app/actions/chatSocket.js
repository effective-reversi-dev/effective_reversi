import { createActions } from 'redux-actions';
import actionTypes from './actionTypes';

export default createActions(
    actionTypes.SETUP_SOCKET, 
    actionTypes.CLOSE_CHAT_SOCKET,
    actionTypes.REGISTER_CHAT_INFO,
    actionTypes.CLEAR_CHAT_INFO,
    actionTypes.SEND_CHAT_INFO,
);
