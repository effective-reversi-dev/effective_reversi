import { connect } from 'react-redux';
import GameGoldenLayout from '../../components/game-components/GameGoldenLayout';

const mapStateToProps = state => ({
    panelNames: state.panels.panelNames,
    addedPanel: state.panels.addedPanel,
});

export default connect(mapStateToProps)(GameGoldenLayout);
