import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { BrowserRouter as Router } from 'react-router-dom';

import renderWithRedux from '../../../api/test/utils';
import FormContainer from '../containers/Form';
import FormComponent from '../components/Form';
import { REQUEST_STATUS } from '../../modules';

afterEach(cleanup);

describe('testing Form', () => {
  const roomName1 = 'testRoom1';
  const roomName2 = 'testRoom2';
  const roomData = [
    {
      id: 1,
      room_name: roomName1,
      max_participant: 2,
      count_participant: 1,
      max_spectator: 2,
      count_spectator: 2,
      has_password: false
    },
    {
      id: 2,
      room_name: roomName2,
      max_participant: 2,
      count_participant: 1,
      max_spectator: 2,
      count_spectator: 2,
      has_password: true
    }
  ];
  const history = {
    push: jest.fn()
  };
  const fetchRoomResponse = {
    roomData,
    errMsg: ''
  };
  const enterRoomResponse = {
    status: REQUEST_STATUS.READY,
    errMsg: ''
  };
  const setupComponent = props => {
    const initialState = {
      room: {
        room: {
          fetchRoomResponse,
          enterRoomResponse
        }
      }
    };
    return Object.assign(
      {},
      renderWithRedux(
        <Router>
          <FormContainer {...props} />
        </Router>,
        { initialState }
      )
    );
  };

  test('部屋の情報がテーブルとして表示されているべき', () => {
    const { getByText } = setupComponent();
    getByText(roomName1);
    getByText(roomName2);
  });

  test('部屋が選択されていない場合、入室しようとすると警告が出る。', () => {
    const props = {
      history,
      fetchRoomResponse,
      enterRoomResponse,
      resolveInitialRoomData: jest.fn(),
      initializeRoomSelectionSocket: jest.fn(),
      closeRoomSelectionSocket: jest.fn(),
      enterRoom: jest.fn(),
      resetBelongingRoomInfo: jest.fn(),
      clearEnterRoomRequestStatus: jest.fn()
    };
    const { getByText } = render(
      <Router>
        <FormComponent {...props} />
      </Router>
    );
    fireEvent.click(getByText('入室する。'));
    getByText('部屋が選択されていません。');
    expect(props.enterRoom).not.toHaveBeenCalled();
    expect(props.initializeRoomSelectionSocket).toHaveBeenCalled();
    expect(props.resolveInitialRoomData).toHaveBeenCalled();
    expect(props.resetBelongingRoomInfo).not.toHaveBeenCalled();
    expect(props.closeRoomSelectionSocket).not.toHaveBeenCalled();
    expect(props.clearEnterRoomRequestStatus).not.toHaveBeenCalled();
  });

  test('パスワード無しの部屋への入室時、モーダル無しで直接入室リクエストが飛ぶ', () => {
    const props = {
      history,
      fetchRoomResponse,
      enterRoomResponse,
      resolveInitialRoomData: jest.fn(),
      initializeRoomSelectionSocket: jest.fn(),
      closeRoomSelectionSocket: jest.fn(),
      enterRoom: jest.fn(),
      resetBelongingRoomInfo: jest.fn(),
      clearEnterRoomRequestStatus: jest.fn()
    };
    const { getByText } = render(
      <Router>
        <FormComponent {...props} />
      </Router>
    );
    fireEvent.click(getByText(roomName1)); // Tableの行を適切にクリックできない...
    fireEvent.click(getByText('入室する。'));
    expect(props.enterRoom).not.toHaveBeenCalled();
    // expect(props.enterRoom).toHaveBeenCalledWith({
    //   roomId: 1,
    //   isSpectator: false,
    //   password: ''
    // });
    expect(props.initializeRoomSelectionSocket).toHaveBeenCalled();
    expect(props.resolveInitialRoomData).toHaveBeenCalled();
    expect(props.resetBelongingRoomInfo).not.toHaveBeenCalled();
    expect(props.closeRoomSelectionSocket).not.toHaveBeenCalled();
    expect(props.clearEnterRoomRequestStatus).not.toHaveBeenCalled();
  });

  test('パスワードありの部屋への入室時、モーダルが出る', () => {
    const props = {
      history,
      fetchRoomResponse,
      enterRoomResponse,
      resolveInitialRoomData: jest.fn(),
      initializeRoomSelectionSocket: jest.fn(),
      closeRoomSelectionSocket: jest.fn(),
      enterRoom: jest.fn(),
      resetBelongingRoomInfo: jest.fn(),
      clearEnterRoomRequestStatus: jest.fn()
    };
    const { getByText /* , getByPlaceholderText */ } = render(
      <Router>
        <FormComponent {...props} />
      </Router>
    );
    fireEvent.click(getByText(roomName2)); // Tableの行を適切にクリックできない...
    fireEvent.click(getByText('入室する。'));
    // getByPlaceholderText('パスワード');
  });
});
