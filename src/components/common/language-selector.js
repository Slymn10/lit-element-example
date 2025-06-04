import { LitElement, html, css } from 'lit';
import { store } from '../../store/store.js';
import { t } from '../../i18n/i18n.js';

export class LanguageSelector extends LitElement {
  static get properties() {
    return {
      language: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .language-selector {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .language-button {
        background: none;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--space-1) var(--space-2);
        cursor: pointer;
        transition: background-color var(--transition-fast) ease;
      }

      .language-button.active {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }

      .language-button:not(.active):hover {
        background-color: var(--color-background);
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

  setLanguage(lang) {
    store.dispatch({
      type: 'SET_LANGUAGE',
      payload: lang
    });
  }

  render() {
    return html`
      <div class="language-selector">
        <span>${t('language')}:</span>
        <button 
          @click=${() => this.setLanguage('en')} 
          class="language-button ${this.language === 'en' ? 'active' : ''}"
        >
          EN
        </button>
        <button 
          @click=${() => this.setLanguage('tr')} 
          class="language-button ${this.language === 'tr' ? 'active' : ''}"
        >
          TR
        </button>
      </div>
    `;
  }
}

customElements.define('language-selector', LanguageSelector);