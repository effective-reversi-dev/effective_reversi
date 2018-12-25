import { connect } from 'react-redux';
import panelActions from '../../actions/gamePanels';
import GameDrawer from '../../components/game-components/GameDrawer';

const { addPanel } = panelActions;

const mapStateToProps = state => ({
    panelNames: state.panels.panelNames,
});

const mapDispatchToProps = dispatch => ({
    onAddPanel: panel => {
        dispatch(addPanel(panel));
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameDrawer);
