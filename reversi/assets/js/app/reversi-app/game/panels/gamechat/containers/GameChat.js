import { connect } from 'react-redux';
import { chatActions } from '../modules';
import GameChat from '../components/GameChat';

const { sendChatInfo } = chatActions;

const mapStateToProps = state => ({
    chatInfo: state.game.panels.chat.chatInfo,
});

const mapDispatchToProps = dispatch => ({
    onSendChatInfo: (chatMessage) => {
        dispatch(sendChatInfo(chatMessage));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameChat);
