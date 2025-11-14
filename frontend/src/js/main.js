// Frontend JavaScript

const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('App loaded');

  // Test API connection
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('API connected:', data);
  } catch (error) {
    console.error('API error:', error);
  }
});
