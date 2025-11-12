class ConductorMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        const shadow = this.attachShadow({ mode: "open" });

        // Create nav element
        const nav = document.createElement("nav");
        // Attach
        shadow.appendChild(nav);

        // Create li elements
        const liDashboard = document.createElement("li");
        const liLogout = document.createElement("li");
        const liJournal = document.createElement("li");
        //Attach
        nav.appendChild(liDashboard);
        nav.appendChild(liJournal);
        nav.appendChild(liLogout);

        // Create inner elements
        const aJournal = document.createElement("a");
        aJournal.innerHTML = "Journal"
        aJournal.href = "index.html"
        const aDashboard = document.createElement("a");
        aDashboard.innerText = "Dashboard"
        aDashboard.href = "index.html"
        const buttonLogout = document.createElement("button");
        buttonLogout.innerText = "Logout";
        //Attach
        liDashboard.appendChild(aDashboard);
        liJournal.appendChild(aJournal);
        liLogout.appendChild(buttonLogout); // Update this with logout componenet
    }
}

customElements.define("conductor-menu", ConductorMenu);

