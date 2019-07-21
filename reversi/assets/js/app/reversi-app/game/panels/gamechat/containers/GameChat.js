import moment from 'moment';
import 'moment-timezone';
import { connect } from 'react-redux';
import { chatActions } from '../modules';
import GameChat from '../components/GameChat';

const { sendChatInfo } = chatActions;

const mapStateToProps = state => {
  const { chatInfo } = state.game.panels.chat;
  return { chatInfo };
};

export const mapDispatchToProps = dispatch => ({
  onSendChatInfo: chatMessage => {
    const time = moment()
      .tz('Asia/Tokyo')
      .format('HH:mm');
    dispatch(sendChatInfo({ message: chatMessage, time }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameChat);
