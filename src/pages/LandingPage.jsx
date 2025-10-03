import { useNavigate } from 'react-router-dom';
import '../index.css'
import { useAuth0 } from "@auth0/auth0-react";

export const LandingPage = () => {
    const {isAuthenticated, user, loginWithRedirect, logout} = useAuth0();
    return(
        <div>
            <div className="font-bold text-4xl text-primary">
                <h1 > Welcome to </h1>
                <div className="flex justify-center items-center">
                    <img src="/logo.png" className=" h-100 w-150"/>
                </div>
            
                <p> for all your dietary needs</p>

            </div>
            

            <div className="flex justify-center items-center h-65">
                <button className="cosmic-button"onClick={() => loginWithRedirect()}>Log In</button>
            </div>
            
        </div>
    );
}