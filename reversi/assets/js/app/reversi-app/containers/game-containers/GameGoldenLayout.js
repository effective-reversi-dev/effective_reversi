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
    onRemoveItem: item => {
        if(item.config.component){ // to exclude item 'stack'
            dispatch(removePanel(item.config.component));
        }
    },
    onRegisterOpen: item => {
        if(item.config.component){
            dispatch(registerOpenPanel(item.config.component));
        }
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameGoldenLayout);
