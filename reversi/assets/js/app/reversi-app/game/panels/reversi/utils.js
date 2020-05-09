import {
  GRID_NUM,
  EMPTY,
  BLACK,
  WHITE,
  DRAW,
  NEXT_POSITION_FUNCS
} from './constants';

export const getOpponentStoneColor = myColor =>
  myColor === BLACK ? WHITE : BLACK;

export const countStoneNum = reversiState => {
  let blackNum = 0;
  let whiteNum = 0;
  reversiState.forEach(rowState => {
    rowState.forEach(squareState => {
      if (squareState === BLACK) {
        blackNum += 1;
      } else if (squareState === WHITE) {
        whiteNum += 1;
      }
    });
  });
  return [blackNum, whiteNum];
};

export const getLinearFlippedStones = (
  reversiState,
  myColor,
  getNextPosition,
  position // [rowIdx, colIdx]
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
        return squaresToFlip;
      }
      return [[]];
    } else if (targetState === EMPTY) {
      return [[]];
    }
    squaresToFlip.push([nextRowIdx, nextColIdx]);
    [nextRowIdx, nextColIdx] = getNextPosition([nextRowIdx, nextColIdx]);
  }
  return [[]]; // opponent's stones alongside aren't sandwitched
};

export const canFlipStones = (reversiState, color) => {
  return reversiState.some((rowState, rowIdx) => {
    return rowState.some((squareState, colIdx) =>
      squareState === EMPTY
        ? NEXT_POSITION_FUNCS.some(getNextPosFunc => {
            const flippedSquares = getLinearFlippedStones(
              reversiState,
              color,
              getNextPosFunc,
              [rowIdx, colIdx]
            );
            return !(
              flippedSquares.length === 1 && flippedSquares[0].length === 0
            );
          })
        : false
    );
  });
};

export const judgeGameOver = reversiState => {
  const [blackNum, whiteNum] = countStoneNum(reversiState);
  // both players cannot place stones anymore
  if (
    !canFlipStones(reversiState, BLACK) &&
    !canFlipStones(reversiState, WHITE)
  )
    return true;
  // the board is filled with stones
  return blackNum + whiteNum === GRID_NUM * GRID_NUM;
};

export const getResult = reversiState => {
  const [blackNum, whiteNum] = countStoneNum(reversiState);
  if (blackNum > whiteNum) {
    return BLACK;
  } else if (whiteNum > blackNum) {
    return WHITE;
  }
  return DRAW;
};

export const placeStone = (reversiState, color, position) => {
  const [rowIdx, colIdx] = position;
  if (reversiState[rowIdx][colIdx] !== EMPTY) {
    return reversiState; // a stone already exists
  }
  const flippedSquares = NEXT_POSITION_FUNCS.reduce(
    (acc, getNextPosFunc) => [
      ...acc,
      ...getLinearFlippedStones(reversiState, color, getNextPosFunc, position)
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

export const validateNextReversiState = (
  prevReversiState,
  rowIdx,
  colIdx,
  myColor,
  nextReversiState
) => {
  const localNextReversiState = placeStone(
    JSON.parse(JSON.stringify(prevReversiState)),
    myColor,
    [rowIdx, colIdx]
  );
  return (
    JSON.stringify(localNextReversiState) === JSON.stringify(nextReversiState)
  );
};
