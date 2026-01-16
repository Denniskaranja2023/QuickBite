// Base URL for API calls
// Change this to your deployed backend URL when ready for production
// For local development: 'http://localhost:5555'
// For production: your-deployed-backend-url
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5555';

export default API_BASE_URL;

