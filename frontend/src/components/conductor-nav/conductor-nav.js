import styles from './conductor-nav.css?inline';

class ConductorNav extends HTMLElement {
  constructor() {
    super();

    this.paths = {
      // Display name -> href
      Dashboard: 'dashboard.html',
      Signals: 'signals.html',
      Interactions: 'interactions.html',
      Atoms: 'atoms.html',
      Journals: 'journals.html',
    };
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' }); // Attach Shadow DOM

    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    for (const displayName of Object.keys(this.paths)) {
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.href = this.paths[displayName];
      a.textContent = displayName;

      li.appendChild(a);
      ul.appendChild(li);
    }
    nav.appendChild(ul);
    this.shadowRoot.appendChild(nav);
  }
}

customElements.define('conductor-nav', ConductorNav);
