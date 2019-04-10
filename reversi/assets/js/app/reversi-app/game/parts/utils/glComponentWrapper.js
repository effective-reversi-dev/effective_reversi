import React from 'react';
import { Provider } from 'react-redux';

import store from '../../../../../pages/homePage';

const glComponentWrapper = (RegisteredComponent, props, idx) => {
  const { onRegisterOpen, onRemoveItem, panelNames } = props;
  return class GlComponent extends React.Component {
    componentDidMount() {
      onRegisterOpen(panelNames[idx]);
    }

    componentWillUnmount() {
      onRemoveItem(panelNames[idx]);
    }

    render() {
      return (
        <Provider store={store}>
          <RegisteredComponent {...this.props} />
        </Provider>
      );
    }
  };
};

export default glComponentWrapper;
