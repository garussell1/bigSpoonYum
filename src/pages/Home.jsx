import { useNavigate } from 'react-router-dom';
import '../index.css'
import { useAuth0 } from "@auth0/auth0-react";

  

export const Home = () => {
    const {isAuthenticated, user, loginWithRedirect, logout} = useAuth0();
    const navigate = useNavigate();
    
    if(!isAuthenticated){
        return (
            <div>
                <h1> Welcome to Big Spoon Yum</h1>
                <p> for all your dietary needs</p>
                
                <button onClick={() => loginWithRedirect()}>Log In</button>

            </div>
        );
    }else{
        return( 
        <div>
            <h1> Welcome {user.name } to Big Spoon Yum!</h1>
            <p> we love you and will do anything for you. I promise.</p>
            <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => navigate("/dashboard")}
            >
                Go to Dashboard
            </button>
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
        </button>
        </div>
        );
    }
}