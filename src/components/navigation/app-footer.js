import {LitElement, html, css} from 'lit';
import {t} from '../../i18n/i18n.js';

export class AppFooter extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        background-color: var(--color-surface);
        border-top: 1px solid var(--color-border);
        padding: var(--space-4);
        text-align: center;
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
      }

      .footer {
        max-width: 1200px;
        margin: 0 auto;
      }
    `;
  }

  render() {
    return html`
      <div class="footer">
        <p>&copy; 2025 ${t('appTitle')}</p>
      </div>
    `;
  }
}

customElements.define('app-footer', AppFooter);
