import {
  getLinearFlippedSquares,
  getNextReversiState
} from '../components/Reversi';
import { EMPTY, BLACK, WHITE } from '../constants';

const REVERSI_STATE = [
  [BLACK, EMPTY, BLACK, EMPTY, BLACK, EMPTY, BLACK, BLACK],
  [EMPTY, WHITE, WHITE, WHITE, EMPTY, EMPTY, EMPTY, BLACK],
  [BLACK, WHITE, EMPTY, WHITE, BLACK, EMPTY, EMPTY, BLACK],
  [EMPTY, WHITE, WHITE, WHITE, EMPTY, EMPTY, EMPTY, EMPTY],
  [BLACK, EMPTY, BLACK, EMPTY, BLACK, EMPTY, EMPTY, EMPTY],
  [BLACK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [BLACK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [BLACK, BLACK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
];

const left = pos => [pos[0], pos[1] - 1];
const right = pos => [pos[0], pos[1] + 1];
const up = pos => [pos[0] - 1, pos[1]];
const down = pos => [pos[0] + 1, pos[1]];
const leftUp = pos => [pos[0] - 1, pos[1] - 1];
const leftDown = pos => [pos[0] + 1, pos[1] - 1];
const rightUp = pos => [pos[0] - 1, pos[1] + 1];
const rightDown = pos => [pos[0] + 1, pos[1] + 1];

describe('testing Reversi', () => {
  test('should flip surrounded white stones', () => {
    const targetPosition = [2, 2];
    const myColor = 'black';
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, left, targetPosition)
    ).toEqual(expect.arrayContaining([[2, 1]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, right, targetPosition)
    ).toEqual(expect.arrayContaining([[2, 3]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, up, targetPosition)
    ).toEqual(expect.arrayContaining([[1, 2]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, down, targetPosition)
    ).toEqual(expect.arrayContaining([[3, 2]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, leftUp, targetPosition)
    ).toEqual(expect.arrayContaining([[1, 1]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, leftDown, targetPosition)
    ).toEqual(expect.arrayContaining([[3, 1]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, rightUp, targetPosition)
    ).toEqual(expect.arrayContaining([[1, 3]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, rightDown, targetPosition)
    ).toEqual(expect.arrayContaining([[3, 3]]));
  });
  test("shouldn't flip unsandwitched black stones (right side)", () => {
    const targetPosition = [1, 6];
    const myColor = 'white';
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, up, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, rightUp, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, right, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, rightDown, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
  });
  test("shouldn't flip unsandwitched black stones (left side)", () => {
    const targetPosition = [6, 1];
    const myColor = 'white';
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, leftUp, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, left, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, leftDown, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedSquares(REVERSI_STATE, myColor, down, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
  });
  test("shouldn't put a stone where black stone already exists", () => {
    let targetPosition = [0, 0];
    let myColor = 'white';
    expect(
      getNextReversiState(REVERSI_STATE, myColor, targetPosition)[0][0]
    ).toEqual(BLACK);
    myColor = 'black';
    expect(
      getNextReversiState(REVERSI_STATE, myColor, targetPosition)[0][0]
    ).toEqual(BLACK);
    targetPosition = [1, 1];
    expect(
      getNextReversiState(REVERSI_STATE, myColor, targetPosition)[1][1]
    ).toEqual(WHITE);
    myColor = 'white';
    expect(
      getNextReversiState(REVERSI_STATE, myColor, targetPosition)[1][1]
    ).toEqual(WHITE);
  });
  test("shouldn't put anything when there are no stones alongside", () => {
    const targetPosition = [4, 7];
    const myColor = 'black';
    const nextReversiState = getNextReversiState(
      REVERSI_STATE,
      myColor,
      targetPosition
    );
    expect(nextReversiState[3][7]).toEqual(EMPTY);
    expect(nextReversiState[4][7]).toEqual(EMPTY);
  });
});
