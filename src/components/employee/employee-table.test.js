import {expect} from '@open-wc/testing';
import {fixture, html} from '@open-wc/testing-helpers';
import sinon from 'sinon';
import './employee-table.js';

describe('EmployeeTable', () => {
  let element;
  let employees;

  beforeEach(async () => {
    employees = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2022-01-15',
        dateOfBirth: '1990-05-20',
        phoneNumber: '+90 532 123 45 67',
        email: 'john.doe@example.com',
        department: 'Tech',
        position: 'Senior',
      },
    ];

    element = await fixture(html`
      <employee-table .employees=${employees}></employee-table>
    `);
  });

  it('renders the employee data correctly', () => {
    const cells = element.shadowRoot.querySelectorAll('td');
    expect(cells.length).to.be.greaterThan(0);
    expect(cells[1].textContent).to.equal('John');
    expect(cells[2].textContent).to.equal('Doe');
    expect(cells[6].textContent).to.equal('john.doe@example.com');
  });

  it('shows empty state when no employees', async () => {
    element = await fixture(html`
      <employee-table .employees=${[]}></employee-table>
    `);

    const emptyState = element.shadowRoot.querySelector('.empty-state');
    expect(emptyState).to.exist;
  });

  it('emits edit event when edit button is clicked', async () => {
    const editSpy = sinon.spy();
    element.addEventListener('edit', editSpy);

    const editButton = element.shadowRoot.querySelector('.edit-button');
    editButton.click();

    expect(editSpy.calledOnce).to.be.true;
    expect(editSpy.firstCall.args[0].detail.employee).to.equal(employees[0]);
  });

  it('opens confirmation dialog when delete button is clicked', async () => {
    const deleteButton = element.shadowRoot.querySelector('.delete-button');
    deleteButton.click();

    await element.updateComplete;

    const dialog = element.shadowRoot.querySelector('confirmation-dialog');
    expect(dialog.open).to.be.true;
    expect(element.selectedEmployee).to.equal(employees[0]);
  });

  it('emits delete event when confirmation is confirmed', async () => {
    const deleteSpy = sinon.spy();
    element.addEventListener('delete', deleteSpy);

    const deleteButton = element.shadowRoot.querySelector('.delete-button');
    deleteButton.click();
    await element.updateComplete;

    element.handleDeleteConfirm();

    expect(deleteSpy.calledOnce).to.be.true;
    expect(deleteSpy.firstCall.args[0].detail.id).to.equal(employees[0].id);
  });

  it('formats dates correctly', () => {
    const formattedDate = element.formatDate('2022-01-15');
    expect(formattedDate).to.equal('15/01/2022');
  });
});
