class OAuth extends HTMLButtonElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('click', this.handleClick);
  }

  handleClick() {
    console.log('Google OAuth button clicked!');
    // TODO: do something
  }
}

customElements.define('google-oauth', OAuth, { extends: 'button' });
