import {
  SETUP_GAME_SOCKET,
  CLOSE_GAME_SOCKET,
  REGISTER_NEXT_REVERSI_INFO,
  CLEAR_NEXT_REVERSI_POSITION,
  SEND_NEXT_REVERSI_INFO
} from '../../game/parts/modules';
import {
  REGISTER_CHAT_INFO,
  SEND_CHAT_INFO,
  CLEAR_CHAT_INFO
} from '../../game/panels/gamechat/modules';
import {
  REGISTER_CONSISTENCY,
  SEND_CONSISTENCY,
  CLEAR_CONSISTENCY
} from '../../game/panels/reversi/modules';

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
 * register(map): an action to register data from WebSocket. The data is in
 *                `action.payload` and its structure should be defined in the
 *                server side. Key is an id to distinguish actions and value is
 *                a name of an action.
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
  [SETUP_GAME_SOCKET]: [
    {
      close: CLOSE_GAME_SOCKET,
      register: {
        chat: REGISTER_CHAT_INFO,
        parts: REGISTER_NEXT_REVERSI_INFO,
        reversi: REGISTER_CONSISTENCY
      },
      send: {
        [SEND_CHAT_INFO]: 'chat',
        [SEND_NEXT_REVERSI_INFO]: 'parts',
        [SEND_CONSISTENCY]: 'reversi'
      },
      prepare: [
        CLEAR_CHAT_INFO,
        CLEAR_NEXT_REVERSI_POSITION,
        CLEAR_CONSISTENCY
      ],
      urlPaths: ['game', state => state.game.parts.roomName]
    }
  ]
};

export default webSocketMap;
