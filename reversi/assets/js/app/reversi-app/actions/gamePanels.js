import { createActions } from 'redux-actions';
import actionTypes from './actionTypes';

export default createActions(
    actionTypes.ADD_PANEL,
    actionTypes.REMOVE_ALL,
);
