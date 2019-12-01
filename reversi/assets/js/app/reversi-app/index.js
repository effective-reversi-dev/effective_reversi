import { combineReducers } from 'redux';
import game from './game';
import userConfig from './userconfig';
import roomSelection from './room';
import userInfo from './top';

export default combineReducers({
  game,
  userConfig,
  roomSelection,
  userInfo
});
