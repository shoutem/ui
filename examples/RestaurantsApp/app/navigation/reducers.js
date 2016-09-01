import { combineReducers } from 'redux';
import * as NavigationStateUtils from 'NavigationStateUtils';

import { NAV_PUSH, NAV_POP, NAV_JUMP_TO_KEY, NAV_JUMP_TO_INDEX, NAV_RESET } from './actions';

const initialNavState = {
  index: 0,
  routes: [
    { key: 'RestaurantsList', title: 'Restaurants' },
  ],
};

function navigationState(state = initialNavState, action) {
  switch (action.type) {
    case NAV_PUSH:
      if (state.routes[state.index].key === (action.state && action.state.key)) return state;
      return NavigationStateUtils.push(state, action.state);

    case NAV_POP:
      if (state.index === 0 || state.routes.length === 1) return state;
      return NavigationStateUtils.pop(state);

    case NAV_JUMP_TO_KEY:
      return NavigationStateUtils.jumpTo(state, action.key);

    case NAV_JUMP_TO_INDEX:
      return NavigationStateUtils.jumpToIndex(state, action.index);

    case NAV_RESET:
      return {
        ...state,
        index: action.index,
        routes: action.routes,
      };

    default:
      return state;
  }
}

const appReducers = combineReducers({
  navigationState,
});

export default appReducers;
