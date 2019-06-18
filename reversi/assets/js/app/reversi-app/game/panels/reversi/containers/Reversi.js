import { connect } from 'react-redux';

import Reversi from '../components/Reversi';
import { setReversiSituation } from '../../../parts/modules';
import { BLACK, WHITE } from '../constants';

const mapDispatchToProps = dispatch => ({
  setReversiSituation: (nextReversiState, nextColor) => {
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
    dispatch(setReversiSituation(blackNum, whiteNum, nextColor));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(Reversi);
