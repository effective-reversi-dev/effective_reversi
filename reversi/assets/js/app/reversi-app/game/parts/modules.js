import { handleActions, createActions } from 'redux-actions';

// Window panels management
const ADD_PANEL = 'ADD_PANEL';
const REGISTER_OPEN_PANEL = 'REGISTER_OPEN_PANEL';
const REMOVE_PANEL = 'REMOVE_PANEL';

// Websocket Management
export const SETUP_GAME_SOCKET = 'SETUP_GAME_SOCKET'; // with Saga


export const panelActions = createActions(
    SETUP_GAME_SOCKET, 
    ADD_PANEL,
    REGISTER_OPEN_PANEL,
    REMOVE_PANEL
);

const initialState = {
    panelsOpen: {'情報': true, 'ゲーム画面': true, '戦況': true, 'チャット': true},
    addedPanel: '',
    roomName: 'dummyRoom' // TODO: change proper room name
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
