import {LitElement, html, css} from 'lit';
import {store} from '../store/store.js';
import {
  addEmployee,
  updateEmployee,
  fetchEmployees,
} from '../store/actions/employee-actions.js';
import {navigate} from '../router.js';
import {t} from '../i18n/i18n.js';
import {validateEmployee} from '../utils/validators.js';
import '../components/common/confirmation-dialog.js';

export class EmployeeForm extends LitElement {
  static get properties() {
    return {
      employee: {type: Object},
      errors: {type: Object},
      isEdit: {type: Boolean},
      employees: {type: Array},
      confirmDialogOpen: {type: Boolean},
      isFormValid: {type: Boolean},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--space-4);
      }

      .form-container {
        background-color: var(--color-surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: var(--space-8);
        max-width: 900px;
        margin: 0 auto;
      }

      h1 {
        margin-top: 0;
        margin-bottom: var(--space-8);
        color: var(--color-text-primary);
        text-align: center;
        font-size: 2rem;
        font-weight: 600;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-6) var(--space-6);
        margin-bottom: var(--space-6);
      }

      .form-field {
        display: flex;
        flex-direction: column;
      }

      .full-width {
        grid-column: span 2;
      }

      label {
        display: block;
        margin-bottom: var(--space-3);
        font-weight: 600;
        color: var(--color-text-secondary);
        font-size: 0.95rem;
      }

      input,
      select {
        width: 100%;
        padding: var(--space-4);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-md);
        line-height: 1.5;
        transition: border-color var(--transition-fast) ease,
          box-shadow var(--transition-fast) ease,
          transform var(--transition-fast) ease;
        background-color: var(--color-background);
        box-sizing: border-box;
      }

      input:focus,
      select:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.15);
        transform: translateY(-1px);
      }

      input:hover,
      select:hover {
        border-color: var(--color-primary);
      }

      .error {
        border-color: var(--color-error);
      }

      .error-message {
        margin-top: var(--space-2);
        color: var(--color-error);
        font-size: var(--font-size-sm);
        font-weight: 500;
      }

      .form-actions {
        display: flex;
        justify-content: center;
        gap: var(--space-4);
        margin-top: var(--space-8);
        padding-top: var(--space-6);
        border-top: 1px solid var(--color-border);
      }

      .btn {
        padding: var(--space-3) var(--space-6);
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast) ease;
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--font-size-md);
        min-width: 120px;
        justify-content: center;
      }

      .btn-primary {
        background-color: var(--color-primary);
        color: white;
        border: 2px solid var(--color-primary);
      }

      .btn-primary:hover {
        background-color: var(--color-primary-dark);
        border-color: var(--color-primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(255, 107, 0, 0.3);
      }

      .btn-secondary {
        background-color: var(--color-background);
        color: var(--color-text-primary);
        border: 2px solid var(--color-border);
      }

      .btn-secondary:hover {
        background-color: var(--color-border);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .form-field:nth-child(odd) {
        margin-right: var(--space-2);
      }

      .form-field:nth-child(even) {
        margin-left: var(--space-2);
      }

      @media (max-width: 768px) {
        :host {
          padding: var(--space-2);
        }

        .form-container {
          padding: var(--space-6);
        }

        .form-grid {
          grid-template-columns: 1fr;
          gap: var(--space-5);
        }

        .full-width {
          grid-column: span 1;
        }

        .form-actions {
          flex-direction: column;
          align-items: center;
        }

        .btn {
          width: 100%;
          max-width: 300px;
        }
      }
    `;
  }

  constructor() {
    super();
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      department: '',
      position: '',
    };
    this.errors = {};
    this.isEdit = false;
    this.employees = [];
    this.confirmDialogOpen = false;
    this.isFormValid = false;
  }

  connectedCallback() {
    super.connectedCallback();

    this.unsubscribe = store.subscribe(() => {
      this.updateFromStore();
    });

    this.updateFromStore();
  }

  updateFromStore() {
    const state = store.getState();
    this.employees = state.employees.list;

    // Check if we're editing and get the employee data
    const params = state.route.params;
    if (params && params.id) {
      this.isEdit = true;
      const employeeId = params.id.toString();

      // Only try to find employee if we have employees loaded
      if (this.employees && this.employees.length > 0) {
        const employee = this.employees.find((emp) => {
          return emp.id.toString() === employeeId;
        });

        if (employee) {
          this.employee = {
            ...employee,
            dateOfEmployment: this.formatDateForInput(
              employee.dateOfEmployment
            ),
            dateOfBirth: this.formatDateForInput(employee.dateOfBirth),
          };
        }
      } else {
        // Ensure employees are fetched if not available
        if (!state.employees.loading) {
          store.dispatch(fetchEmployees());
        }
      }
    } else {
      this.isEdit = false;
      // Reset to empty form for add mode
      this.employee = {
        firstName: '',
        lastName: '',
        dateOfEmployment: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        department: '',
        position: '',
      };
    }

    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  handleInput(e) {
    const {name, value} = e.target;
    this.employee = {
      ...this.employee,
      [name]: value,
    };

    if (this.errors[name]) {
      const newErrors = {...this.errors};
      delete newErrors[name];
      this.errors = newErrors;
    }
  }

  validateForm() {
    const validationErrors = validateEmployee(
      this.employee,
      this.employees,
      this.isEdit
    );
    this.errors = validationErrors;
    this.isFormValid = Object.keys(validationErrors).length === 0;
    return this.isFormValid;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    if (this.isEdit) {
      this.confirmDialogOpen = true;
    } else {
      this.saveEmployee();
    }
  }

  handleConfirm() {
    this.saveEmployee();
    this.confirmDialogOpen = false;
  }

  handleCancel() {
    this.confirmDialogOpen = false;
  }

  saveEmployee() {
    // trim all string values before saving
    const trimmedEmployee = {
      ...this.employee,
      firstName: this.employee.firstName.trim(),
      lastName: this.employee.lastName.trim(),
      email: this.employee.email.trim(),
      phoneNumber: this.employee.phoneNumber.trim(),
      department: this.employee.department.trim(),
      position: this.employee.position.trim(),
      // keep dates as they are since they're already formatted
      dateOfEmployment: this.employee.dateOfEmployment,
      dateOfBirth: this.employee.dateOfBirth,
    };

    if (this.isEdit) {
      store.dispatch(updateEmployee(trimmedEmployee));
    } else {
      store.dispatch(addEmployee(trimmedEmployee));
    }
    navigate('/employees');
  }

  goBack() {
    navigate('/employees');
  }

  render() {
    return html`
      <div class="form-container">
        <h1>${this.isEdit ? t('editEmployee') : t('addEmployee')}</h1>

        <form @submit=${this.handleSubmit}>
          <div class="form-grid">
            <div class="form-field">
              <label for="firstName">${t('firstName')}</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                .value=${this.employee.firstName}
                @input=${this.handleInput}
                class="${this.errors.firstName ? 'error' : ''}"
              />
              ${this.errors.firstName
                ? html`<div class="error-message">
                    ${this.errors.firstName}
                  </div>`
                : ''}
            </div>

            <div class="form-field">
              <label for="lastName">${t('lastName')}</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                .value=${this.employee.lastName}
                @input=${this.handleInput}
                class="${this.errors.lastName ? 'error' : ''}"
              />
              ${this.errors.lastName
                ? html`<div class="error-message">${this.errors.lastName}</div>`
                : ''}
            </div>

            <div class="form-field">
              <label for="dateOfEmployment">${t('dateOfEmployment')}</label>
              <input
                type="date"
                id="dateOfEmployment"
                name="dateOfEmployment"
                .value=${this.employee.dateOfEmployment}
                @input=${this.handleInput}
                class="${this.errors.dateOfEmployment ? 'error' : ''}"
              />
              ${this.errors.dateOfEmployment
                ? html`<div class="error-message">
                    ${this.errors.dateOfEmployment}
                  </div>`
                : ''}
            </div>

            <div class="form-field">
              <label for="dateOfBirth">${t('dateOfBirth')}</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                .value=${this.employee.dateOfBirth}
                @input=${this.handleInput}
                class="${this.errors.dateOfBirth ? 'error' : ''}"
              />
              ${this.errors.dateOfBirth
                ? html`<div class="error-message">
                    ${this.errors.dateOfBirth}
                  </div>`
                : ''}
            </div>

            <div class="form-field">
              <label for="phoneNumber">${t('phoneNumber')}</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+XX XXX XXX XX XX"
                .value=${this.employee.phoneNumber}
                @input=${this.handleInput}
                class="${this.errors.phoneNumber ? 'error' : ''}"
              />
              ${this.errors.phoneNumber
                ? html`<div class="error-message">
                    ${this.errors.phoneNumber}
                  </div>`
                : ''}
            </div>

            <div class="form-field">
              <label for="email">${t('email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                .value=${this.employee.email}
                @input=${this.handleInput}
                class="${this.errors.email ? 'error' : ''}"
              />
              ${this.errors.email
                ? html`<div class="error-message">${this.errors.email}</div>`
                : ''}
            </div>

            <div class="form-field">
              <label for="department">${t('department')}</label>
              <select
                id="department"
                name="department"
                .value=${this.employee.department}
                @change=${this.handleInput}
                class="${this.errors.department ? 'error' : ''}"
              >
                <option value="" disabled>${t('selectDepartment')}</option>
                <option value="Analytics">${t('analytics')}</option>
                <option value="Tech">${t('tech')}</option>
              </select>
              ${this.errors.department
                ? html`<div class="error-message">
                    ${this.errors.department}
                  </div>`
                : ''}
            </div>

            <div class="form-field">
              <label for="position">${t('position')}</label>
              <select
                id="position"
                name="position"
                .value=${this.employee.position}
                @change=${this.handleInput}
                class="${this.errors.position ? 'error' : ''}"
              >
                <option value="" disabled>${t('selectPosition')}</option>
                <option value="Junior">${t('junior')}</option>
                <option value="Medior">${t('medior')}</option>
                <option value="Senior">${t('senior')}</option>
              </select>
              ${this.errors.position
                ? html`<div class="error-message">${this.errors.position}</div>`
                : ''}
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click=${this.goBack}
              class="btn btn-secondary"
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
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              ${t('cancel')}
            </button>
            <button type="submit" class="btn btn-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                ></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              ${t('save')}
            </button>
          </div>
        </form>

        <confirmation-dialog
          ?open=${this.confirmDialogOpen}
          title=${t('confirmUpdate')}
          message=${t('updateConfirmationText')}
          confirmText=${t('proceed')}
          cancelText=${t('cancel')}
          @confirm=${this.handleConfirm}
          @cancel=${this.handleCancel}
        ></confirmation-dialog>
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
