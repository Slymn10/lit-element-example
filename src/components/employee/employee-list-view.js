import {LitElement, html, css} from 'lit';
import {t} from '../../i18n/i18n.js';
import '../common/confirmation-dialog.js';

export class EmployeeListView extends LitElement {
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

      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-4);
      }

      .employee-card {
        background-color: var(--color-surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: var(--space-4);
        transition: transform var(--transition-fast) ease,
          box-shadow var(--transition-fast) ease;
      }

      .employee-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-3);
      }

      .employee-name {
        font-weight: 600;
        font-size: var(--font-size-lg);
        color: var(--color-text-primary);
      }

      .checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .card-body {
        margin-bottom: var(--space-3);
      }

      .info-row {
        display: flex;
        margin-bottom: var(--space-2);
        font-size: var(--font-size-sm);
      }

      .info-label {
        flex: 0 0 40%;
        font-weight: 500;
        color: var(--color-text-secondary);
      }

      .info-value {
        flex: 0 0 60%;
        color: var(--color-text-primary);
      }

      .badge {
        display: inline-block;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        font-weight: 500;
      }

      .badge-department {
        background-color: rgba(30, 136, 229, 0.1);
        color: var(--color-secondary);
      }

      .badge-position {
        background-color: rgba(255, 107, 0, 0.1);
        color: var(--color-primary);
      }

      .card-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-2);
        margin-top: var(--space-3);
      }

      .action-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-1) var(--space-3);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        font-weight: 500;
        cursor: pointer;
        transition: background-color var(--transition-fast) ease;
      }

      .edit-button {
        background-color: rgba(255, 107, 0, 0.1);
        color: var(--color-primary);
        border: 1px solid var(--color-primary);
      }

      .edit-button:hover {
        background-color: rgba(255, 107, 0, 0.2);
      }

      .delete-button {
        background-color: rgba(255, 107, 0, 0.1);
        color: var(--color-primary);
        border: 1px solid var(--color-primary);
      }

      .delete-button:hover {
        background-color: rgba(255, 107, 0, 0.2);
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
      ${this.employees.length > 0
        ? html`
            <div class="card-grid">
              ${this.employees.map(
                (employee) => html`
                  <div class="employee-card">
                    <div class="card-header">
                      <div class="employee-name">
                        ${employee.firstName} ${employee.lastName}
                      </div>
                      <input type="checkbox" class="checkbox" />
                    </div>
                    <div class="card-body">
                      <div class="info-row">
                        <div class="info-label">${t('email')}</div>
                        <div class="info-value">${employee.email}</div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">${t('phoneNumber')}</div>
                        <div class="info-value">${employee.phoneNumber}</div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">${t('dateOfEmployment')}</div>
                        <div class="info-value">
                          ${this.formatDate(employee.dateOfEmployment)}
                        </div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">${t('dateOfBirth')}</div>
                        <div class="info-value">
                          ${this.formatDate(employee.dateOfBirth)}
                        </div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">${t('department')}</div>
                        <div class="info-value">
                          <span class="badge badge-department"
                            >${t(employee.department.toLowerCase())}</span
                          >
                        </div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">${t('position')}</div>
                        <div class="info-value">
                          <span class="badge badge-position"
                            >${t(employee.position.toLowerCase())}</span
                          >
                        </div>
                      </div>
                    </div>
                    <div class="card-actions">
                      <button
                        @click=${() => this.editEmployee(employee)}
                        class="action-button edit-button"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          style="margin-right: 4px;"
                        >
                          <path
                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          ></path>
                          <path
                            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                          ></path>
                        </svg>
                        ${t('edit')}
                      </button>
                      <button
                        @click=${() => this.confirmDelete(employee)}
                        class="action-button delete-button"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="none"
                          style="margin-right: 4px;"
                        >
                          <path
                            d="M3 6h18v2H3V6zm2 3v11a2 2 0 002 2h10a2 2 0 002-2V9H5zm4 2v7h2v-7H9zm4 0v7h2v-7h-2zM8 4V2a2 2 0 012-2h4a2 2 0 012 2v2h4v2H4V4h4zm2-2v2h4V2h-4z"
                          />
                        </svg>
                        ${t('delete')}
                      </button>
                    </div>
                  </div>
                `
              )}
            </div>
          `
        : html`
            <div class="empty-state">
              <p>${t('noEmployeesFound')}</p>
            </div>
          `}

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

customElements.define('employee-list-view', EmployeeListView);
