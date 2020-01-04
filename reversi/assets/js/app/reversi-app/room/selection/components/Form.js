import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

import { REQUEST_STATUS } from '../../modules';
import { COLUMNS } from '../constants';

import Table from '../../../common/table/Table';
import PasswordModal from './PasswordModal';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.props.resolveInitialRoomData();
    this.props.initializeRoomSelectionSocket();
    this.onClickEnterButton = this.onClickEnterButton.bind(this);
    this.onClickResetButton = this.onClickResetButton.bind(this);
    this.presentRequestError = this.presentRequestError.bind(this);
    this.checkRequestStatus = this.checkRequestStatus.bind(this);
    this.findFromRoomData = this.findFromRoomData.bind(this);
    this.flipPasswordModal = this.flipPasswordModal.bind(this);
    this.enterWithPassword = this.enterWithPassword.bind(this);
    this.state = {
      selectedRowData: {},
      isSpectator: false,
      showAlert: false,
      isOpenPasswordModal: false
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
    // バリデ前に古いアラートをクリアしないと、
    // 一度出たアラートが画面に出続ける。
    this.setState({ showAlert: false });
    const roomData = this.findFromRoomData();
    // サーバ側のテーブルが壊れていない限りroomData.lengthは1以下。
    if (roomData.length === 1) {
      const roomDatum = roomData[0];
      if (!roomDatum.has_password) {
        this.props.clearEnterRoomRequestStatus();
        this.props.enterRoom({
          roomId: roomDatum.room_id,
          isSpectator: this.state.isSpectator,
          password: ''
        });
      } else {
        this.flipPasswordModal(true);
      }
    } else {
      this.setState({ showAlert: true });
    }
  }

  onClickResetButton() {
    this.props.resetBelongingRoomInfo();
  }

  // TODO onClicEnterButtonと一部共通化したい
  enterWithPassword(password) {
    this.setState({ showAlert: false });
    const roomData = this.findFromRoomData();
    // サーバ側のテーブルが壊れていない限りroomData.lengthは1以下。
    if (roomData.length === 1) {
      const roomDatum = roomData[0];
      this.props.clearEnterRoomRequestStatus();
      this.props.enterRoom({
        roomId: roomDatum.room_id,
        isSpectator: this.state.isSpectator,
        password
      });
    } else {
      this.setState({ showAlert: true });
    }
  }

  flipPasswordModal(open) {
    this.setState({ isOpenPasswordModal: open });
  }

  presentRequestError() {
    let errorMsg;
    if (this.props.enterRoomResponse.status === REQUEST_STATUS.FAIL) {
      errorMsg = this.props.enterRoomResponse.errMsg;
    } else if (this.props.fetchRoomResponse.errMsg) {
      errorMsg = this.props.fetchRoomResponse.errMsg;
    }
    return errorMsg ? (
      <div className="alert alert-danger">{errorMsg}</div>
    ) : (
      <div />
    );
  }

  checkRequestStatus() {
    if (this.props.enterRoomResponse.status === REQUEST_STATUS.SUCCESS) {
      this.props.history.push('/game');
    }
  }

  findFromRoomData() {
    const { roomData } = this.props.fetchRoomResponse;
    return Object.keys(this.state.selectedRowData).length !== 0
      ? roomData.filter(
          room => room.room_id === this.state.selectedRowData.room_id
        )
      : [];
  }

  render() {
    const { roomData } = this.props.fetchRoomResponse;
    return (
      <React.Fragment>
        <p>入室したい部屋を選んでください。</p>
        {this.presentRequestError()}
        {this.state.showAlert ? (
          <div className="alert alert-danger">部屋が選択されていません。</div>
        ) : null}
        <Table
          data={roomData}
          selectedRowData={this.state.selectedRowData}
          setSelectedRowData={selectedRowData => {
            this.setState({ selectedRowData });
          }}
          columns={COLUMNS}
        />
        <div className="form-group">
          観戦者モードで入室する。
          <Checkbox
            checked={this.state.isSpectator}
            onChange={e => {
              this.setState({ isSpectator: e.target.checked });
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
        <PasswordModal
          isOpenModal={this.state.isOpenPasswordModal}
          closeModal={() => this.flipPasswordModal(false)}
          submitPassword={this.enterWithPassword}
        />
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
