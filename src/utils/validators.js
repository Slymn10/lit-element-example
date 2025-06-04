export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function isValidPhoneNumber(phone) {
  // Basic validation for format +XX XXX XXX XX XX
  const re = /^\+\d{1,3}\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/;
  return re.test(phone);
}

// Check if date is in the past
export function isPastDate(date) {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate <= today;
}

// Check if date of birth makes employee at least 18 years old
export function isAtLeast18YearsOld(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
}

// Check if an email is unique among employees
export function isUniqueEmail(email, employees, currentEmployeeId = null) {
  return !employees.some(
    (emp) => emp.email === email && emp.id !== currentEmployeeId
  );
}

// Validate all employee fields
export function validateEmployee(employee, employees, isEdit = false) {
  const errors = {};

  if (!employee.firstName || employee.firstName.trim() === '') {
    errors.firstName = 'First name is required';
  }

  if (!employee.lastName || employee.lastName.trim() === '') {
    errors.lastName = 'Last name is required';
  }

  if (!employee.dateOfEmployment) {
    errors.dateOfEmployment = 'Date of employment is required';
  } else if (!isPastDate(employee.dateOfEmployment)) {
    errors.dateOfEmployment = 'Date of employment must be in the past';
  }

  if (!employee.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else if (!isPastDate(employee.dateOfBirth)) {
    errors.dateOfBirth = 'Date of birth must be in the past';
  } else if (!isAtLeast18YearsOld(employee.dateOfBirth)) {
    errors.dateOfBirth = 'Employee must be at least 18 years old';
  }

  if (!employee.phoneNumber) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!isValidPhoneNumber(employee.phoneNumber)) {
    errors.phoneNumber = 'Phone number format should be +XX XXX XXX XX XX';
  }

  if (!employee.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(employee.email)) {
    errors.email = 'Email is not valid';
  } else if (
    !isUniqueEmail(employee.email, employees, isEdit ? employee.id : null)
  ) {
    errors.email = 'Email is already in use';
  }

  if (!employee.department) {
    errors.department = 'Department is required';
  }

  if (!employee.position) {
    errors.position = 'Position is required';
  }

  return errors;
}
