import { handleActions, createActions } from 'redux-actions';

// Window panels management
const REQUEST_CHANGE = 'REQUEST_CHANGE';
export const RECIEVE_CHANGE = 'RECIEVE_CHANGE';

export const userConfigActions = createActions(
    REQUEST_CHANGE, 
    RECIEVE_CHANGE
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
    [userConfigActions.recieveChange]: (state, action) => {
        return Object.assign(
            {},
            state,
            {requestStatus: Object.assign({}, state.requestStatus, {status: action.payload.status, errMsg: action.payload.errMsg})}
        )
    }
}, initialState);
