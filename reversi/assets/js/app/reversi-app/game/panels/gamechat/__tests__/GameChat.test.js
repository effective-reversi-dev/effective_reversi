import moment from 'moment';
import 'moment-timezone';
import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';

import renderWithRedux from '../../../../api/test/utils';
import GameChatContainer, { mapDispatchToProps } from '../containers/GameChat';
import GameChatComponent from '../components/GameChat';
import { SEND_CHAT_INFO } from '../modules';

afterEach(cleanup);

describe('testing Chat', () => {
  const userName = 'test user';
  const message = 'test message';
  const time = '10:00';
  const chatInfo = [{ userName, message, time }];
  const setupComponent = props => {
    const initialState = {
      game: {
        panels: {
          chat: {
            chatInfo
          }
        }
      }
    };
    return Object.assign(
      {},
      renderWithRedux(<GameChatContainer {...props} />, { initialState })
    );
  };

  test('should render a chat information received through WebSocket', () => {
    const { getByText } = setupComponent();
    getByText(userName);
    getByText(message);
    getByText(time);
  });

  test('should send a message and should not close WebSocket after submitting it', () => {
    const props = {
      chatInfo,
      onSendChatInfo: jest.fn(),
      closeChatSocket: jest.fn()
    };
    const { getByText, getByPlaceholderText } = render(
      <GameChatComponent {...props} />
    );
    fireEvent.change(getByPlaceholderText('Input message...'), {
      target: { value: message }
    });
    fireEvent.click(getByText('送信'));
    expect(props.onSendChatInfo).toHaveBeenCalledWith(message);
    expect(props.closeChatSocket).not.toHaveBeenCalled();
  });

  test('should send message and time at container level', () => {
    const dispatch = jest.fn();
    const now = moment()
      .tz('Asia/Tokyo')
      .format('HH:mm');
    mapDispatchToProps(dispatch).onSendChatInfo(message);
    expect(dispatch).toHaveBeenCalledWith({
      payload: {
        message,
        now
      },
      type: SEND_CHAT_INFO
    });
  });
});
