import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import { resizeBoard } from '../../../parts/utils/glEventManager';
import { EMPTY, BLACK, WHITE, INIT_REVERSI_STATE } from '../constants';
import {
  validateNextReversiState,
  placeStone,
  getOpponentStoneColor,
  canFlipStones
} from '../utils';

export default function Reversi(props) {
  /* states */
  const [reversiState, setReversiState] = useState(INIT_REVERSI_STATE);
  const [myColor, setMyColor] = useState(BLACK);

  /* effects */
  useEffect(() => {
    resizeBoard(props.glContainer);
    return undefined;
  }, []);

  useEffect(() => {
    const { rowIdx, colIdx } = props.nextReversiPosition;
    if (rowIdx === null && colIdx === null) {
      // initially do nothing
      return undefined;
    }
    const consistency = validateNextReversiState(
      reversiState,
      rowIdx,
      colIdx,
      myColor,
      props.nextReversiState
    );
    if (!consistency) {
      props.sendConsistency(false);
      return undefined;
    }
    setReversiState(props.nextReversiState);
    setMyColor(props.nextColor);
    return undefined;
  }, [props.nextReversiPosition]);

  useEffect(() => {
    if (!props.consistency) {
      props.displayExitDialog();
    }
  }, [props.consistency]);

  /* actions */
  const changeColumnState = rowIdx => colIdx => {
    const nextReversiState = placeStone(
      JSON.parse(JSON.stringify(reversiState)),
      myColor,
      [rowIdx, colIdx]
    );
    if (JSON.stringify(nextReversiState) === JSON.stringify(reversiState))
      return;
    let nextColor = getOpponentStoneColor(myColor);
    if (!canFlipStones(nextReversiState, nextColor)) {
      // pass my turn
      nextColor = getOpponentStoneColor(nextColor);
    }
    props.sendNextState(nextReversiState, nextColor, rowIdx, colIdx);
  };

  return (
    <div id="board" className="board">
      {reversiState.map((columnState, idx) => (
        <Column
          columnState={columnState}
          changeColumnState={changeColumnState(idx)}
          disableClickEvent={!props.isMyTurn}
          key={uuid()}
        />
      ))}
    </div>
  );
}

Reversi.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  glContainer: PropTypes.object.isRequired,
  sendConsistency: PropTypes.func.isRequired,
  sendNextState: PropTypes.func.isRequired,
  displayExitDialog: PropTypes.func.isRequired,
  nextReversiPosition: PropTypes.shape({
    colIdx: PropTypes.number,
    rowIdx: PropTypes.number
  }).isRequired,
  nextColor: PropTypes.string.isRequired,
  nextReversiState: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
  consistency: PropTypes.bool.isRequired,
  isMyTurn: PropTypes.bool.isRequired
};

function Column(props) {
  const changeSquareState = idx => () => {
    props.changeColumnState(idx);
  };
  return (
    <div className="column">
      {props.columnState.map((squareState, idx) => (
        <Square
          squareState={squareState}
          changeSquareState={changeSquareState(idx)}
          disableClickEvent={props.disableClickEvent}
          key={uuid()}
        />
      ))}
    </div>
  );
}

Column.propTypes = {
  columnState: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeColumnState: PropTypes.func.isRequired,
  disableClickEvent: PropTypes.bool.isRequired
};

function Square(props) {
  switch (props.squareState) {
    case BLACK:
      return (
        <button className="square">
          <div className={BLACK} />
        </button>
      );
    case WHITE:
      return (
        <button className="square">
          <div className={WHITE} />
        </button>
      );
    default:
      return (
        <button
          className="square"
          onClick={props.disableClickEvent ? null : props.changeSquareState}
        >
          <div className={EMPTY} />
        </button>
      );
  }
}

Square.propTypes = {
  squareState: PropTypes.string.isRequired,
  changeSquareState: PropTypes.func.isRequired,
  disableClickEvent: PropTypes.bool.isRequired
};
