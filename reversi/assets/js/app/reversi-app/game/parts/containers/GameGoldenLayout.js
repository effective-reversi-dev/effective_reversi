import { connect } from 'react-redux';
import { panelActions } from '../modules';
// TODO: change directory using webapi
import { chatActions } from '../../panels/gamechat/modules'; 
import GameGoldenLayout from '../components/GameGoldenLayout';

const { removePanel, registerOpenPanel } = panelActions;
const { setupSocket, closeChatSocket } = chatActions;

const mapStateToProps = state => ({
    panelNames: Object.keys(state.game.parts.panelsOpen),
    addedPanel: state.game.parts.addedPanel,
});

const mapDispatchToProps = dispatch => ({
    initChatSocket: () => {
        dispatch(setupSocket('chat'));
    },
    closeChatSocket: () => {
        dispatch(closeChatSocket());
    },
    onRemoveItem: panelName => {
        dispatch(removePanel(panelName));
    },
    onRegisterOpen: panelName => {
        dispatch(registerOpenPanel(panelName));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameGoldenLayout);
