import { handleActions } from 'redux-actions';
import panelActions from '../actions/gamePanels';

const initialState = {
    panelsOpen: {'情報': true, 'ゲーム画面': true, '戦況': true, 'チャット': true},
    addedPanel: '',
};

export default handleActions({
    [panelActions.addPanel]: (state, action) => {
        return Object.assign(
            {}, 
            state, 
            {addedPanel: action.payload}
        )
    },
    [panelActions.registerOpenPanel]: (state, action) => {
        return Object.assign(
            {},
            state,
            {panelsOpen: Object.assign({}, state.panelsOpen, {[action.payload]: true}),
             addedPanel: ''}
        )
    },
    [panelActions.removePanel]: (state, action) => {
        return Object.assign(
            {}, 
            state, 
            {panelsOpen: Object.assign({}, state.panelsOpen, {[action.payload]: false})}
        )
    }
}, initialState);
