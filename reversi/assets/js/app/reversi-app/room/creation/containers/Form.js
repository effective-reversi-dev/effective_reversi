import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { roomActions } from '../../modules';
import Form from '../components/Form';

const { createRoom, clearCreateRoomRequestStatus } = roomActions;

const mapStateToProps = state => ({
  requestStatus: state.room.room.createRoomResponse
});

const mapDispatchToProps = dispatch => ({
  onSendCreateRoom: roomInfo => {
    dispatch(createRoom(roomInfo));
  },
  initializeState: () => {
    dispatch(clearCreateRoomRequestStatus());
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form)
);
