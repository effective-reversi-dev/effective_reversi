import { combineReducers } from 'redux';
import game from './game';
import userConfig from './userconfig';
import room from './room';
import userInfo from './top';

export default combineReducers({
  game,
  userConfig,
  room,
  userInfo
});
