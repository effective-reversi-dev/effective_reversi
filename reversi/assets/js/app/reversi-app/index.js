import { combineReducers } from 'redux';
import game from './game';
import userConfig from './userconfig';
import roomSelection from './room';

export default combineReducers({
  game,
  userConfig,
  roomSelection
});
