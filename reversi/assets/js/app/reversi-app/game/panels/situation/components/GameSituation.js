import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { GRID_NUM, BLACK, EMPTY } from '../../reversi/constants';
import { S3URL, REV_URL } from '../constants';

export default function GameSituation(props) {
  const {
    nextColor,
    blackNum,
    whiteNum,
    isSpectator,
    gameStart,
    roomId
  } = props;
  const AUDIO_REV = (
    <audio controls className="audio">
      <source src={S3URL + REV_URL} type="audio/mpeg" />
      音声ファイルは開けません
    </audio>
  );
  if (nextColor === EMPTY) {
    // game not started yet
    return (
      <React.Fragment>
        <div className="upper-items">
          <Grid container justify="center" alignItems="flex-start">
            <Grid item xs={6} sm={3}>
              <Button
                variant="contained"
                color="primary"
                disabled={isSpectator}
                onClick={() => {
                  gameStart(roomId);
                }}
              >
                ゲーム開始！
              </Button>
            </Grid>
          </Grid>
        </div>
        {AUDIO_REV}
      </React.Fragment>
    );
  }
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
      {AUDIO_REV}
    </React.Fragment>
  );
}

GameSituation.propTypes = {
  nextColor: PropTypes.string.isRequired,
  blackNum: PropTypes.number.isRequired,
  whiteNum: PropTypes.number.isRequired,
  isSpectator: PropTypes.bool.isRequired,
  roomId: PropTypes.number.isRequired,
  gameStart: PropTypes.func.isRequired
};
