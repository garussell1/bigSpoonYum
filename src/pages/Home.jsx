import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { useAuth0 } from "@auth0/auth0-react";
import { LandingPage } from './LandingPage';

export const Home = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div>
        <LandingPage />
      </div>
    );
  }

  // optionally render nothing or a loading spinner briefly while redirecting
  return null;
};
