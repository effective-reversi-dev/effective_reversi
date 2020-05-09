import {
  getLinearFlippedStones,
  placeStone,
  judgeGameOver,
  getResult,
  countStoneNum
} from '../utils';
import { EMPTY, BLACK, WHITE, DRAW } from '../constants';

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

const REVERSI_STATE_NO_EMPTY_BLACK_WIN = [
  [BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK],
  [BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK],
  [BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK]
];

const REVERSI_STATE_NO_EMPTY_WHITE_WIN = [
  [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK]
];

const REVERSI_STATE_NO_EMPTY_DRAW = [
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK],
  [BLACK, WHITE, WHITE, WHITE, BLACK, BLACK, WHITE, BLACK]
];

const REVERSI_STATE_ALL_BLACK = [
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLACK, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, BLACK, BLACK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, BLACK, BLACK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, BLACK, BLACK, BLACK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
];

const REVERSI_STATE_NO_PROCEED = [
  [EMPTY, BLACK, EMPTY, EMPTY, EMPTY, BLACK, EMPTY, EMPTY],
  [EMPTY, EMPTY, BLACK, EMPTY, EMPTY, BLACK, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, BLACK, EMPTY, BLACK, EMPTY, WHITE],
  [EMPTY, EMPTY, EMPTY, BLACK, BLACK, BLACK, BLACK, EMPTY],
  [BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK],
  [EMPTY, EMPTY, BLACK, BLACK, BLACK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, BLACK, BLACK, BLACK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, BLACK, BLACK, BLACK, BLACK, BLACK, EMPTY]
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
      getLinearFlippedStones(REVERSI_STATE, myColor, left, targetPosition)
    ).toEqual(expect.arrayContaining([[2, 1]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, right, targetPosition)
    ).toEqual(expect.arrayContaining([[2, 3]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, up, targetPosition)
    ).toEqual(expect.arrayContaining([[1, 2]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, down, targetPosition)
    ).toEqual(expect.arrayContaining([[3, 2]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, leftUp, targetPosition)
    ).toEqual(expect.arrayContaining([[1, 1]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, leftDown, targetPosition)
    ).toEqual(expect.arrayContaining([[3, 1]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, rightUp, targetPosition)
    ).toEqual(expect.arrayContaining([[1, 3]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, rightDown, targetPosition)
    ).toEqual(expect.arrayContaining([[3, 3]]));
  });
  test("shouldn't flip unsandwitched black stones (right side)", () => {
    const targetPosition = [1, 6];
    const myColor = 'white';
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, up, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, rightUp, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, right, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, rightDown, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
  });
  test("shouldn't flip unsandwitched black stones (left side)", () => {
    const targetPosition = [6, 1];
    const myColor = 'white';
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, leftUp, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, left, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, leftDown, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
    expect(
      getLinearFlippedStones(REVERSI_STATE, myColor, down, targetPosition)
    ).toEqual(expect.arrayContaining([[]]));
  });
  test("shouldn't put a stone where black stone already exists", () => {
    let targetPosition = [0, 0];
    let myColor = 'white';
    expect(placeStone(REVERSI_STATE, myColor, targetPosition)[0][0]).toEqual(
      BLACK
    );
    myColor = 'black';
    expect(placeStone(REVERSI_STATE, myColor, targetPosition)[0][0]).toEqual(
      BLACK
    );
    targetPosition = [1, 1];
    expect(placeStone(REVERSI_STATE, myColor, targetPosition)[1][1]).toEqual(
      WHITE
    );
    myColor = 'white';
    expect(placeStone(REVERSI_STATE, myColor, targetPosition)[1][1]).toEqual(
      WHITE
    );
  });
  test("shouldn't put anything when there are no stones alongside", () => {
    const targetPosition = [4, 7];
    const myColor = 'black';
    const nextReversiState = placeStone(REVERSI_STATE, myColor, targetPosition);
    expect(nextReversiState[3][7]).toEqual(EMPTY);
    expect(nextReversiState[4][7]).toEqual(EMPTY);
  });
  test('should not end game when there are places a player can put stone', () => {
    expect(judgeGameOver(REVERSI_STATE)).toEqual(false);
  });
  test('white stone player shoule win the game when white stones are more than black stones', () => {
    expect(judgeGameOver(REVERSI_STATE_NO_EMPTY_WHITE_WIN)).toEqual(true);
    expect(getResult(REVERSI_STATE_NO_EMPTY_WHITE_WIN)).toEqual(WHITE);
  });
  test('black stone player shoule win the game when black stones are more than white stones', () => {
    expect(judgeGameOver(REVERSI_STATE_NO_EMPTY_BLACK_WIN)).toEqual(true);
    expect(getResult(REVERSI_STATE_NO_EMPTY_BLACK_WIN)).toEqual(BLACK);
  });
  test('the game should be draw when the number of black stones are equal to that of white stones', () => {
    expect(judgeGameOver(REVERSI_STATE_NO_EMPTY_DRAW)).toEqual(true);
    expect(getResult(REVERSI_STATE_NO_EMPTY_DRAW)).toEqual(DRAW);
  });
  test('should end game when there are no white stones in the board', () => {
    expect(judgeGameOver(REVERSI_STATE_ALL_BLACK)).toEqual(true);
    expect(getResult(REVERSI_STATE_ALL_BLACK)).toEqual(BLACK);
  });
  test('should end game when both players cannot place stone anywhere', () => {
    expect(judgeGameOver(REVERSI_STATE_NO_PROCEED)).toEqual(true);
    expect(getResult(REVERSI_STATE_NO_PROCEED)).toEqual(BLACK);
  });
  test('count number of black and white stones at reversiState', () => {
    expect(countStoneNum(REVERSI_STATE)).toEqual([16, 8]);
  });
});
