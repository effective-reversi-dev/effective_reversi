import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { BrowserRouter as Router } from 'react-router-dom';

import renderWithRedux from '../../../api/test/utils';
import FormContainer from '../containers/Form';
import FormComponent from '../components/Form';
import { REQUEST_STATUS } from '../../modules';

afterEach(cleanup);

describe('testing Form', () => {
  const placeholder1 = '部屋名';
  const placeholder2 = '観戦者定員';
  const placeholder3 = 'パスワード';
  const history = {
    push: jest.fn()
  };
  const createRoomResponse = {
    status: REQUEST_STATUS.READY,
    errMsg: null
  };
  const setupComponent = props => {
    const initialState = {
      room: {
        room: {
          createRoomResponse
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

  test('表示されているべきフォーム。', () => {
    const { getByPlaceholderText } = setupComponent();
    getByPlaceholderText(placeholder1);
    getByPlaceholderText(placeholder2);
    getByPlaceholderText(placeholder3);
  });

  test('部屋名がブランクの時、作成しようとすると警告が出る。', () => {
    const props = {
      history,
      requestStatus: createRoomResponse,
      onSendCreateRoom: jest.fn(),
      initializeState: jest.fn()
    };
    const { getByText } = render(
      <Router>
        <FormComponent {...props} />
      </Router>
    );
    fireEvent.click(getByText('部屋を作成'));
    getByText('部屋名が入力されていません。');
    expect(props.initializeState).toHaveBeenCalled();
    expect(props.onSendCreateRoom).not.toHaveBeenCalled();
  });

  test('観戦者定員がブランクの時、  作成しようとすると警告が出る。', () => {
    const props = {
      history,
      requestStatus: createRoomResponse,
      onSendCreateRoom: jest.fn(),
      initializeState: jest.fn()
    };
    const { getByText, getByPlaceholderText } = render(
      <Router>
        <FormComponent {...props} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText(placeholder1), {
      target: { value: 'test' }
    });
    fireEvent.click(getByText('部屋を作成'));
    getByText('観戦者定員が入力されていません。');
    expect(props.initializeState).toHaveBeenCalled();
    expect(props.onSendCreateRoom).not.toHaveBeenCalled();
  });

  test('観戦者定員に負の数・小数は指定の時、作成しようとすると警告が出る。', () => {
    const props = {
      history,
      requestStatus: createRoomResponse,
      onSendCreateRoom: jest.fn(),
      initializeState: jest.fn()
    };
    const { getByText, getByPlaceholderText } = render(
      <Router>
        <FormComponent {...props} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText(placeholder1), {
      target: { value: 'test' }
    });
    fireEvent.change(getByPlaceholderText(placeholder2), {
      target: { value: '1.5' }
    });
    fireEvent.click(getByText('部屋を作成'));
    getByText('観戦者定員に負の数・小数は指定できません。');
    fireEvent.change(getByPlaceholderText(placeholder2), {
      target: { value: '-1' }
    });
    fireEvent.click(getByText('部屋を作成'));
    getByText('観戦者定員に負の数・小数は指定できません。');
    expect(props.initializeState).toHaveBeenCalled();
    expect(props.onSendCreateRoom).not.toHaveBeenCalled();
  });

  test('正常系', () => {
    const props = {
      history,
      requestStatus: createRoomResponse,
      onSendCreateRoom: jest.fn(),
      initializeState: jest.fn()
    };
    const { getByText, getByPlaceholderText } = render(
      <Router>
        <FormComponent {...props} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText(placeholder1), {
      target: { value: 'test' }
    });
    fireEvent.change(getByPlaceholderText(placeholder2), {
      target: { value: '2' }
    });
    fireEvent.click(getByText('部屋を作成'));
    expect(props.initializeState).toHaveBeenCalled();
    expect(props.onSendCreateRoom).toHaveBeenCalledWith({
      roomName: 'test',
      maxSpectator: '2',
      password: '',
      isSpectator: false
    });
  });
  // TODO checkboxをchangeできていない。そのせいでcheckboxの挙動だけテストできていない。
});
