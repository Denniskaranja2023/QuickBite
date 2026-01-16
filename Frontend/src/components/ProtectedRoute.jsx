import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ user, allowedUserTypes, children }) {
  // Check if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user type is allowed (if specified)
  if (allowedUserTypes && !allowedUserTypes.includes(user.user_type)) {
    // Redirect to their appropriate dashboard based on user type
    return <Navigate to={`/${user.user_type}/dashboard`} replace />;
  }

  // If children are provided, render them (for layout wrappers)
  // Otherwise, render the outlet for nested routes
  return children || <Outlet />;
}

export default ProtectedRoute;

