// Base URL for API calls
// IMPORTANT: For production, deploy backend to HTTPS and set VITE_API_BASE_URL
// When frontend is on HTTPS, backend must also be on HTTPS for session cookies to work
// Local development: 'http://localhost:5555'
// Production: your-https-backend-url (e.g., 'https://your-backend.onrender.com')
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5555';

export default API_BASE_URL;

