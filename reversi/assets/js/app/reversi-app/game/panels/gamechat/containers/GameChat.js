import { connect } from 'react-redux';
import { chatActions } from '../modules';
import { minutesWithZero } from '../../../../api/websocket/utils';
import GameChat from '../components/GameChat';

const { sendChatInfo, closeChatSocket } = chatActions;

const mapStateToProps = state => ({
    chatInfo: state.game.panels.chat.chatInfo,
});

export const mapDispatchToProps = dispatch => ({
    closeChatSocket: () => {
        dispatch(closeChatSocket());
    },
    onSendChatInfo: chatMessage => {
        const now = new Date();
        const time = now.getHours() + ':' + minutesWithZero(now.getMinutes());
        dispatch(sendChatInfo({ message: chatMessage, time: time }));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameChat);
