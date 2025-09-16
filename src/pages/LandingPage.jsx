import { useNavigate } from 'react-router-dom';
import '../index.css'
import { useAuth0 } from "@auth0/auth0-react";

export const LandingPage = () => {
    const {isAuthenticated, user, loginWithRedirect, logout} = useAuth0();
    return(
        <div>
            <h1> Welcome to Big Spoon Yum</h1>
            <p> for all your dietary needs</p>
                
            <button onClick={() => loginWithRedirect()}>Log In</button>
        </div>
    );
}