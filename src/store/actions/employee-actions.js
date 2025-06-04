// Action creators for employee management
export const fetchEmployees = () => {
  return (dispatch, getState) => {
    dispatch({type: 'FETCH_EMPLOYEES_REQUEST'});

    try {
      const state = getState();
      const employees = state.employees.list;

      dispatch({
        type: 'FETCH_EMPLOYEES_SUCCESS',
        payload: employees,
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_EMPLOYEES_FAILURE',
        payload: error.message,
      });
    }
  };
};

export const addEmployee = (employee) => {
  return {
    type: 'ADD_EMPLOYEE',
    payload: employee,
  };
};

export const updateEmployee = (employee) => {
  return {
    type: 'UPDATE_EMPLOYEE',
    payload: employee,
  };
};

export const deleteEmployee = (id) => {
  return {
    type: 'DELETE_EMPLOYEE',
    payload: id,
  };
};

export const setDisplayMode = (mode) => {
  return {
    type: 'SET_DISPLAY_MODE',
    payload: mode,
  };
};

export const setPaginationState = (paginationData) => {
  return {
    type: 'SET_PAGINATION_STATE',
    payload: paginationData,
  };
};
