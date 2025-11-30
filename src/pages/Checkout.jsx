import { useEffect, useState } from "react";
import PricingTool from "../pricingTool/PromptBuilder";
import { Navigate, useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import { Heart, LucidePencil } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

export function formatQty(value, maxDecimals = 2) {
  if (typeof value !== "number" || isNaN(value)) return value;

  // If it’s basically an integer, show no decimals
  if (Math.abs(value - Math.round(value)) < 0.0001) {
    return Math.round(value);
  }

  // Otherwise show up to `maxDecimals` decimals, removing trailing zeros
  return parseFloat(value.toFixed(maxDecimals));
}

export const Checkout = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [numPeople, setNumPeople] = useState(10);
  const [recipeToShow, setRecipeToShow] = useState(null);
  const [itinerary, setItinerary] = useState([])
  const [isItinNamePopupOpen, setIsItinNamePopupOpen] = useState(false);
  const [isItinDescPopupOpen, setIsItinDescPopupOpen] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const stored = localStorage.getItem("selectedRecipes");
  //   console.log(stored)
  //   if (stored) {
  //     const recipes = JSON.parse(stored);
  //     setSelectedRecipes(recipes);
  //     // build combined shopping list
  //     setShoppingList(buildShoppingList(recipes, numPeople));
      
  //   }
  // }, []);

  

  // Load Itinerary
  useEffect(() => {
    const storedItineraryId = localStorage.getItem("currentItineraryId");
    
    const loadItin = async () => {
      try {
        // Use the ID directly, not stored._id
        const res = await fetch(`https://bsy-backend.vercel.app/api/itenerary?id=${storedItineraryId}`);
        
        if (!res.ok) {
          throw new Error("Failed to load itinerary");
        }
        
        const data = await res.json();
        
        // If your backend returns a single itinerary object (not an array)
        // you'll need to access data.recipeList
        const recipeIds = data.recipeList.map((item) => item.recipe_id);
        
        // Now fetch the actual recipe details
        const recipeRes = await fetch(`https://bsy-backend.vercel.app/api/items`);
        const allRecipes = await recipeRes.json();
        
        // Filter to get only the recipes in this itinerary
        const itineraryRecipes = allRecipes.filter(r => recipeIds.includes(r._id));
        setItinerary(data)
        setSelectedRecipes(itineraryRecipes);
        setShoppingList(buildShoppingList(itineraryRecipes, numPeople));
      } catch (err) {
        console.error("Error loading itinerary:", err);
      }
    };
    
    if (storedItineraryId) loadItin();
    
  }, [user, numPeople]);

  const handleInputChangeName = (e) => {
    setItinerary(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleInputChangeDesc = (e) => {
    setItinerary(prev => ({
      ...prev,
      shortDesc: e.target.value
    }));
  };

// Also add a function to save the updated name to the backend
  const handleSaveName = async () => {
    try {
      const storedItineraryId = localStorage.getItem("currentItineraryId");
      const response = await fetch(`https://bsy-backend.vercel.app/api/itenerary?id=${storedItineraryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: itinerary.name,
          shortDesc: itinerary.shortDesc,
          recipeList: itinerary.recipeList
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update itinerary name");
      }

      console.log("Itinerary name updated successfully");
      setIsItinNamePopupOpen(false);
      setIsItinDescPopupOpen(false);
    } catch (error) {
      console.error("Error updating itinerary name:", error);
      alert("Failed to update itinerary name. Please try again.");
    }
  };

  

  useEffect(() => {
    if (selectedRecipes.length > 0) {
      const list = buildShoppingList(selectedRecipes, numPeople);
      setShoppingList(list);
    }
  }, [selectedRecipes, numPeople]);

  return (
    <div>
      <div className="flex justify-between items-center p-4 page-title">
          <button onClick={() => navigate("/dashboard")}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} className="w-30 h-20 logo-hover-blue"/>
          </button>
          <button onClick={() => navigate("/recipes")} className='cosmic-button'> All Recipes </button>
      </div>

      <div className="p-8">

        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <Popup
          isOpen={!!recipeToShow}
          onClose={() => setRecipeToShow(null)}
        >
          {recipeToShow && (
            <div>
              <h1 className="text-2xl font-bold">{recipeToShow.name}</h1>
              <p style={{ whiteSpace: 'pre-line' }}>{recipeToShow.instructions}</p>
            </div>  
          )}
        </Popup>

          <div className="mb-8">
            <label className="block font-semibold mb-2">Number of People</label>
            <input
              type="number"
              min="1"
              className="border border-gray-300 rounded px-3 py-2 w-32"
              value={numPeople}
              onChange={(e) => setNumPeople(Number(e.target.value))}
            />
          </div>
        <div className='flex items-center justify-center gap-4'>
          {/* EDIT NAME */}
          <h2 className="text-xl font-semibold mb-2">{itinerary.name}</h2>
          <button onClick={() => setIsItinNamePopupOpen(true)}><LucidePencil/></button>
          <Popup isOpen={isItinNamePopupOpen} onClose={() => setIsItinNamePopupOpen(false)}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Edit Itinerary Name</h3>
              <input 
                type="text" 
                value={itinerary.name || ''} 
                onChange={handleInputChangeName} 
                placeholder='Enter itinerary name...'
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setIsItinNamePopupOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveName}
                  className="cosmic-button"
                >
                  Save
                </button>
              </div>
            </div>
          </Popup>
        </div>
        <div className='flex items-center justify-center gap-4'>
          {/* EDIT SHORT DESC */}
          <h2 className="text-xl font-semibold mb-2">{itinerary.shortDesc}</h2>
          <button onClick={() => setIsItinDescPopupOpen(true)}><LucidePencil/></button>
          <Popup isOpen={isItinDescPopupOpen} onClose={() => setIsItinDescPopupOpen(false)}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Edit Itinerary Description</h3>
              <input 
                type="text" 
                value={itinerary.shortDesc || ''} 
                onChange={handleInputChangeDesc} 
                placeholder='Enter itinerary description...'
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setIsItinDescPopupOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveName}
                  className="cosmic-button"
                >
                  Save
                </button>
              </div>
            </div>
          </Popup>
        </div>
        <h2 className="text-xl font-semibold mb-2">Selected Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {selectedRecipes.map((r) => (
            <article
              key={r._id}
              onClick={() => setRecipeToShow(r)}
              className='rounded-2xl border bg-white p-5 shadow-sm hover:shadow transition cursor-pointer'
              title="Click to select"
            >
              <h4 className="font-semibold text-lg">{r.name}</h4>
          
              {/* tag pills */}
              {Array.isArray(r.filters) && r.filters.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                                
                  {r.filters.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
                            
          
              {/* simple metadata */}
              <p className="text-sm text-gray-600 mt-3">
                {typeof r.time === "number" ? `${r.time} min • ` : ""}
                {typeof r.numberOfPeople === "number"
                  ? `Base: ${r.numberOfPeople} servings`
                  : ""}
              </p>
      
            </article>





            // <div key={r._id} className="mb-4">
            //   <h3 className="font-medium">{r.name}</h3>
            //     <p className="text-sm text-gray-600">
            //       Base: {r.numberOfPeople || 10} servings
            //     </p>
            // </div>
          ))}
        </div>

        {/* Render the PricingTool component here and pass the shoppingList as a prop */}
        <PricingTool shoppingList={shoppingList} />
      </div>
    </div>
  );
}

// helper
function buildShoppingList(recipes, numPeople) {
  const list = {};
  recipes.forEach((recipe) => {
    // default to 10 people if no info provided
    const baseServings = recipe.numberOfPeople || 10;
    const scaleFactor = numPeople / baseServings;
    recipe.ingredients.forEach((ing) => {
      const key = `${ing.name}-${ing.unit || ""}`;
      // round scaled values to 2 decimal places
      const rawScaledQuantity = ing.quantity * scaleFactor;
      console.log(rawScaledQuantity);
      const scaledQuantity = rawScaledQuantity.toFixed(2);
      console.log(scaledQuantity)
      if (!list[key]) {
        list[key] = { ...ing, quantity: scaledQuantity };
      } else {
        list[key].quantity += scaledQuantity;
      }
    });
  });
  return Object.values(list);
}
