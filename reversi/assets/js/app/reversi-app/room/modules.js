import { handleActions, createActions } from 'redux-actions';
// ==== room selection ===
// WebSocket Management for room_selection
export const SETUP_ROOM_SELECTION_SOCKET = 'SETUP_ROOM_SELECTION_SOCKET'; // with Saga
export const CLOSE_ROOM_SELECTION_SOCKET = 'CLOSE_ROOM_SELECTION_SOCKET'; // with Saga
export const SEND_ROOM_DATA_REQUEST = 'SEND_ROOM_DATA_REQUEST'; // with Saga
export const ENTER_ROOM = 'ENTER_ROOM'; // with Saga
export const MARK_CURRENT_ROOM_ID = 'MARK_CURRENT_ROOM_ID'; // with Saga
export const EXIT_ROOM = 'EXIT_ROOM'; // with Saga

export const CLEAR_ROOM_DATA = 'CLEAR_ROOM_DATA'; // with Saga
export const REGISTER_ROOM_DATA = 'REGISTER_ROOM_DATA'; // with Saga
export const RECEIVE_ENTER_ROOM_RESPONSE = 'RECEIVE_ENTER_ROOM_RESPONSE'; // with Saga

// Initial room data
export const RESOLVE_ROOM_DATA = 'RESOLVE_ROOM_DATA'; // with Saga

const CLEAR_ENTER_ROOM_REQUEST_STATUS = 'CLEAR_ENTER_ROOM_REQUEST_STATUS';

// === room creation ===
export const CREATE_ROOM = 'CREATE_ROOM'; // with Saga
export const RECEIVE_CREATE_ROOM_RESPONSE = 'RECEIVE_CREATE_ROOM_RESPONSE'; // with Saga
const CLEAR_CREATE_ROOM_REQUEST_STATUS = 'CLEAR_CREATE_ROOM_REQUEST_STATUS';

export const roomActions = createActions(
  // ws
  SETUP_ROOM_SELECTION_SOCKET,
  CLOSE_ROOM_SELECTION_SOCKET,
  // 部屋データ解決
  REGISTER_ROOM_DATA,
  SEND_ROOM_DATA_REQUEST,
  RESOLVE_ROOM_DATA,
  CLEAR_ROOM_DATA,
  // 部屋へ入る
  ENTER_ROOM,
  MARK_CURRENT_ROOM_ID,
  RECEIVE_ENTER_ROOM_RESPONSE,
  // 部屋を出る
  EXIT_ROOM,

  // 入室リクエストの状況初期化
  CLEAR_ENTER_ROOM_REQUEST_STATUS,

  // 部屋を作る
  CREATE_ROOM,
  RECEIVE_CREATE_ROOM_RESPONSE,
  CLEAR_CREATE_ROOM_REQUEST_STATUS
);

export const REQUEST_STATUS = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
  READY: 'READY'
};

const initialState = {
  fetchRoomResponse: {
    roomData: [],
    errMsg: ''
  },
  enterRoomResponse: {
    status: REQUEST_STATUS.READY,
    errMsg: null
  },
  createRoomResponse: {
    status: REQUEST_STATUS.READY,
    errMsg: null
  },
  currentRoomInfo: {
    isSpectator: null,
    roomId: null
  }
};

export default handleActions(
  {
    [roomActions.registerRoomData]: (state, action) => {
      return Object.assign({}, state, {
        fetchRoomResponse: {
          roomData: action.payload.roomData,
          errMsg: action.payload.errMsg
        }
      });
    },
    [roomActions.clearRoomData]: state => {
      return Object.assign({}, state, {
        fetchRoomResponse: {
          roomData: [],
          errMsg: ''
        }
      });
    },
    [roomActions.receiveEnterRoomResponse]: (state, action) => {
      return Object.assign({}, state, {
        enterRoomResponse: {
          status: action.payload.status,
          errMsg: action.payload.errMsg
        }
      });
    },
    [roomActions.markCurrentRoomId]: (state, action) => {
      return Object.assign({}, state, {
        currentRoomInfo: {
          roomId: action.payload.roomId,
          isSpectator: action.payload.isSpectator
        }
      });
    },
    [roomActions.clearEnterRoomRequestStatus]: state => {
      return Object.assign({}, state, {
        enterRoomResponse: {
          status: REQUEST_STATUS.READY,
          errMsg: null
        }
      });
    },
    [roomActions.receiveCreateRoomResponse]: (state, action) => {
      return Object.assign({}, state, {
        createRoomResponse: {
          status: action.payload.status,
          errMsg: action.payload.errMsg
        }
      });
    },
    [roomActions.clearCreateRoomRequestStatus]: state => {
      return Object.assign({}, state, {
        createRoomResponse: {
          status: REQUEST_STATUS.READY,
          errMsg: null
        }
      });
    }
  },
  initialState
);
