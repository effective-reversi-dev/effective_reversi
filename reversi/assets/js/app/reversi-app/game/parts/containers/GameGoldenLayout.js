import { connect } from 'react-redux';
import { panelActions } from '../modules';
import GameGoldenLayout from '../components/GameGoldenLayout';

const { removePanel, registerOpenPanel, setupGameSocket } = panelActions;

const mapStateToProps = state => ({
  panelNames: Object.keys(state.game.parts.panelsOpen),
  addedPanel: state.game.parts.addedPanel
});

const mapDispatchToProps = dispatch => ({
  initChatSocket: () => {
    dispatch(setupGameSocket('chat'));
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
