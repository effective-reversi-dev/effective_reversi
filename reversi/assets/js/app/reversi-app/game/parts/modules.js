import { handleActions, createActions, createAction } from 'redux-actions';
import { BLACK } from '../panels/reversi/constants';

// Window panels management
const ADD_PANEL = 'ADD_PANEL';
const REGISTER_OPEN_PANEL = 'REGISTER_OPEN_PANEL';
const REMOVE_PANEL = 'REMOVE_PANEL';

// Websocket management
export const SETUP_GAME_SOCKET = 'SETUP_GAME_SOCKET'; // with Saga
export const CLOSE_GAME_SOCKET = 'CLOSE_GAME_SOCKET'; // with Saga

// Interpanel management
const SET_REVERSI_SITUATION = 'SET_REVERSI_SITUATION';
export const REGISTER_NEXT_REVERSI_POSITION = 'REGISTER_NEXT_REVERSI_POSITION'; // with Saga
export const CLEAR_NEXT_REVERSI_POSITION = 'CLEAR_NEXT_REVERSI_POSITION'; // with Saga
export const SEND_NEXT_REVERSI_POSITION = 'SEND_NEXT_REVERSI_POSITION'; // with Saga

export const panelActions = createActions(
  SETUP_GAME_SOCKET,
  CLOSE_GAME_SOCKET,
  ADD_PANEL,
  REGISTER_OPEN_PANEL,
  REMOVE_PANEL,
  REGISTER_NEXT_REVERSI_POSITION,
  CLEAR_NEXT_REVERSI_POSITION,
  SEND_NEXT_REVERSI_POSITION
);

export const setReversiSituation = createAction(
  SET_REVERSI_SITUATION,
  (blackNum, whiteNum) => ({
    blackNum,
    whiteNum
  })
);

const initialState = {
  panelsOpen: { 情報: true, ゲーム画面: true, 戦況: true, チャット: true },
  addedPanel: '',
  roomName: 'dummyRoom', // TODO: change proper room name
  blackNum: 2,
  whiteNum: 2,
  nextReversiPosition: {
    colIdx: null,
    rowIdx: null,
    nextColor: BLACK
  }
};

export default handleActions(
  {
    [panelActions.addPanel]: (state, action) => {
      return Object.assign({}, state, { addedPanel: action.payload });
    },
    [panelActions.registerOpenPanel]: (state, action) => {
      return Object.assign({}, state, {
        panelsOpen: Object.assign({}, state.panelsOpen, {
          [action.payload]: true
        }),
        addedPanel: ''
      });
    },
    [panelActions.removePanel]: (state, action) => {
      return Object.assign({}, state, {
        panelsOpen: Object.assign({}, state.panelsOpen, {
          [action.payload]: false
        })
      });
    },
    [setReversiSituation]: (state, action) => {
      const { blackNum, whiteNum } = action.payload;
      return Object.assign({}, state, {
        blackNum,
        whiteNum
      });
    },
    [panelActions.registerNextReversiPosition]: (state, action) => {
      const { colIdx, rowIdx, nextColor } = action.payload.data;
      const nextReversiPosition = { colIdx, rowIdx, nextColor };
      return Object.assign({}, state, {
        nextReversiPosition
      });
    },
    [panelActions.clearNextReversiPosition]: state => {
      const nextReversiPosition = {
        colIdx: null,
        rowIdx: null,
        nextColor: BLACK
      };
      return Object.assign({}, state, {
        blackNum: 2,
        whiteNum: 2,
        nextReversiPosition
      });
    }
  },
  initialState
);
