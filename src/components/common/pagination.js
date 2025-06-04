import {LitElement, html, css} from 'lit';

export class Pagination extends LitElement {
  static get properties() {
    return {
      currentPage: {type: Number},
      totalPages: {type: Number},
      visiblePageCount: {type: Number},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--space-1);
        margin: var(--space-4) 0;
      }

      .page-button {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        background-color: var(--color-surface);
        cursor: pointer;
        transition: all var(--transition-fast) ease;
      }

      .page-button:hover:not(.active) {
        background-color: var(--color-background);
        border-color: var(--color-primary-light);
      }

      .page-button.active {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }

      .arrow-button {
        color: var(--color-text-secondary);
      }

      .arrow-button:hover {
        color: var(--color-primary);
      }

      .arrow-button.disabled {
        color: var(--color-text-disabled);
        cursor: not-allowed;
      }

      .arrow-button.disabled:hover {
        background-color: var(--color-surface);
        color: var(--color-text-disabled);
        border-color: var(--color-border);
      }

      .ellipsis {
        margin: 0 var(--space-1);
      }
    `;
  }

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.visiblePageCount = 5;
  }

  goToPage(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: {page},
      })
    );
  }

  getVisiblePages() {
    const pages = [];

    if (this.totalPages <= this.visiblePageCount) {
      // Show all pages if total is less than visible count
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate visible page range
      let startPage = Math.max(
        1,
        this.currentPage - Math.floor(this.visiblePageCount / 2)
      );
      let endPage = startPage + this.visiblePageCount - 1;

      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(1, endPage - this.visiblePageCount + 1);
      }

      // Add first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add last page
      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) {
          pages.push('...');
        }
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  render() {
    const visiblePages = this.getVisiblePages();

    return html`
      <div class="pagination">
        <button
          @click=${() => this.goToPage(this.currentPage - 1)}
          class="page-button arrow-button ${this.currentPage === 1
            ? 'disabled'
            : ''}"
          ?disabled=${this.currentPage === 1}
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
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        ${visiblePages.map((page) =>
          page === '...'
            ? html`<span class="ellipsis">...</span>`
            : html`
                <button
                  @click=${() => this.goToPage(page)}
                  class="page-button ${page === this.currentPage
                    ? 'active'
                    : ''}"
                >
                  ${page}
                </button>
              `
        )}

        <button
          @click=${() => this.goToPage(this.currentPage + 1)}
          class="page-button arrow-button ${this.currentPage === this.totalPages
            ? 'disabled'
            : ''}"
          ?disabled=${this.currentPage === this.totalPages}
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
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;
  }
}

customElements.define('app-pagination', Pagination);
