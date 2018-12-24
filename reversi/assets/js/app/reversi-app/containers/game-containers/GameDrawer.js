import { connect } from 'react-redux';
import panelActions from '../../actions/gamePanels';
import GameDrawer from '../../components/game-components/GameDrawer';

const { addPanel, removeAll } = panelActions;

const mapStateToProps = state => ({
    panelNames: state.panels.panelNames,
});

const mapDispatchToProps = dispatch => ({
    onAddPanel: panel => {
        dispatch(addPanel(panel));
    },
    shouldRemoveAll: shouldRemoveAll => {
        dispatch(removeAll(shouldRemoveAll));
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameDrawer);
