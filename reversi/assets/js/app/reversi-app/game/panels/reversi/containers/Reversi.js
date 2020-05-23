import { connect } from 'react-redux';

import Reversi from '../components/Reversi';
import { panelActions as partsPanelActions } from '../../../parts/modules';
import { panelActions as reversiPanelActions } from '../../reversi/modules';
import { gameActions } from '../../../modules';
import { BLACK, WHITE } from '../constants';
import { countStoneNum } from '../utils';

const { sendNextReversiInfo } = partsPanelActions;
const { sendConsistency } = reversiPanelActions;
const { displayExitDialog } = gameActions;

const mapStateToProps = state => {
  const {
    nextReversiPosition,
    nextReversiState,
    playerInfo,
    result
  } = state.game.parts;
  const { nextColor } = state.game.parts.gameSituation;
  const { consistency } = state.game.panels.reversi;
  const { userName } = state.userInfo.userInfo;
  const { whiteUserName, blackUserName } = playerInfo;
  const isGameOver = [BLACK, WHITE].includes(result);
  const isMyTurn =
    (nextColor === BLACK && blackUserName === userName && !isGameOver) ||
    (nextColor === WHITE && whiteUserName === userName && !isGameOver);

  return {
    nextReversiPosition,
    nextColor,
    consistency,
    nextReversiState,
    isMyTurn
  };
};

const mapDispatchToProps = dispatch => ({
  sendNextState: (nextReversiState, nextColor, rowIdx, colIdx) => {
    const [blackNum, whiteNum] = countStoneNum(nextReversiState);
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
