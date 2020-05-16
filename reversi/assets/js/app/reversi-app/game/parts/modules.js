import { handleActions, createActions } from 'redux-actions';
import {
  INIT_REVERSI_STATE,
  BLACK,
  WHITE,
  EMPTY
} from '../panels/reversi/constants';
import { judgeGameOver, getResult } from '../panels/reversi/utils';

// Window panels management
const ADD_PANEL = 'ADD_PANEL';
const REGISTER_OPEN_PANEL = 'REGISTER_OPEN_PANEL';
const REMOVE_PANEL = 'REMOVE_PANEL';

// Websocket management
export const SETUP_GAME_SOCKET = 'SETUP_GAME_SOCKET'; // with Saga
export const CLOSE_GAME_SOCKET = 'CLOSE_GAME_SOCKET'; // with Saga

// Interpanel management
export const REGISTER_NEXT_REVERSI_INFO = 'REGISTER_NEXT_REVERSI_INFO'; // with Saga
export const REGISTER_RESULT = 'REGISTER_RESULT'; // with Saga
export const CHECK_GAME_ABORTED = 'CHECK_GAME_ABORTED'; // with Saga
export const CLEAR_NEXT_REVERSI_POSITION = 'CLEAR_NEXT_REVERSI_POSITION'; // with Saga
export const SEND_NEXT_REVERSI_INFO = 'SEND_NEXT_REVERSI_INFO'; // with Saga
export const REGISTER_GAME_START_INFO = 'REGISTER_GAME_START_INFO'; // with Saga
export const CLEAR_GAME_START_INFO = 'CLEAR_GAME_START_INFO'; // with Saga
export const START_GAME = 'START_GAME'; // with Saga
export const GET_START_GAME_INFO = 'GET_START_GAME_INFO'; // with Saga
export const CLEAR_RESULT = 'CLEAR_RESULT'; // with Saga

export const panelActions = createActions(
  SETUP_GAME_SOCKET,
  CLOSE_GAME_SOCKET,
  ADD_PANEL,
  REGISTER_OPEN_PANEL,
  REMOVE_PANEL,
  REGISTER_NEXT_REVERSI_INFO,
  REGISTER_RESULT,
  CHECK_GAME_ABORTED,
  CLEAR_NEXT_REVERSI_POSITION,
  SEND_NEXT_REVERSI_INFO,
  REGISTER_GAME_START_INFO,
  CLEAR_GAME_START_INFO,
  START_GAME,
  CLEAR_RESULT
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
    nextColor: EMPTY
  },
  nextReversiPosition: {
    colIdx: null,
    rowIdx: null
  },
  nextReversiState: INIT_REVERSI_STATE,
  playerInfo: {
    whiteUserName: null,
    whiteDisplayName: null,
    blackUserName: null,
    blackDisplayName: null
  },
  result: '' // winner's color or "draw"
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
    [panelActions.registerResult]: (state, action) => {
      const { nextReversiState } = action.payload.data;
      let result = '';
      if (judgeGameOver(nextReversiState)) {
        result = getResult(nextReversiState);
      }
      return Object.assign({}, state, { result });
    },
    [panelActions.checkGameAborted]: (state, action) => {
      const { userName } = action.payload.leftUser;
      const { whiteUserName, blackUserName } = state.playerInfo;
      let result = '';
      if (userName === whiteUserName) {
        result = BLACK;
      } else if (userName === blackUserName) {
        result = WHITE;
      }
      return Object.assign({}, state, { result });
    },
    [panelActions.clearNextReversiPosition]: state => {
      const nextReversiPosition = {
        colIdx: null,
        rowIdx: null
      };
      const gameSituation = { blackNum: 2, whiteNum: 2, nextColor: EMPTY };
      return Object.assign({}, state, {
        nextReversiPosition,
        gameSituation,
        nextReversiState: INIT_REVERSI_STATE
      });
    },
    [panelActions.registerGameStartInfo]: (state, action) => {
      const {
        blackUserName,
        blackDisplayName,
        whiteUserName,
        whiteDisplayName
      } = action.payload.data;
      return Object.assign({}, state, {
        playerInfo: Object.assign({}, state.playerInfo, {
          blackUserName,
          blackDisplayName,
          whiteUserName,
          whiteDisplayName
        }),
        gameSituation: Object.assign({}, state.gameSituation, {
          nextColor: BLACK
        })
      });
    },
    [panelActions.clearResult]: state => {
      return Object.assign({}, state, { result: '' });
    },
    [panelActions.clearGameStartInfo]: state => {
      const playerInfo = {
        whiteUserName: null,
        whiteDisplayName: null,
        blackUserName: null,
        blackDisplayName: null
      };
      const gameSituation = {
        blackNum: 2,
        whiteNum: 2,
        nextColor: EMPTY
      };
      return Object.assign({}, state, { playerInfo, gameSituation });
    }
  },
  initialState
);
