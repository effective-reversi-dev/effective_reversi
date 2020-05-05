import { combineReducers } from 'redux';
import chat from './gamechat/modules';
import reversi from './reversi/modules';
import information from './gameinfo/modules';

export default combineReducers({
  chat,
  reversi,
  information
});
