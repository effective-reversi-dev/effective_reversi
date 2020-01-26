// default export cannot be used for const because of syntax of ES
// eslint-disable-next-line import/prefer-default-export
export const COLUMNS = [
  {
    title: '部屋名',
    field: 'room_name'
  },
  {
    title: '対戦者定員',
    field: 'max_participant',
    type: 'numeric'
  },
  {
    title: '対戦者入室数',
    field: 'count_participant',
    type: 'numeric'
  },
  {
    title: '観戦者定員',
    field: 'max_spectator',
    type: 'numeric'
  },
  {
    title: '観戦者入室数',
    field: 'count_spectator',
    type: 'numeric'
  }
];
