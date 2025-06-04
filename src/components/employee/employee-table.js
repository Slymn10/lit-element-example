import {LitElement, html, css} from 'lit';
import {t} from '../../i18n/i18n.js';
import '../common/confirmation-dialog.js';

export class EmployeeTable extends LitElement {
  static get properties() {
    return {
      employees: {type: Array},
      selectedEmployee: {type: Object},
      confirmDialogOpen: {type: Boolean},
      confirmDialogMessage: {type: String},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .table-container {
        overflow-x: auto;
        background-color: var(--color-surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--font-size-sm);
      }

      th,
      td {
        padding: var(--space-3);
        text-align: center;
        border-bottom: 1px solid var(--color-border);
      }

      th {
        font-weight: 600;
        color: var(--color-primary);
        white-space: nowrap;
      }

      tr:last-child td {
        border-bottom: none;
      }

      tr:hover td {
        background-color: var(--color-background);
      }

      .checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .actions {
        display: flex;
        gap: var(--space-2);
        white-space: nowrap;
        justify-content: center;
        align-items: center;
      }

      .actions-cell {
        text-align: left;
        vertical-align: middle;
      }

      .action-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: var(--radius-md);
        border: none;
        background: none;
        cursor: pointer;
        transition: background-color var(--transition-fast) ease;
      }

      .edit-button {
        color: var(--color-primary);
      }

      .edit-button:hover {
        background-color: rgba(255, 107, 0, 0.1);
      }

      .delete-button {
        color: var(--color-primary);
      }

      .delete-button:hover {
        background-color: rgba(255, 107, 0, 0.1);
      }

      .empty-state {
        padding: var(--space-8);
        text-align: center;
        color: var(--color-text-secondary);
      }
    `;
  }

  constructor() {
    super();
    this.employees = [];
    this.selectedEmployee = null;
    this.confirmDialogOpen = false;
    this.confirmDialogMessage = '';
  }

  editEmployee(employee) {
    this.dispatchEvent(
      new CustomEvent('edit', {
        detail: {employee},
      })
    );
  }

  confirmDelete(employee) {
    this.selectedEmployee = employee;
    this.confirmDialogMessage = t('deleteConfirmationText')
      .replace('{firstName}', employee.firstName)
      .replace('{lastName}', employee.lastName);
    this.confirmDialogOpen = true;
  }

  handleDeleteConfirm() {
    if (this.selectedEmployee) {
      this.dispatchEvent(
        new CustomEvent('delete', {
          detail: {id: this.selectedEmployee.id},
        })
      );
    }
    this.confirmDialogOpen = false;
    this.selectedEmployee = null;
  }

  handleDeleteCancel() {
    this.confirmDialogOpen = false;
    this.selectedEmployee = null;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  }

  render() {
    return html`
      <div class="table-container">
        ${this.employees.length > 0
          ? html`
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" class="checkbox" /></th>
                    <th>${t('firstName')}</th>
                    <th>${t('lastName')}</th>
                    <th>${t('dateOfEmployment')}</th>
                    <th>${t('dateOfBirth')}</th>
                    <th>${t('phoneNumber')}</th>
                    <th>${t('email')}</th>
                    <th>${t('department')}</th>
                    <th>${t('position')}</th>
                    <th>${t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.employees.map(
                    (employee) => html`
                      <tr>
                        <td><input type="checkbox" class="checkbox" /></td>
                        <td>${employee.firstName}</td>
                        <td>${employee.lastName}</td>
                        <td>${this.formatDate(employee.dateOfEmployment)}</td>
                        <td>${this.formatDate(employee.dateOfBirth)}</td>
                        <td>${employee.phoneNumber}</td>
                        <td>${employee.email}</td>
                        <td>${t(employee.department.toLowerCase())}</td>
                        <td>${t(employee.position.toLowerCase())}</td>
                        <td class="actions-cell">
                          <div class="actions">
                            <button
                              @click=${() => this.editEmployee(employee)}
                              class="action-button edit-button"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path
                                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                ></path>
                                <path
                                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                ></path>
                              </svg>
                            </button>
                            <button
                              @click=${() => this.confirmDelete(employee)}
                              class="action-button delete-button"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                stroke="none"
                              >
                                <path
                                  d="M3 6h18v2H3V6zm2 3v11a2 2 0 002 2h10a2 2 0 002-2V9H5zm4 2v7h2v-7H9zm4 0v7h2v-7h-2zM8 4V2a2 2 0 012-2h4a2 2 0 012 2v2h4v2H4V4h4zm2-2v2h4V2h-4z"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    `
                  )}
                </tbody>
              </table>
            `
          : html`
              <div class="empty-state">
                <p>${t('noEmployeesFound')}</p>
              </div>
            `}
      </div>

      <confirmation-dialog
        ?open=${this.confirmDialogOpen}
        title=${t('confirmDelete')}
        message=${this.confirmDialogMessage}
        confirmText=${t('proceed')}
        cancelText=${t('cancel')}
        @confirm=${this.handleDeleteConfirm}
        @cancel=${this.handleDeleteCancel}
      ></confirmation-dialog>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);
