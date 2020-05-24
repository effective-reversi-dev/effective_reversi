import shortid from 'shortid';
import { handleActions, createActions } from 'redux-actions';

// WebSocket Management for chat
export const REGISTER_ENTERING_MEMBER_DATA = 'REGISTER_ENTERING_MEMBER_DATA'; // with Saga
export const REGISTER_EXITING_MEMBER_DATA = 'REGISTER_EXITING_MEMBER_DATA'; // with Saga
export const REGISTER_PLAYER_STONE = 'REGISTER_PLAYER_STONE'; // with Saga
export const REGISTER_LOG_MESSAGE = 'REGISTER_LOG_MESSAGE'; // with Saga
export const CLEAR_INFORMATION = 'CLEAR_INFORMATION'; // with Saga

export const informationActions = createActions(
  REGISTER_ENTERING_MEMBER_DATA,
  REGISTER_EXITING_MEMBER_DATA,
  REGISTER_PLAYER_STONE,
  REGISTER_LOG_MESSAGE,
  CLEAR_INFORMATION
);

const attributeToDisplayString = {
  wh: '○',
  bl: '●',
  un: '対戦待ち',
  sp: '観戦者'
};

const initialState = {
  information: [] // list の list. 情報タブの一つのバルーンの中の各段落をネストされた list で表現.
};

const createCurrentMemberMessages = members => {
  const messages = ['現在の参加者。'];
  members.forEach(member => {
    const name = member.displayName;
    const attribute = attributeToDisplayString[member.attribute];
    messages.push(`${name}: ${attribute}`);
  });
  return messages;
};

export default handleActions(
  {
    [informationActions.registerEnteringMemberData]: (state, action) => {
      const messages1 = [`${action.payload.additional} さんが入室しました。`];
      const messages2 = createCurrentMemberMessages(action.payload.members);
      return Object.assign({}, state, {
        information: state.information.concat([
          {
            messages: messages1,
            id: shortid.generate()
          },
          {
            messages: messages2,
            id: shortid.generate()
          }
        ])
      });
    },
    [informationActions.registerExitingMemberData]: (state, action) => {
      const messages1 = [
        `${action.payload.leftUser.displayName} さんが退出しました。`
      ];
      const messages2 = createCurrentMemberMessages(action.payload.members);
      return Object.assign({}, state, {
        information: state.information.concat([
          {
            messages: messages1,
            id: shortid.generate()
          },
          {
            messages: messages2,
            id: shortid.generate()
          }
        ])
      });
    },
    [informationActions.registerPlayerStone]: (state, action) => {
      const messages = [`ゲームを開始しました。`];
      messages.push(
        `${attributeToDisplayString.bl}: ${action.payload.blackDisplayName}`
      );
      messages.push(
        `${attributeToDisplayString.wh}: ${action.payload.whiteDisplayName}`
      );
      return Object.assign({}, state, {
        information: state.information.concat([
          {
            messages,
            id: shortid.generate()
          }
        ])
      });
    },
    [informationActions.registerLogMessage]: (state, action) => {
      const messages = [action.payload.logMessage];
      return Object.assign({}, state, {
        information: state.information.concat([
          {
            messages,
            id: shortid.generate()
          }
        ])
      });
    },
    [informationActions.clearInformation]: state => {
      return Object.assign({}, state, { information: [] });
    }
  },
  initialState
);
