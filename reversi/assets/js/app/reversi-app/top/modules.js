import { handleAction, createActions } from 'redux-actions';

export const GET_USER_INFO = 'GET_USER_INFO'; // caught by saga
export const REGISTER_USER_INFO = 'REGISTER_USER_INFO'; // dispatched by saga

export const userInfoActions = createActions(GET_USER_INFO, REGISTER_USER_INFO);

const initialState = {
  displayName: null,
  emailAddress: null,
  userName: null,
  errMsg: null
};

export default handleAction(
  userInfoActions.registerUserInfo,
  (state, action) => {
    const { result, errMsg } = action.payload;
    const { displayName, emailAddress, userName } = result;
    if (errMsg) {
      return Object.assign({}, state, { errMsg });
    }
    return Object.assign({}, state, {
      displayName,
      emailAddress,
      userName,
      errMsg: null
    });
  },
  initialState
);
