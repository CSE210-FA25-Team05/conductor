import styles from './modal.css?inline';

class Modal extends HTMLElement {
  constructor() {
    super();
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleDialogCancel = this.handleDialogCancel.bind(this);
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <dialog id="dialog">
        <header>
          <button class="modal-close" id="closeBtn" aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <article class="modal-content">
          <slot name="content"></slot>
        </article>
        <footer class="modal-buttons" part="button-footer">
          <slot name="buttons"></slot>
        </footer>
      </dialog>
    `;

    this.dialog = this.shadowRoot.getElementById('dialog');
    this.closeBtn = this.shadowRoot.getElementById('closeBtn');
    this.buttonsSlot = this.shadowRoot.getElementById('buttons');

    this.setAttribute('closed', '');
    this.updateVisibility();

    this.closeBtn.addEventListener('click', this.handleCloseClick);
    this.dialog.addEventListener('click', this.handleBackdropClick);
    this.dialog.addEventListener('cancel', this.handleDialogCancel);

    this.updateButtonAlignment();
  }

  static get observedAttributes() {
    return ['open', 'closed', 'button-align'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open' || name === 'closed') {
      this.updateVisibility();
      // Prevent body scroll when modal is open
      if (this.hasAttribute('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    if (name === 'button-align') {
      this.updateButtonAlignment();
    }
  }

  disconnectedCallback() {
    document.body.style.overflow = '';
    this.closeBtn.removeEventListener('click', this.handleCloseClick);
    this.dialog.removeEventListener('click', this.handleBackdropClick);
    this.dialog.removeEventListener('cancel', this.handleDialogCancel);
  }

  updateVisibility() {
    if (this.hasAttribute('open')) {
      this.dialog.showModal();
      this.removeAttribute('closed');
    } else {
      this.dialog.close();
      this.setAttribute('closed', '');
    }
  }

  updateButtonAlignment() {
    const align = this.getAttribute('button-align') || 'end';
    this.buttonsSlot.style.justifyContent = align === 'start' ? 'flex-start' : 'flex-end';
  }

  open() {
    this.setAttribute('open', '');
    this.removeAttribute('closed');
  }

  close() {
    this.removeAttribute('open');
    this.setAttribute('closed', '');
  }

  handleBackdropClick(event) {
    const rect = this.dialog.getBoundingClientRect();
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    // Check if click is outside the dialog bounding box
    if (
      clickX < rect.left ||
      clickX > rect.right ||
      clickY < rect.top ||
      clickY > rect.bottom
    ) {
      this.close();
    }
  }

  handleDialogCancel(event) {
    event.preventDefault();
    this.close();
  }

  handleCloseClick(event) {
    event.stopPropagation();
    this.close();
  }
}

customElements.define('modal-component', Modal);
