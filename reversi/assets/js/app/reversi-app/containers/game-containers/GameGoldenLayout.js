import { connect } from 'react-redux';
import panelActions from '../../actions/gamePanels';
import chatActions from '../../actions/chatSocket';
import GameGoldenLayout from '../../components/game-components/GameGoldenLayout';

const { removePanel, registerOpenPanel } = panelActions;
const { setupSocket, closeChatSocket } = chatActions;

const mapStateToProps = state => ({
    panelNames: Object.keys(state.panels.panelsOpen),
    addedPanel: state.panels.addedPanel,
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
