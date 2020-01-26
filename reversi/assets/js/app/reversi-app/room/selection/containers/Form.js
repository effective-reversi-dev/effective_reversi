import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { roomActions } from '../../modules';
import Form from '../components/Form';

const {
  resolveRoomData,
  setupRoomSelectionSocket,
  closeRoomSelectionSocket,
  enterRoom,
  exitRoom,
  clearEnterRoomRequestStatus
} = roomActions;

const mapStateToProps = state => ({
  fetchRoomResponse: state.room.room.fetchRoomResponse,
  enterRoomResponse: state.room.room.enterRoomResponse
});

const mapDispatchToProps = dispatch => ({
  resolveInitialRoomData: () => {
    dispatch(resolveRoomData());
  },
  initializeRoomSelectionSocket: () => {
    dispatch(setupRoomSelectionSocket());
  },
  closeRoomSelectionSocket: () => {
    dispatch(closeRoomSelectionSocket());
  },
  enterRoom: roomInfo => {
    dispatch(enterRoom(roomInfo));
  },
  resetBelongingRoomInfo: () => {
    dispatch(exitRoom());
  },
  clearEnterRoomRequestStatus: () => {
    dispatch(clearEnterRoomRequestStatus());
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form)
);
