let StateManager = (() => {
  let _currentState = undefined,
    _listenerFns = [],
    _reducer = undefined,
    _INIT_ACTION = { type: "@@INIT-ACTION" };

  function getState() {
    return _currentState;
  }

  function subscribe(listenerFn) {
    _listenerFns.push(listenerFn);
  }

  function _notifySubscribers() {
    for (let listenerFn of _listenerFns) {
      listenerFn();
    }
  }
  function dispatch(action) {
    let newState = _reducer(_currentState, action);
    if (newState == _currentState) return;
    _currentState = newState;
    _notifySubscribers();
  }

  function createStore(reducerFn) {
    // store should be allowed to be created without a 'reducer'
    if (typeof reducerFn !== 'function'){
        throw new Error("reducer function is mandatory to create the store")
    }
    _reducer = reducerFn;

    // initialize the 'currentState' with a VALID DEFAULT STATE
    _currentState = reducerFn(undefined, _INIT_ACTION);
    let store = {
      getState,
      subscribe,
      dispatch,
    };
    return store;
  }

  return {
    createStore,
  };
})()