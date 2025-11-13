class LogoutButton extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const button = document.createElement("button");
        button.textContent = "Logout";

        const style = document.createElement('style');
        style.textContent = `
            button {
                background-color: #4285F4;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            }
            button:hover {
                opacity: 0.9;
            }
        `;
        shadow.appendChild(style);
        shadow.appendChild(button);

        // Add event listener
        this.addEventListener('click', this.logout.bind(this));

    }

    logout() {
        console.log("logout");
    }
}

customElements.define("logout-button", LogoutButton);
