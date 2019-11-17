import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

import { REQUEST_STATUS } from '../../modules';
import { COLUMNS } from '../constants';

import Table from '../../../common/table/Table';

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
    this.state = {
      selectedRowData: {},
      isSpectator: false,
      showAlert: false
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
    const roomData = this.findFromRoomData();
    if (roomData.length === 1) {
      this.props.enterRoom({
        roomId: roomData[0].room_id,
        isSpectator: this.state.isSpectator
      });
    } else {
      this.setState({ showAlert: true });
    }
  }

  onClickResetButton() {
    this.props.resetBelongingRoomInfo();
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
          <div className="alert alert-danger">部屋名を指定してください。</div>
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
