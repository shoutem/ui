import React, { PureComponent } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './redux';
import Restaurants from './screens/Restaurants';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

export default class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <Restaurants />
      </Provider>
    );
  }
}
