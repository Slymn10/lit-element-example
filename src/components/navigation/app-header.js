import { LitElement, html, css } from 'lit';
import { store } from '../../store/store.js';
import { navigate } from '../../router.js';
import { t } from '../../i18n/i18n.js';

export class AppHeader extends LitElement {
  static get properties() {
    return {
      language: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background-color: var(--color-surface);
        box-shadow: var(--shadow-sm);
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-4);
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--color-primary);
        font-weight: 600;
        font-size: var(--font-size-xl);
        cursor: pointer;
      }

      .logo svg {
        width: 24px;
        height: 24px;
      }

      .nav {
        display: flex;
        align-items: center;
        gap: var(--space-4);
      }

      .nav-links {
        display: flex;
        gap: var(--space-4);
      }

      .nav-link {
        color: var(--color-text-secondary);
        text-decoration: none;
        font-weight: 500;
        transition: color var(--transition-fast) ease;
      }

      .nav-link:hover, .nav-link.active {
        color: var(--color-primary);
      }

      .add-button {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        padding: var(--space-2) var(--space-4);
        font-weight: 500;
        transition: background-color var(--transition-fast) ease;
      }

      .add-button:hover {
        background-color: var(--color-primary-dark);
      }

      .language-toggle {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-left: var(--space-4);
      }

      @media (max-width: 768px) {
        .header {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-4);
          padding: var(--space-4) var(--space-2);
        }

        .nav {
          width: 100%;
          justify-content: space-between;
        }
      }

      @media (max-width: 480px) {
        .nav {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-2);
        }

        .nav-links {
          width: 100%;
          justify-content: space-between;
        }
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

  toggleLanguage() {
    const newLanguage = this.language === 'en' ? 'tr' : 'en';
    store.dispatch({
      type: 'SET_LANGUAGE',
      payload: newLanguage
    });
  }

  navigateTo(path) {
    navigate(path);
  }

  render() {
    return html`
      <div class="header">
        <div class="logo" @click=${() => this.navigateTo('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>ING</span>
        </div>
        <div class="nav">
          <div class="nav-links">
            <a href="/employees" class="nav-link">${t('employees')}</a>
          </div>
          <button @click=${() => this.navigateTo('/employees/new')} class="add-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            ${t('addNew')}
          </button>
          <div class="language-toggle">
            <button @click=${this.toggleLanguage} class="nav-link">
              ${this.language === 'en' ? 'TR' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-header', AppHeader);