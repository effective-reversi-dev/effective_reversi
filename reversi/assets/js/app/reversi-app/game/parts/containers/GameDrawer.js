import { connect } from 'react-redux';
import { panelActions } from '../modules';
import GameDrawer from '../components/GameDrawer';

const { addPanel } = panelActions;

const mapStateToProps = state => ({
    panelsOpen: state.game.parts.panelsOpen,
});

const mapDispatchToProps = dispatch => ({
    onAddPanel: panel => {
        dispatch(addPanel(panel));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameDrawer);
