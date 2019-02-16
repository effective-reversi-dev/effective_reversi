import { connect } from 'react-redux';
import chatActions from '../../actions/chatSocket';
import GameChat from '../../components/game-components/GameChat';

const { sendChatInfo } = chatActions;

const mapStateToProps = state => ({
    chatInfo: state.chat.chatInfo,
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
