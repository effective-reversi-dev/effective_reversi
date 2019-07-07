import { connect } from 'react-redux';

import Reversi from '../components/Reversi';
import { panelActions, setReversiSituation } from '../../../parts/modules';
import { BLACK, WHITE } from '../constants';

const { sendNextReversiPosition } = panelActions;

const mapStateToProps = state => ({
  nextReversiPosition: state.game.parts.nextReversiPosition
});

const mapDispatchToProps = dispatch => ({
  sendNextPosition: (rowIdx, colIdx, nextColor) => {
    dispatch(sendNextReversiPosition({ rowIdx, colIdx, nextColor }));
  },
  setReversiSituation: nextReversiState => {
    let blackNum = 0,
      whiteNum = 0;
    nextReversiState.forEach(rowState => {
      rowState.forEach(squareState => {
        if (squareState === BLACK) {
          blackNum += 1;
        } else if (squareState === WHITE) {
          whiteNum += 1;
        }
      });
    });
    dispatch(setReversiSituation(blackNum, whiteNum));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reversi);
