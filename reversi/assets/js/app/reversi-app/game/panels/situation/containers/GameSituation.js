import { connect } from 'react-redux';

import GameSituation from '../components/GameSituation';

const mapStateToProps = state => {
  const { nextColor, blackNum, whiteNum } = state.game.parts.gameSituation;
  return { nextColor, blackNum, whiteNum };
};

export default connect(mapStateToProps)(GameSituation);
