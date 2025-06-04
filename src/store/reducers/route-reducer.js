const initialState = {
  pathname: '/',
  params: {},
};

const routeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ROUTE':
      return {
        ...state,
        pathname: action.payload.pathname,
        params: action.payload.params,
      };
    default:
      return state;
  }
};

export default routeReducer;
