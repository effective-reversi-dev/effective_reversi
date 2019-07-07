import { connect } from 'react-redux';
import { panelActions } from '../modules';
import GameGoldenLayout from '../components/GameGoldenLayout';

const {
  closeGameSocket,
  removePanel,
  registerOpenPanel,
  setupGameSocket
} = panelActions;

const mapStateToProps = state => ({
  panelNames: Object.keys(state.game.parts.panelsOpen),
  addedPanel: state.game.parts.addedPanel
});

const mapDispatchToProps = dispatch => ({
  closeGameSocket: () => {
    dispatch(closeGameSocket());
  },
  initChatSocket: () => {
    dispatch(setupGameSocket());
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
