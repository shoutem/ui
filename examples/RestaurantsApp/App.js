import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import Restaurants from './screens/Restaurants';
import reducer from './redux';

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
