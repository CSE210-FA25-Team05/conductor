class GoogleOAuthButton extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        const shadow = this.attachShadow({ mode: "open" });

        const button = document.createElement("button");
        button.textContent = "Login with Google"; // Use textContent for plain text

        // Apply some basic styling if needed (e.g., for the button)
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
        this.addEventListener('click', this.login.bind(this));

    }

    async login() {
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                credentials: 'include',
            })
            if (response.ok) {
                window.location.href = '/';
            }
        } catch (e) {
            console.log("failed to login: ", e)
        }
    }
}

customElements.define("google-oauth-button", GoogleOAuthButton);
