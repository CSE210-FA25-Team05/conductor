const API_BASE_URL = 'http://localhost:3001/api';

async function getHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();

        //let checkHealthOutput= document.querySelectorAll("#check-health-output");
        //if (checkHealthOutput) {
        //    checkHealthOutput.innerHTML =
        //}
        console.log('API connected:', data);
    } catch (error) {
        console.error('API error:', error);
    }
}

function setup() {
    document.querySelector("#check-health-button").addEventListener('click', getHealth);
}

document.addEventListener('DOMContentLoaded', setup);
