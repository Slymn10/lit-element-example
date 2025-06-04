import {expect} from '@open-wc/testing';
import {
  isValidEmail,
  isValidPhoneNumber,
  isPastDate,
  isAtLeast18YearsOld,
  isUniqueEmail,
  validateEmployee,
} from '../src/utils/validators.js';

suite('Validator Utils', () => {
  suite('isValidEmail', () => {
    test('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).to.be.true;
      expect(isValidEmail('user.name@domain.co.uk')).to.be.true;
      expect(isValidEmail('a@b.c')).to.be.true;
    });

    test('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).to.be.false;
      expect(isValidEmail('test@')).to.be.false;
      expect(isValidEmail('@domain.com')).to.be.false;
      expect(isValidEmail('')).to.be.false;
    });
  });

  suite('isValidPhoneNumber', () => {
    test('should validate correct phone number format', () => {
      expect(isValidPhoneNumber('+90 123 456 78 90')).to.be.true;
      expect(isValidPhoneNumber('+1 555 123 45 67')).to.be.true;
    });

    test('should reject invalid phone number formats', () => {
      expect(isValidPhoneNumber('1234567890')).to.be.false;
      expect(isValidPhoneNumber('+90 123456789')).to.be.false;
      expect(isValidPhoneNumber('+90-123-456-78-90')).to.be.false;
      expect(isValidPhoneNumber('')).to.be.false;
    });
  });

  suite('isPastDate', () => {
    test('should return true for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isPastDate(yesterday.toISOString())).to.be.true;

      expect(isPastDate('2020-01-01')).to.be.true;
    });

    test('should return false for future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isPastDate(tomorrow.toISOString())).to.be.false;
    });

    test('should handle today correctly', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to midnight to match implementation
      expect(isPastDate(today.toISOString())).to.be.true;
    });
  });

  suite('isAtLeast18YearsOld', () => {
    test('should return true for dates older than 18 years', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 20);
      expect(isAtLeast18YearsOld(birthDate.toISOString())).to.be.true;
    });

    test('should return false for dates less than 18 years ago', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 16);
      expect(isAtLeast18YearsOld(birthDate.toISOString())).to.be.false;
    });

    test('should handle edge case for exactly 18 years old', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 18);
      expect(isAtLeast18YearsOld(birthDate.toISOString())).to.be.true;
    });
  });

  suite('isUniqueEmail', () => {
    const employees = [
      {id: 1, email: 'test1@example.com'},
      {id: 2, email: 'test2@example.com'},
      {id: 3, email: 'test3@example.com'},
    ];

    test('should return true for unique email', () => {
      expect(isUniqueEmail('new@example.com', employees)).to.be.true;
    });

    test('should return false for existing email', () => {
      expect(isUniqueEmail('test1@example.com', employees)).to.be.false;
    });

    test('should allow same email for current employee in edit mode', () => {
      expect(isUniqueEmail('test1@example.com', employees, 1)).to.be.true;
    });

    test('should not allow existing email for different employee in edit mode', () => {
      expect(isUniqueEmail('test1@example.com', employees, 2)).to.be.false;
    });
  });

  suite('validateEmployee', () => {
    const validEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '+90 123 456 78 90',
      email: 'john.doe@example.com',
      department: 'Tech',
      position: 'Senior',
    };

    const employees = [{id: 2, email: 'existing@example.com'}];

    test('should return no errors for valid employee', () => {
      const errors = validateEmployee(validEmployee, employees);
      expect(Object.keys(errors)).to.have.length(0);
    });

    test('should return error for missing first name', () => {
      const employee = {...validEmployee, firstName: ''};
      const errors = validateEmployee(employee, employees);
      expect(errors.firstName).to.equal('First name is required');
    });

    test('should return error for missing last name', () => {
      const employee = {...validEmployee, lastName: ''};
      const errors = validateEmployee(employee, employees);
      expect(errors.lastName).to.equal('Last name is required');
    });

    test('should return error for missing date of employment', () => {
      const employee = {...validEmployee, dateOfEmployment: ''};
      const errors = validateEmployee(employee, employees);
      expect(errors.dateOfEmployment).to.equal(
        'Date of employment is required'
      );
    });

    test('should return error for future date of employment', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const employee = {
        ...validEmployee,
        dateOfEmployment: futureDate.toISOString(),
      };
      const errors = validateEmployee(employee, employees);
      expect(errors.dateOfEmployment).to.equal(
        'Date of employment must be in the past'
      );
    });

    test('should return error for missing date of birth', () => {
      const employee = {...validEmployee, dateOfBirth: ''};
      const errors = validateEmployee(employee, employees);
      expect(errors.dateOfBirth).to.equal('Date of birth is required');
    });

    test('should return error for future date of birth', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const employee = {
        ...validEmployee,
        dateOfBirth: futureDate.toISOString(),
      };
      const errors = validateEmployee(employee, employees);
      expect(errors.dateOfBirth).to.equal('Date of birth must be in the past');
    });

    test('should return error for employee under 18', () => {
      const youngDate = new Date();
      youngDate.setFullYear(youngDate.getFullYear() - 16);
      const employee = {...validEmployee, dateOfBirth: youngDate.toISOString()};
      const errors = validateEmployee(employee, employees);
      expect(errors.dateOfBirth).to.equal(
        'Employee must be at least 18 years old'
      );
    });

    test('should return error for missing phone number', () => {
      const employee = {...validEmployee, phoneNumber: ''};
      const errors = validateEmployee(employee, employees);
      expect(errors.phoneNumber).to.equal('Phone number is required');
    });

    test('should return error for invalid phone number format', () => {
      const employee = {...validEmployee, phoneNumber: '1234567890'};
      const errors = validateEmployee(employee, employees);
      expect(errors.phoneNumber).to.equal(
        'Phone number format should be +XX XXX XXX XX XX'
      );
    });

    test('should return error for missing email', () => {
      const employee = {...validEmployee, email: ''};
      const errors = validateEmployee(employee, employees);
      expect(errors.email).to.equal('Email is required');
    });

    test('should return error for invalid email format', () => {
      const employee = {...validEmployee, email: 'invalid-email'};
      const errors = validateEmployee(employee, employees);
      expect(errors.email).to.equal('Email is not valid');
    });

    test('should return error for duplicate email', () => {
      const employee = {...validEmployee, email: 'existing@example.com'};
      const errors = validateEmployee(employee, employees);
      expect(errors.email).to.equal('Email is already in use');
    });

    test('should return error for missing department', () => {
      const employee = {...validEmployee, department: ''};
      const errors = validateEmployee(employee, employees);
      expect(errors.department).to.equal('Department is required');
    });

    test('should return error for missing position', () => {
      const employee = {...validEmployee, position: ''};
      const errors = validateEmployee(employee, employees);
      expect(errors.position).to.equal('Position is required');
    });
  });
});
