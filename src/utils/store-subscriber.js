// Helper to subscribe to store updates
export function subscribe(store, callback) {
  let currentState = store.getState();
  
  function handleChange() {
    const nextState = store.getState();
    if (nextState !== currentState) {
      const previousState = currentState;
      currentState = nextState;
      callback(currentState, previousState);
    }
  }
  
  const unsubscribe = store.subscribe(handleChange);
  return unsubscribe;
}