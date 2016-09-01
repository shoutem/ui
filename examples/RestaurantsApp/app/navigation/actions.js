export const NAVIGATE = 'NAVIGATE';
export const NAV_PUSH = 'NAV_PUSH';
export const NAV_POP = 'NAV_POP';
export const NAV_JUMP_TO_KEY = 'NAV_JUMP_TO_KEY';
export const NAV_JUMP_TO_INDEX = 'NAV_JUMP_TO_INDEX';
export const NAV_RESET = 'NAV_RESET';

export function navigatePush(route, props) {
  // Use route's key as title if route object containing route info is not passed.
  const routeObj = typeof route === 'string' ? { key: route, title: route } : route;

  return {
    type: NAV_PUSH,
    state: {
      ...routeObj,
      props,
    },
  };
}

export function navigatePop() {
  return {
    type: NAV_POP,
  };
}

export function navigateJumpToKey(key) {
  return {
    type: NAV_JUMP_TO_KEY,
    key,
  };
}

export function navigateJumpToIndex(index) {
  return {
    type: NAV_JUMP_TO_INDEX,
    index,
  };
}

export function navigateReset(routes, index) {
  return {
    type: NAV_RESET,
    index,
    routes,
  };
}
