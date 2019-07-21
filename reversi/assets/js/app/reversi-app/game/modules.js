import { handleActions, createActions } from 'redux-actions';

const DISPLAY_EXIT_DIALOG = 'DISPLAY_EXIT_DIALOG';
const CLOSE_EXIT_DIALOG = 'CLOSE_EXIT_DIALOG';

export const gameActions = createActions(
  DISPLAY_EXIT_DIALOG,
  CLOSE_EXIT_DIALOG
);

const initialState = {
  exitTitle: '',
  exitDescription: '',
  shouldDisplayCancel: true,
  isOpenExitDialog: false
};

export default handleActions(
  {
    [gameActions.displayExitDialog]: (state, action) => {
      const {
        exitTitle,
        exitDescription,
        shouldDisplayCancel
      } = action.payload;
      return Object.assign({}, state, {
        exitTitle,
        exitDescription,
        shouldDisplayCancel,
        isOpenExitDialog: true
      });
    },
    [gameActions.closeExitDialog]: state => {
      return Object.assign({}, state, { isOpenExitDialog: false });
    }
  },
  initialState
);
