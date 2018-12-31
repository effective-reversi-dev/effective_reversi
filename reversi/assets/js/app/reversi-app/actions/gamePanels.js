import { createActions } from 'redux-actions';
import actionTypes from './actionTypes';

export default createActions(
    actionTypes.ADD_PANEL,
    actionTypes.REGISTER_OPEN_PANEL,
    actionTypes.REMOVE_PANEL,
);
