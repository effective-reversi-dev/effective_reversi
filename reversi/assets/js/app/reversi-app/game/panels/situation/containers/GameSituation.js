import { connect } from 'react-redux';

import { panelActions } from '../../../parts/modules';
import GameSituation from '../components/GameSituation';

const { startGame } = panelActions;

const mapStateToProps = state => {
  const { nextColor, blackNum, whiteNum } = state.game.parts.gameSituation;
  const { isSpectator, roomId } = state.room.room.currentRoomInfo;
  return { nextColor, blackNum, whiteNum, isSpectator, roomId };
};

const mapDispatchToProps = dispatch => ({
  gameStart: roomId => {
    dispatch(startGame({ roomId }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameSituation);
