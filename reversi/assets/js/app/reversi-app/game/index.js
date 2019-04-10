import { combineReducers } from 'redux';
import parts from './parts/modules';
import panels from './panels';

export default combineReducers({
  parts: parts,
  panels: panels
});
