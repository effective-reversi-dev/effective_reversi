import React from 'react';
import PropTypes from 'prop-types';

import { GRID_NUM, BLACK } from '../../reversi/constants';

export default function GameSituation(props) {
  const { nextColor, blackNum, whiteNum } = props;
  let winner = null;
  const NUM_OF_SQUARES = GRID_NUM * GRID_NUM;
  if (blackNum + whiteNum === NUM_OF_SQUARES) {
    // filled with stones
    if (blackNum > NUM_OF_SQUARES / 2) {
      winner = <div>勝者： ●</div>;
    } else if (NUM_OF_SQUARES / 2 > blackNum) {
      winner = <div>勝者： ○</div>;
    } else {
      winner = <div>引き分け</div>;
    }
  } else if (blackNum === 0) {
    // all stones are white
    winner = <div>勝者： ○</div>;
  } else if (whiteNum === 0) {
    // all stones are black
    winner = <div>勝者： ●</div>;
  }
  return (
    <React.Fragment>
      <div>現在の手番： {nextColor === BLACK ? '●' : '○'}</div>
      <div>
        現在の状況： ● {blackNum} ○ {whiteNum}
      </div>
      {winner}
      <audio controls className="audio">
        <source
          src="http://cf-templates-hzxxytjjlf5s-ap-northeast-1.s3-website-ap-northeast-1.amazonaws.com/mp3/rev2007.mp3"
          type="audio/mpeg"
        />
        音声ファイルは開けません
      </audio>
    </React.Fragment>
  );
}

GameSituation.propTypes = {
  nextColor: PropTypes.string.isRequired,
  blackNum: PropTypes.number.isRequired,
  whiteNum: PropTypes.number.isRequired
};
