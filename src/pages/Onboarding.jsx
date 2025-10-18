import { useAuth0 } from "@auth0/auth0-react";
import Popup from "../components/Popup";
import { useState } from "react";


export const Onboarding = () => {
    const { user, isAuthenticated, isLoading, logout } = useAuth0();
    const [isPopupOpen, setIsPopupOpen] = useState(true);
    const [displayName, setDisplayName] = useState("");


    const handleAddUser = async(displayName) => {
        try{
            const res = await fetch(`http://localhost:5000/users`, {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id : user.sub,
                    oauth_sub : user.sub,
                    name: displayName,
                    email: user.email,
                    onboarded: true,
                }),
            });
            if(!res.ok) throw new Error("Failed to update Users");
            setIsPopupOpen(false);
        }catch (err){
            console.error("Error updating favorites:", err);
        }
    };


    return(
       <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
            <h2> Hey Newbie! Please fill out this form to continue! </h2>
            <div>
                <label htmlFor="displayName" className="block mb-2 text-sm font-medium text-primary ">Display Name</label>
                <input onChange={(e) => setDisplayName(e.target.value)} type="text" id="displayName" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5" placeholder="Clippy" required />      
            </div>    
            
            <button onClick={() => handleAddUser(displayName)} className="cosmic-button"> Welcome to Big Spoon Yum </button>
       </Popup>
    )
};