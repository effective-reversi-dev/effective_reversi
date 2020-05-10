import {
  SETUP_GAME_SOCKET,
  CLOSE_GAME_SOCKET,
  REGISTER_NEXT_REVERSI_INFO,
  REGISTER_RESULT,
  CLEAR_NEXT_REVERSI_POSITION,
  SEND_NEXT_REVERSI_INFO,
  REGISTER_GAME_START_INFO,
  CLEAR_GAME_START_INFO,
  CLEAR_RESULT
} from '../../game/parts/modules';
import {
  REGISTER_CHAT_INFO,
  SEND_CHAT_INFO,
  CLEAR_CHAT_INFO
} from '../../game/panels/gamechat/modules';
import {
  REGISTER_ENTERING_MEMBER_DATA,
  REGISTER_EXITING_MEMBER_DATA,
  REGISTER_PLAYER_STONE,
  CLEAR_INFORMATION
} from '../../game/panels/gameinfo/modules';
import {
  REGISTER_CONSISTENCY,
  SEND_CONSISTENCY,
  CLEAR_CONSISTENCY
} from '../../game/panels/reversi/modules';

import {
  SETUP_ROOM_SELECTION_SOCKET,
  REGISTER_ROOM_DATA,
  SEND_ROOM_DATA_REQUEST,
  CLEAR_ROOM_DATA,
  CLOSE_ROOM_SELECTION_SOCKET
} from '../../room/modules';

/**
 * Configuration for actions related to WebSocket connection. There's type
 * check for each value and any WebSocket connections will be failed and an
 * error will be invoked if you put wrong types.
 *
 * key(str): an action to set up WebSocket(s). This action enables you to get
 *           access to data related to previous WebSocket connections and
 *           prepare for sending, receiving, and closing data.
 * value(array): an array which contains objects each of which describes one
 *               WebSocket to be set up.
 *
 * Contents of the object in the array are as follows:
 * close(str): an action to close WebSocket. The target WebSocket will be closed
 *             when this action is dispatched.
 * register(map): actions to register data from WebSocket. The data is in
 *                `action.payload` and its structure should be defined in the
 *                server side. Key is an id to distinguish actions and value is
 *                a name of an action.
 *                Expected data from server should be as follows:
 *                  `{'message': {'type': <key name>, ...}}`
 *                and value of `message` will be sent to reducer as data inside
 *                payload of the action.
 * send(map): an action to send data through WebSocket. Key is a name of an
 *            action and value is id to distinguish actions. The data to be sent
 *            should be in `action.payload` and the server side receives it as
 *            variable named `data`. Also, the valiable for key will be sent as
 *            `type`.
 * prepare(list, null): actions to change global state. Usually, thi is
 *                      expected to be used to clear data related to previous
 *                      WebSocket connections. Therefore, a reducer will receive
 *                      the action without any payload data. You don't have to
 *                      set an action if it's not necessary.
 * urlPaths(list): a list containing functions or strings used to create a
 *                 WebSocket url. If they are functions, they must take global
 *                 state as a parameter and return necessary variables from it.
 *                 The beginning of url is `ws://${window.location.host}/ws/`
 *                 and the values with `/` will be put at the bottom of url one
 *                 by one.
 */

const webSocketMap = {
  [SETUP_ROOM_SELECTION_SOCKET]: [
    {
      close: CLOSE_ROOM_SELECTION_SOCKET,
      register: {
        room_data: [REGISTER_ROOM_DATA]
      },
      send: {
        [SEND_ROOM_DATA_REQUEST]: 'room_data'
      },
      prepare: [CLEAR_ROOM_DATA],
      urlPaths: ['room_selection']
    }
  ],
  [SETUP_GAME_SOCKET]: [
    {
      close: CLOSE_GAME_SOCKET,
      register: {
        chat: [REGISTER_CHAT_INFO],
        parts: [REGISTER_NEXT_REVERSI_INFO, REGISTER_RESULT],
        reversi: [REGISTER_CONSISTENCY],
        start_game: [REGISTER_GAME_START_INFO],
        entering_member_data: [REGISTER_ENTERING_MEMBER_DATA],
        exiting_member_data: [REGISTER_EXITING_MEMBER_DATA],
        player_stone: [REGISTER_PLAYER_STONE]
      },
      send: {
        [SEND_CHAT_INFO]: 'chat',
        [SEND_NEXT_REVERSI_INFO]: 'parts',
        [SEND_CONSISTENCY]: 'reversi'
      },
      prepare: [
        CLEAR_CHAT_INFO,
        CLEAR_NEXT_REVERSI_POSITION,
        CLEAR_CONSISTENCY,
        CLEAR_GAME_START_INFO,
        CLEAR_INFORMATION,
        CLEAR_RESULT
      ],
      urlPaths: ['game', state => state.room.room.currentRoomInfo.roomId]
    }
  ]
};

export default webSocketMap;
