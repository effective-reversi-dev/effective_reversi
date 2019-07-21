import { combineReducers } from 'redux';
import chat from './gamechat/modules';
import reversi from './reversi/modules';

export default combineReducers({
  chat,
  reversi
});
