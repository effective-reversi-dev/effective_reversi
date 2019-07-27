import { combineReducers } from 'redux';
import parts from './parts/modules';
import panels from './panels';
import game from './modules';

export default combineReducers({
  parts,
  panels,
  game
});
