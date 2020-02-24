import { connect } from 'react-redux';
import GameInfo from '../components/GameInfo';

const mapStateToProps = state => {
  const { information } = state.game.panels.information;
  return { information };
};

export default connect(mapStateToProps)(GameInfo);
