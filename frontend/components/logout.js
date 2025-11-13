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

    async logout() {
        try {
            const response = await fetch('http://localhost:3001/api/logout', { method: 'POST' })
            if (response.ok) {
                window.location.href = '/';
            } else {
                console.error("Logout response failed with status:", response.status);
            }
        } catch (e) {
            console.log("failed to login: ", e)
        }
    }
}

customElements.define("logout-button", LogoutButton);
