import {LitElement, html, css} from 'lit';
import {store} from './store/store.js';
import './components/navigation/app-header.js';
import './components/navigation/app-footer.js';
import './components/common/language-selector.js';
import './views/employee-list.js';
import './views/employee-form.js';
import './views/not-found.js';
import './router.js';
import {subscribe} from './utils/store-subscriber.js';
import {initializeRouter} from './router.js';
import {loadTranslations} from './i18n/i18n.js';

export class EmployeeApp extends LitElement {
  static get properties() {
    return {
      language: {type: String},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      main {
        flex: 1;
        padding: var(--space-4);
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }

      @media (max-width: 768px) {
        main {
          padding: var(--space-2);
        }
      }
    `;
  }

  constructor() {
    super();
    this.language = store.getState().app.language;

    document.documentElement.lang = this.language;
    loadTranslations(this.language);

    subscribe(store, (state) => {
      if (state.app.language !== this.language) {
        this.language = state.app.language;
        document.documentElement.lang = this.language;
        loadTranslations(this.language);
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    // initialize the router after a small delay to ensure DOM is ready
    setTimeout(() => {
      initializeRouter();
    }, 0);
  }

  render() {
    return html`
      <app-header></app-header>
      <main>
        <slot></slot>
      </main>
      <app-footer></app-footer>
    `;
  }
}

customElements.define('employee-app', EmployeeApp);
