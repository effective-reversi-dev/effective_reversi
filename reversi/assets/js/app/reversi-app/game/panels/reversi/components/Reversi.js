import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import { resizeBoard } from '../../../parts/utils/glEventManager';
import {
  GRID_NUM,
  EMPTY,
  BLACK,
  WHITE,
  NEXT_POSITION_FUNCS,
  INIT_REVERSI_STATE
} from '../constants';

const getOpponentColor = myColor => (myColor === BLACK ? WHITE : BLACK);

export const getLinearFlippedSquares = (
  reversiState,
  myColor,
  getNextPosition,
  position, // [rowIdx, colIdx]
  shouldDetect = false
) => {
  const squaresToFlip = [];
  let [nextRowIdx, nextColIdx] = getNextPosition(position);
  while (
    nextRowIdx >= 0 &&
    nextColIdx >= 0 &&
    GRID_NUM - 1 >= nextRowIdx &&
    GRID_NUM - 1 >= nextColIdx
  ) {
    const targetState = reversiState[nextRowIdx][nextColIdx];
    if (targetState === myColor) {
      // whether there are sandwitched squares
      if (squaresToFlip.length !== 0) {
        return shouldDetect ? true : squaresToFlip;
      }
      return shouldDetect ? false : [[]];
    } else if (targetState === EMPTY) {
      return shouldDetect ? false : [[]];
    }
    squaresToFlip.push([nextRowIdx, nextColIdx]);
    [nextRowIdx, nextColIdx] = getNextPosition([nextRowIdx, nextColIdx]);
  }
  return shouldDetect ? false : [[]]; // opponent's stones alongside aren't sandwitched
};

const hasNextStrategy = (reversiState, color) => {
  return reversiState.some((rowState, rowIdx) => {
    return rowState.some((squareState, colIdx) =>
      squareState === EMPTY
        ? NEXT_POSITION_FUNCS.some(getNextPosFunc =>
            getLinearFlippedSquares(
              reversiState,
              color,
              getNextPosFunc,
              [rowIdx, colIdx],
              true
            )
          )
        : false
    );
  });
};

export const getNextReversiState = (reversiState, color, position) => {
  const [rowIdx, colIdx] = position;
  if (reversiState[rowIdx][colIdx] !== EMPTY) {
    return reversiState; // a stone already exists
  }
  const flippedSquares = NEXT_POSITION_FUNCS.reduce(
    (acc, getNextPosFunc) => [
      ...acc,
      ...getLinearFlippedSquares(reversiState, color, getNextPosFunc, position)
    ],
    [[]]
  );
  return flippedSquares.reduce((acc, flippedSquare) => {
    if (flippedSquare.length === 0) {
      return acc; // no flipped squares in certain direction
    }
    acc[flippedSquare[0]][flippedSquare[1]] = color;
    acc[rowIdx][colIdx] = color;
    return acc;
  }, reversiState);
};

const validateNextReversiState = (
  prevReversiState,
  rowIdx,
  colIdx,
  myColor,
  nextReversiState
) => {
  const localNextReversiState = getNextReversiState(
    JSON.parse(JSON.stringify(prevReversiState)),
    myColor,
    [rowIdx, colIdx]
  );
  return (
    JSON.stringify(localNextReversiState) === JSON.stringify(nextReversiState)
  );
};

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

  /* actions */
  const changeColumnState = rowIdx => colIdx => {
    const nextReversiState = getNextReversiState(
      JSON.parse(JSON.stringify(reversiState)),
      myColor,
      [rowIdx, colIdx]
    );
    if (JSON.stringify(nextReversiState) === JSON.stringify(reversiState))
      return;
    let nextColor = getOpponentColor(myColor);
    if (!hasNextStrategy(nextReversiState, nextColor)) {
      nextColor = getOpponentColor(nextColor);
    }
    props.sendNextState(nextReversiState, nextColor, rowIdx, colIdx);
  };

  return (
    <div id="board" className="board">
      {reversiState.map((columnState, idx) => (
        <Column
          columnState={columnState}
          changeColumnState={changeColumnState(idx)}
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
  nextReversiPosition: PropTypes.shape({
    colIdx: PropTypes.number,
    rowIdx: PropTypes.number
  }).isRequired,
  nextColor: PropTypes.string.isRequired,
  nextReversiState: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired
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
          key={uuid()}
        />
      ))}
    </div>
  );
}

Column.propTypes = {
  columnState: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeColumnState: PropTypes.func.isRequired
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
        <button className="square" onClick={props.changeSquareState}>
          <div className={EMPTY} />
        </button>
      );
  }
}

Square.propTypes = {
  squareState: PropTypes.string.isRequired,
  changeSquareState: PropTypes.func.isRequired
};
