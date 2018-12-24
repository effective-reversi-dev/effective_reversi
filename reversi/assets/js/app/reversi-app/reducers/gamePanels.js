import { handleActions } from 'redux-actions';
import panelActions from '../actions/gamePanels';

const initialState = {
    panelNames: ['情報', 'ゲーム画面', '戦況', 'チャット'],
    addedPanel: '',
    removeAllPanels: false,
};

export default handleActions({
    [panelActions.addPanel] : (state, action) => (
        Object.assign({}, state, {addedPanel: action.payload})
    ),
    [panelActions.removeAll] : (state, action) => (
        Object.assign({}, state, {removeAllPanels: action.payload})
    ),
}, initialState);
