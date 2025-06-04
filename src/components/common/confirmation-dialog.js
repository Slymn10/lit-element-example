import {LitElement, html, css} from 'lit';
import {t} from '../../i18n/i18n.js';

export class ConfirmationDialog extends LitElement {
  static get properties() {
    return {
      open: {type: Boolean},
      title: {type: String},
      message: {type: String},
      confirmText: {type: String},
      cancelText: {type: String},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity var(--transition-normal) ease,
          visibility var(--transition-normal) ease;
      }

      .overlay.open {
        opacity: 1;
        visibility: visible;
      }

      .dialog {
        background-color: var(--color-surface);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        width: 90%;
        max-width: 400px;
        box-shadow: var(--shadow-lg);
        transform: translateY(20px);
        opacity: 0;
        transition: transform var(--transition-normal) ease,
          opacity var(--transition-normal) ease;
      }

      .overlay.open .dialog {
        transform: translateY(0);
        opacity: 1;
      }

      .dialog-header {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--color-primary);
        margin-bottom: var(--space-4);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        border: none;
        background: none;
        cursor: pointer;
        color: var(--color-primary);
        transition: all var(--transition-fast) ease;
        font-size: 28px;
        font-weight: bold;
      }

      .close-button:hover {
        background-color: rgba(255, 107, 0, 0.1);
        color: var(--color-primary);
      }

      .dialog-content {
        margin-bottom: var(--space-6);
      }

      .dialog-actions {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .btn {
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-md);
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: background-color var(--transition-fast) ease;
        width: 100%;
        align-self: center;
      }

      .btn-primary {
        background-color: var(--color-primary);
        color: white;
      }

      .btn-primary:hover {
        background-color: var(--color-primary-dark);
      }

      .btn-secondary {
        background-color: var(--color-background);
        color: var(--color-text-primary);
        border: 1px solid var(--color-border);
      }

      .btn-secondary:hover {
        background-color: var(--color-border);
      }
    `;
  }

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.message = '';
    this.confirmText = t('proceed');
    this.cancelText = t('cancel');
  }

  onConfirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
    this.open = false;
  }

  onCancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
    this.open = false;
  }

  updated(changedProperties) {
    if (changedProperties.has('open') && this.open) {
      setTimeout(() => {
        document.addEventListener('click', this.outsideClickHandler);
      }, 0);
    } else if (changedProperties.has('open') && !this.open) {
      document.removeEventListener('click', this.outsideClickHandler);
    }
  }

  outsideClickHandler = (e) => {
    const path = e.composedPath();
    if (path.includes(this.shadowRoot.querySelector('.dialog'))) {
      return;
    }
    this.open = false;
  };

  render() {
    return html`
      <div class="overlay ${this.open ? 'open' : ''}">
        <div class="dialog">
          <div class="dialog-header">
            ${this.title}
            <button @click=${this.onCancel} class="close-button">
              &times;
            </button>
          </div>
          <div class="dialog-content">${this.message}</div>
          <div class="dialog-actions">
            <button @click=${this.onConfirm} class="btn btn-primary">
              ${this.confirmText}
            </button>
            <button @click=${this.onCancel} class="btn btn-secondary">
              ${this.cancelText}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.outsideClickHandler);
  }
}

customElements.define('confirmation-dialog', ConfirmationDialog);
