import { handleActions, createActions } from 'redux-actions';
import { BLACK, INIT_REVERSI_STATE } from '../panels/reversi/constants';

// Window panels management
const ADD_PANEL = 'ADD_PANEL';
const REGISTER_OPEN_PANEL = 'REGISTER_OPEN_PANEL';
const REMOVE_PANEL = 'REMOVE_PANEL';

// Websocket management
export const SETUP_GAME_SOCKET = 'SETUP_GAME_SOCKET'; // with Saga
export const CLOSE_GAME_SOCKET = 'CLOSE_GAME_SOCKET'; // with Saga

// Interpanel management
export const REGISTER_NEXT_REVERSI_INFO = 'REGISTER_NEXT_REVERSI_INFO'; // with Saga
export const CLEAR_NEXT_REVERSI_POSITION = 'CLEAR_NEXT_REVERSI_POSITION'; // with Saga
export const SEND_NEXT_REVERSI_INFO = 'SEND_NEXT_REVERSI_INFO'; // with Saga

export const panelActions = createActions(
  SETUP_GAME_SOCKET,
  CLOSE_GAME_SOCKET,
  ADD_PANEL,
  REGISTER_OPEN_PANEL,
  REMOVE_PANEL,
  REGISTER_NEXT_REVERSI_INFO,
  CLEAR_NEXT_REVERSI_POSITION,
  SEND_NEXT_REVERSI_INFO
);

const initialState = {
  // room
  roomName: 'dummyRoom', // TODO: change proper room name
  // panel
  panelsOpen: { 情報: true, ゲーム画面: true, 戦況: true, チャット: true },
  addedPanel: '',
  // game
  gameSituation: {
    blackNum: 2,
    whiteNum: 2,
    nextColor: BLACK
  },
  nextReversiPosition: {
    colIdx: null,
    rowIdx: null
  },
  nextReversiState: INIT_REVERSI_STATE
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
    [panelActions.registerNextReversiInfo]: (state, action) => {
      const {
        blackNum,
        whiteNum,
        colIdx,
        rowIdx,
        nextColor,
        nextReversiState
      } = action.payload.data;
      const nextReversiPosition = { colIdx, rowIdx };
      const gameSituation = { blackNum, whiteNum, nextColor };
      return Object.assign({}, state, {
        nextReversiPosition,
        gameSituation,
        nextReversiState
      });
    },
    [panelActions.clearNextReversiPosition]: state => {
      const nextReversiPosition = {
        colIdx: null,
        rowIdx: null
      };
      const gameSituation = { blackNum: 2, whiteNum: 2, nextColor: BLACK };
      return Object.assign({}, state, {
        nextReversiPosition,
        gameSituation,
        nextReversiState: INIT_REVERSI_STATE
      });
    }
  },
  initialState
);
