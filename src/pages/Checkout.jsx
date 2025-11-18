import { useEffect, useState } from "react";
import PricingTool from "../pricingTool/PromptBuilder";
import { Navigate, useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import { Heart } from "lucide-react";

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
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [numPeople, setNumPeople] = useState(10);
  const [recipeToShow, setRecipeToShow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("selectedRecipes");
    if (stored) {
      const recipes = JSON.parse(stored);
      setSelectedRecipes(recipes);
      // build combined shopping list
      setShoppingList(buildShoppingList(recipes, numPeople));
      
    }
  }, []);

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
