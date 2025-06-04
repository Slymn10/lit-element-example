import {LitElement, html, css} from 'lit';
import {t} from '../i18n/i18n.js';
import {navigate} from '../router.js';
import {store} from '../store/store.js';

export class NotFoundView extends LitElement {
  static get properties() {
    return {
      language: {type: String},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .not-found {
        padding: var(--space-8);
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
      }

      h1 {
        font-size: var(--font-size-3xl);
        color: var(--color-primary);
        margin-bottom: var(--space-4);
      }

      p {
        margin-bottom: var(--space-6);
        color: var(--color-text-secondary);
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-6);
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 500;
        cursor: pointer;
        transition: background-color var(--transition-fast) ease;
      }

      .btn:hover {
        background-color: var(--color-primary-dark);
      }
    `;
  }

  constructor() {
    super();
    this.language = store.getState().app.language;
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => {
      this.language = store.getState().app.language;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  goHome() {
    navigate('/');
  }

  render() {
    return html`
      <div class="not-found">
        <h1>404 - ${t('notFound')}</h1>
        <p>${t('notFoundMessage')}</p>
        <button @click=${this.goHome} class="btn">
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
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          ${t('returnHome')}
        </button>
      </div>
    `;
  }
}

customElements.define('not-found-view', NotFoundView);
