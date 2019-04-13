import { handleActions, createActions } from 'redux-actions';

// Serverへの、UserConfigに関する設定変更リクエスト
const REQUEST_CHANGE = 'REQUEST_CHANGE';
export const RECEIVE_CHANGE = 'RECEIVE_CHANGE';
const INITIALIZE_REQUEST_STATUS = 'INITIALIZE_REQUEST_STATUS'

export const userConfigActions = createActions(
    REQUEST_CHANGE, 
    RECEIVE_CHANGE,
    INITIALIZE_REQUEST_STATUS,
);

export const REQUEST_STATUS = {
    SUCCESS:'SUCCESS',
    FAIL:'FAIL',
    READY:'READY'
}

const initialState = {
    requestStatus: {status: REQUEST_STATUS.READY, errMsg: null},
};

export default handleActions({
    [userConfigActions.receiveChange]: (state, action) => {
        return Object.assign(
            {},
            state,
            {requestStatus: Object.assign({}, state.requestStatus, {status: action.payload.status, errMsg: action.payload.errMsg})}
        )
    },
    [userConfigActions.initializeRequestStatus]: (state, action) => initialState
}, initialState);
