// Dashboard.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace/>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded mt-4"
        onClick={() => logout({ returnTo: window.location.origin })}
      >
        Log Out
      </button>
    </div>
    
  );
};

export default Dashboard;
