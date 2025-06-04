// Initial state
const initialState = {
  language: document.documentElement.lang || 'en',
  displayMode: 'table', // 'table' or 'list'
  pagination: {
    currentPage: 1,
    searchQuery: '',
  },
};

const appReducer = (state = initialState, action) => {
  if (state && !Object.prototype.hasOwnProperty.call(state, 'displayMode')) {
    state = {...state, displayMode: 'table'};
  }

  if (state && !Object.prototype.hasOwnProperty.call(state, 'pagination')) {
    state = {...state, pagination: initialState.pagination};
  }

  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_DISPLAY_MODE':
      return {
        ...state,
        displayMode: action.payload,
      };
    case 'SET_PAGINATION_STATE':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default appReducer;
