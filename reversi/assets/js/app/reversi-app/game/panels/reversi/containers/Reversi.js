import { connect } from 'react-redux';

import Reversi from '../components/Reversi';
import { panelActions as partsPanelActions } from '../../../parts/modules';
import { panelActions as reversiPanelActions } from '../../reversi/modules';
import { gameActions } from '../../../modules';
import { BLACK, WHITE } from '../constants';

const { sendNextReversiInfo } = partsPanelActions;
const { sendConsistency } = reversiPanelActions;
const { displayExitDialog } = gameActions;

const mapStateToProps = state => {
  const { nextReversiPosition, nextReversiState } = state.game.parts;
  const { nextColor } = state.game.parts.gameSituation;
  const { consistency } = state.game.panels.reversi;
  return { nextReversiPosition, nextColor, consistency, nextReversiState };
};

const mapDispatchToProps = dispatch => ({
  sendNextState: (nextReversiState, nextColor, rowIdx, colIdx) => {
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
    dispatch(
      sendNextReversiInfo({
        blackNum,
        whiteNum,
        nextColor,
        rowIdx,
        colIdx,
        nextReversiState
      })
    );
  },
  sendConsistency: consistency => {
    dispatch(sendConsistency(consistency));
  },
  displayExitDialog: () => {
    dispatch(
      displayExitDialog({
        exitTitle: 'エラー',
        exitDescription:
          'データに不整合が検出されました。恐れ入りますが、部屋から退出してください（勝負はノーカウントになります）。',
        shouldDisplayCancel: false
      })
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reversi);
