export const GRID_NUM = 8;
export const EMPTY = 'empty';
export const BLACK = 'black';
export const WHITE = 'white';

export const NEXT_POSITION_FUNCS = [
  pos => [pos[0], pos[1] - 1],
  pos => [pos[0], pos[1] + 1],
  pos => [pos[0] - 1, pos[1]],
  pos => [pos[0] + 1, pos[1]],
  pos => [pos[0] - 1, pos[1] - 1],
  pos => [pos[0] + 1, pos[1] - 1],
  pos => [pos[0] - 1, pos[1] + 1],
  pos => [pos[0] + 1, pos[1] + 1]
];
