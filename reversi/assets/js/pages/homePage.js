import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from '../app/reversi-app';
import rootReducer from '../app/reversi-app/reducers';

// const title = 'It really does work! (this section is rendered by React, ' +
//               "change the app's name below to test hot reloading)";

//ReactDOM.render(<ColorChanger title={title} />, document.getElementById('react-app'));

const store = createStore(rootReducer);
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('reversi-app'));
