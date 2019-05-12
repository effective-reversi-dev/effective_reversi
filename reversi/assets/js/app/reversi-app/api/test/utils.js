import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'react-testing-library';

import rootReducer from '../../index';

// a handy function to test react containers with global state
export default function renderWithRedux(
  ui,
  { initialState, store = createStore(rootReducer, initialState) } = {}
) {
  return Object.assign(
    {},
    render(<Provider store={store}>{ui}</Provider>),
    store
  );
}
