import {LitElement, html, css} from 'lit';
import {store} from '../store/store.js';
import {
  fetchEmployees,
  deleteEmployee,
  setDisplayMode,
  setPaginationState,
} from '../store/actions/employee-actions.js';
import {navigate} from '../router.js';
import {t} from '../i18n/i18n.js';
import '../components/employee/employee-table.js';
import '../components/employee/employee-list-view.js';
import '../components/common/pagination.js';

export class EmployeeList extends LitElement {
  static get properties() {
    return {
      employees: {type: Array},
      filteredEmployees: {type: Array},
      displayMode: {type: String},
      loading: {type: Boolean},
      searchQuery: {type: String},
      currentPage: {type: Number},
      itemsPerPage: {type: Number},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-4);
      }

      h1 {
        margin: 0;
        color: var(--color-primary);
        font-weight: 400;
      }

      .view-toggle {
        display: flex;
        gap: var(--space-2);
      }

      .toggle-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        background-color: var(--color-surface);
        cursor: pointer;
        transition: all var(--transition-fast) ease;
      }

      .toggle-button.active {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }

      .toggle-button:not(.active):hover {
        border-color: var(--color-primary-light);
        background-color: var(--color-background);
      }

      .search-bar {
        display: flex;
        margin-bottom: var(--space-4);
      }

      .search-input {
        flex: 1;
        padding: var(--space-2) var(--space-3);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-md);
        transition: border-color var(--transition-fast) ease;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
      }

      .search-input::placeholder {
        color: var(--color-text-disabled);
      }

      @media (max-width: 768px) {
        .list-header {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-2);
        }

        .view-toggle {
          align-self: flex-end;
        }
      }
    `;
  }

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.displayMode = 'table';
    this.loading = false;
    this.searchQuery = '';
    this.currentPage = 1;
    this.itemsPerPage = 20;
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.employees = state.employees.list;
      this.loading = state.employees.loading;
      this.displayMode = state.app.displayMode;

      if (state.app.pagination) {
        this.searchQuery = state.app.pagination.searchQuery || '';
      }

      this.filterEmployees();
    });

    store.dispatch(fetchEmployees());
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.savePaginationState();

    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  savePaginationState() {
    store.dispatch(
      setPaginationState({
        currentPage: 1,
        searchQuery: this.searchQuery,
      })
    );
  }

  toggleDisplayMode(mode) {
    store.dispatch(setDisplayMode(mode));
  }

  handleSearch(e) {
    this.searchQuery = e.target.value;
    this.currentPage = 1;
    this.filterEmployees();

    this.savePaginationState();
  }

  filterEmployees() {
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.filteredEmployees = this.employees.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(query) ||
          employee.lastName.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query) ||
          employee.department.toLowerCase().includes(query) ||
          employee.position.toLowerCase().includes(query)
      );
    } else {
      this.filteredEmployees = [...this.employees];
    }

    if (this.currentPage > this.getTotalPages()) {
      this.currentPage = Math.max(1, this.getTotalPages());
    }

    this.requestUpdate();
  }

  getPaginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, endIndex);
  }

  getTotalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;

    this.savePaginationState();
  }

  handleEdit(e) {
    this.savePaginationState();

    const {employee} = e.detail;
    navigate(`/employees/${employee.id}/edit`);
  }

  handleDelete(e) {
    const {id} = e.detail;
    store.dispatch(deleteEmployee(id));
  }

  render() {
    const paginatedEmployees = this.getPaginatedEmployees();
    const totalPages = this.getTotalPages();

    return html`
      <div class="list-header">
        <h1>${t('employeeList')}</h1>
        <div class="view-toggle">
          <button
            @click=${() => this.toggleDisplayMode('table')}
            class="toggle-button ${this.displayMode === 'table'
              ? 'active'
              : ''}"
            title=${t('tableView')}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <button
            @click=${() => this.toggleDisplayMode('list')}
            class="toggle-button ${this.displayMode === 'list' ? 'active' : ''}"
            title=${t('listView')}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
      </div>

      <div class="search-bar">
        <input
          type="text"
          class="search-input"
          placeholder=${t('search')}
          .value=${this.searchQuery}
          @input=${this.handleSearch}
        />
      </div>

      ${this.displayMode === 'table'
        ? html`
            <employee-table
              .employees=${paginatedEmployees}
              @edit=${this.handleEdit}
              @delete=${this.handleDelete}
            ></employee-table>
          `
        : html`
            <employee-list-view
              .employees=${paginatedEmployees}
              @edit=${this.handleEdit}
              @delete=${this.handleDelete}
            ></employee-list-view>
          `}
      ${totalPages > 1
        ? html`
            <app-pagination
              .currentPage=${this.currentPage}
              .totalPages=${totalPages}
              .visiblePageCount=${5}
              @page-change=${this.handlePageChange}
            ></app-pagination>
          `
        : ''}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
