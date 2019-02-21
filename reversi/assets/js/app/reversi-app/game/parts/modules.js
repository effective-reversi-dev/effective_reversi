import { handleActions, createActions } from 'redux-actions';

// Window panels management
const ADD_PANEL = 'ADD_PANEL';
const REGISTER_OPEN_PANEL = 'REGISTER_OPEN_PANEL';
const REMOVE_PANEL = 'REMOVE_PANEL';

export const panelActions = createActions(
    ADD_PANEL,
    REGISTER_OPEN_PANEL,
    REMOVE_PANEL
);

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
