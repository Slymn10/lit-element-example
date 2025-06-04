import {generateId} from '../../utils/id-generator.js';

const generateMockEmployees = () => {
  const departments = ['Analytics', 'Tech'];
  const positions = ['Junior', 'Medior', 'Senior'];
  const firstNames = [
    'James',
    'John',
    'Sarah',
    'Emma',
    'Michael',
    'Jessica',
    'David',
    'Ashley',
    'Daniel',
    'Christopher',
    'Emily',
    'Matthew',
    'Amanda',
    'Joshua',
    'Jennifer',
    'Andrew',
    'Lisa',
    'Robert',
    'Michelle',
    'Kevin',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
  ];

  return Array.from({length: 100}, (_, index) => ({
    id: `emp-${index + 1}`,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    dateOfEmployment: new Date(
      2020 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split('T')[0],
    dateOfBirth: new Date(
      1980 + Math.floor(Math.random() * 20),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split('T')[0],
    phoneNumber: `+90 ${Math.floor(Math.random() * 900 + 500)} ${Math.floor(
      Math.random() * 900 + 100
    )} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(
      Math.random() * 90 + 10
    )}`,
    email: `employee${index + 1}@company.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
  }));
};

const initialState = {
  list: generateMockEmployees(),
  loading: false,
  error: null,
};

const employeesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_EMPLOYEES_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_EMPLOYEES_SUCCESS':
      return {
        ...state,
        list: action.payload,
        loading: false,
      };
    case 'FETCH_EMPLOYEES_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'ADD_EMPLOYEE':
      return {
        ...state,
        list: [{...action.payload, id: generateId()}, ...state.list],
      };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        list: state.list.map((employee) =>
          employee.id === action.payload.id ? action.payload : employee
        ),
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        list: state.list.filter((employee) => employee.id !== action.payload),
      };
    default:
      return state;
  }
};

export default employeesReducer;
