import { connect } from 'react-redux';

import GameSituation from '../components/GameSituation';

const mapStateToProps = state => {
  const { nextReversiPosition, blackNum, whiteNum } = state.game.parts;
  return { nextColor: nextReversiPosition.nextColor, blackNum, whiteNum };
};

export default connect(mapStateToProps)(GameSituation);
