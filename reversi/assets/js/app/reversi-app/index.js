import { combineReducers } from 'redux';
import game from './game';
import userConfig from './userconfig';

export default combineReducers({
  game: game,
  userConfig: userConfig
});
