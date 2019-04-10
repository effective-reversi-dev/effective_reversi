import moment from 'moment';
import 'moment-timezone';
import { connect } from 'react-redux';
import { chatActions } from '../modules';
import GameChat from '../components/GameChat';

const { sendChatInfo, closeChatSocket } = chatActions;

const mapStateToProps = state => ({
  chatInfo: state.game.panels.chat.chatInfo
});

export const mapDispatchToProps = dispatch => ({
  closeChatSocket: () => {
    dispatch(closeChatSocket());
  },
  onSendChatInfo: chatMessage => {
    const time = moment()
      .tz('Asia/Tokyo')
      .format('HH:mm');
    dispatch(sendChatInfo({ message: chatMessage, time: time }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameChat);
