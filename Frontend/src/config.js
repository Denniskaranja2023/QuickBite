// ============================================
// API Configuration - No environment variables needed!
// ============================================
// Just edit the PRODUCTION_BACKEND_URL below to point to your deployed backend

// Your production backend URL (e.g., Render, Railway, etc.)
const PRODUCTION_BACKEND_URL = 'https://your-quickbite-backend.onrender.com';

// Local development backend URL
const LOCAL_BACKEND_URL = 'http://localhost:5555';

// Auto-detect environment based on hostname
const isLocalEnvironment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Export the appropriate base URL
const API_BASE_URL = isLocalEnvironment ? LOCAL_BACKEND_URL : PRODUCTION_BACKEND_URL;

export default API_BASE_URL;

