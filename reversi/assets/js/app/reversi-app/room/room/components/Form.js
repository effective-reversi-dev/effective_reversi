import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { REQUEST_STATUS } from '../../modules';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.props.resolveInitialRoomData();
    this.props.initializeRoomSelectionSocket();
    this.onClickEnterButton = this.onClickEnterButton.bind(this);
    this.onClickResetButton = this.onClickResetButton.bind(this);
    this.presentRequestError = this.presentRequestError.bind(this);
    this.presentFormError = this.presentFormError.bind(this);
    this.checkRequestStatus = this.checkRequestStatus.bind(this);
    this.findFromRoomData = this.findFromRoomData.bind(this);
    this.state = {
      inputForm: {
        roomName: '',
        isSpectator: false
      }
    };
  }

  componentDidUpdate() {
    this.checkRequestStatus();
  }

  componentWillUnmount() {
    this.props.closeRoomSelectionSocket();
    this.props.clearEnterRoomRequestStatus();
  }

  onClickEnterButton() {
    const roomData = this.findFromRoomData(this.state.inputForm.roomName);
    if (roomData.length !== 1) {
      return;
    }
    const roomId = roomData[0].room_id;
    this.props.enterRoom({
      roomId,
      isSpectator: this.state.inputForm.isSpectator
    });
  }

  onClickResetButton() {
    this.props.resetBelongingRoomInfo();
  }

  presentRequestError() {
    if (this.props.enterRoomResponse.status === REQUEST_STATUS.FAIL) {
      return (
        <div className="alert alert-danger">
          {this.props.enterRoomResponse.errMsg}
        </div>
      );
    }
    return <div />;
  }

  presentFormError() {
    if (this.findFromRoomData(this.state.inputForm.roomName).length !== 1) {
      return (
        <div className="alert alert-danger">
          部屋名の指定が正しくありません。
        </div>
      );
    }
    return <div />;
  }

  checkRequestStatus() {
    if (this.props.enterRoomResponse.status === REQUEST_STATUS.SUCCESS) {
      this.props.history.push('/game');
    }
  }

  findFromRoomData(roomName) {
    const { roomData } = this.props.fetchRoomResponse;
    return roomData.filter(room => room.room_name === roomName);
  }

  render() {
    const changeFormContents = changedContent => {
      this.setState(Object.assign(this.state.inputForm, changedContent));
    };
    const { roomData } = this.props.fetchRoomResponse;
    const { inputForm } = this.state;
    const header = () => {
      return (
        <tr>
          <th>部屋名</th>
          <th>対戦者定員</th>
          <th>対戦者入室数</th>
          <th>観戦者定員</th>
          <th>観戦者入室数</th>
        </tr>
      );
    };
    const items = roomData.map(data => {
      return (
        <tr key={data.room_id}>
          <td>{data.room_name}</td>
          <td>{data.max_participant}</td>
          <td>{data.count_participant}</td>
          <td>{data.max_spectator}</td>
          <td>{data.count_spectator}</td>
        </tr>
      );
    });
    return (
      <React.Fragment>
        <p>入室したい部屋を選んでください。</p>
        {this.presentRequestError()}
        {this.presentFormError()}
        {/* TODO 部屋はテーブルからクリックで選択できるようにしたい。 */}
        <table>
          <thead>{header()}</thead>
          <tbody>{items}</tbody>
        </table>
        <div className="form-group">
          <TextField
            value={inputForm.roomId}
            className="item"
            label="部屋名"
            onChange={e => {
              changeFormContents({ roomName: e.target.value });
            }}
            margin="normal"
          />
        </div>
        <div className="form-group">
          観戦者モードで入室する。
          <Checkbox
            checked={inputForm.isSpectator}
            onChange={e => {
              changeFormContents({ isSpectator: e.target.checked });
            }}
            value="観戦者"
            color="primary"
          />
        </div>
        <div>
          <Button
            variant="outlined"
            color="primary"
            className="button"
            onClick={this.onClickEnterButton}
          >
            入室する。
          </Button>
        </div>
        <div>
          <Button
            variant="outlined"
            color="primary"
            className="button"
            onClick={this.onClickResetButton}
          >
            入室状況をリセットする。
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

Form.propTypes = {
  fetchRoomResponse: PropTypes.shape({
    roomData: PropTypes.array,
    errMsg: PropTypes.string
  }).isRequired,
  enterRoomResponse: PropTypes.shape({
    status: PropTypes.string,
    errMsg: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  resolveInitialRoomData: PropTypes.func.isRequired,
  initializeRoomSelectionSocket: PropTypes.func.isRequired,
  closeRoomSelectionSocket: PropTypes.func.isRequired,
  enterRoom: PropTypes.func.isRequired,
  resetBelongingRoomInfo: PropTypes.func.isRequired,
  clearEnterRoomRequestStatus: PropTypes.func.isRequired
};
export default Form;
