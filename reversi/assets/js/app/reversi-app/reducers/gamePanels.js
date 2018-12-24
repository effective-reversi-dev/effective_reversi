import { handleActions } from 'redux-actions';
import panelActions from '../actions/gamePanels';

const initialState = {
    panelNames: ['情報', 'ゲーム画面', '戦況', 'チャット'],
    addedPanel: ''
};

export default handleActions({
    [panelActions.addPanel] : (state, action) => (
        Object.assign({}, state, {addedPanel: action.payload})
    )
}, initialState);
