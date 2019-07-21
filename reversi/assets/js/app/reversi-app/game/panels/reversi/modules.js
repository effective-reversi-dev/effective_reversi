import { handleActions, createActions } from 'redux-actions';

export const SEND_CONSISTENCY = 'SEND_CONSISTENCY';
export const REGISTER_CONSISTENCY = 'REGISTER_CONSISTENCY';
export const CLEAR_CONSISTENCY = 'CLEAR_CONSISTENCY';

export const panelActions = createActions(
  SEND_CONSISTENCY,
  REGISTER_CONSISTENCY,
  CLEAR_CONSISTENCY
);

const initialState = {
  consistency: true
};

export default handleActions(
  {
    [panelActions.registerConsistency]: (state, action) => {
      return Object.assign({}, state, { consistency: action.payload.data });
    },
    [panelActions.clearConsistency]: state => {
      return Object.assign({}, state, { consistency: true });
    }
  },
  initialState
);
