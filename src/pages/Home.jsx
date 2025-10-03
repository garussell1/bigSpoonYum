import { useNavigate } from 'react-router-dom';
import '../index.css'
import { useAuth0 } from "@auth0/auth0-react";
import { LandingPage } from './LandingPage';

  

export const Home = () => {
    const {isAuthenticated, user, loginWithRedirect, logout} = useAuth0();
    const navigate = useNavigate();
    
    if(!isAuthenticated){
        return (
            <div>
                <LandingPage/>

            </div>
        );
    }else{
        return( 
        <div>
            <h1> Welcome {user.name } to Big Spoon Yum!</h1>
            <p> we love you and will do anything for you. I promise.</p>
            <button
                className="cosmic-button"
                onClick={() => navigate("/dashboard")}
            >
                Go to Dashboard
            </button>
             <button
                className="cosmic-button"
                onClick={() => navigate("/recipes")}
            >
                Go to Recipe Dashboard
            </button>
            <button className="cosmic-button" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log Out
            </button>
        </div>
        );
    }
}