import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import App from '../app/reversi-app/App';
import rootReducer from '../app/reversi-app';
import rootSaga from '../app/reversi-app/rootSaga';

const sagaMiddleware = createSagaMiddleware();
const logger = createLogger({
  collapsed: true,
  diff: true
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('reversi-app')
  );
};

render(App);

if (module.hot) {
  module.hot.addStatusHandler(status => {
    if (status === 'prepare') console.clear();
  });
}

export default store;
