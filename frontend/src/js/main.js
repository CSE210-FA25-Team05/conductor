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

async function login() {
    try {
        const request = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            credentials: 'include',
        })
        data = await request.json()
        console.log("DATA LOGIN: ", data)
    } catch (e) {
        console.log("failed to login: ", e)
    }
}
async function logout() {
    try {
        const request = await fetch(`${API_BASE_URL}/logout`, { method: 'POST' })
        if (request.ok) {
            window.location.href = '/';
        } else {
            console.error("Logout request failed with status:", response.status);
        }
    } catch (e) {
        console.log("failed to login: ", e)
    }
}

function setup() {
    document.querySelector("#check-health-button").addEventListener('click', getHealth);
    document.querySelector("#logout-button").addEventListener('click', logout);
    document.querySelector("#login-button").addEventListener('click', login);
}

document.addEventListener('DOMContentLoaded', setup);
