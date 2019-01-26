import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import App from '../app/reversi-app';
import rootReducer from '../app/reversi-app/reducers';
import rootSaga from '../app/reversi-app/sagas/index';

// const title = 'It really does work! (this section is rendered by React, ' +
//               "change the app's name below to test hot reloading)";

//ReactDOM.render(<ColorChanger title={title} />, document.getElementById('react-app'));

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer, 
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('reversi-app')
);

export default store;
