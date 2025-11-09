import { useEffect, useState } from "react";
import PricingTool from "../pricingTool/PromptBuilder";

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
    
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

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
      {selectedRecipes.map((r) => (
        <div key={r._id} className="mb-4">
          <h3 className="font-medium">{r.name}</h3>
            <p className="text-sm text-gray-600">
              Base: {r.numberOfPeople || 10} servings
            </p>
        </div>
      ))}

      {/* Render the PricingTool component here and pass the shoppingList as a prop */}
      <PricingTool shoppingList={shoppingList} />
    </div>
  );
}

// helper
function buildShoppingList(recipes, numPeople) {
  const list = {};
  recipes.forEach((recipe) => {
    const baseServings = recipe.numberOfPeople || 10;
    const scaleFactor = numPeople / baseServings;
    recipe.ingredients.forEach((ing) => {
      const key = `${ing.name}-${ing.unit || ""}`;
      const scaledQuantity = ing.quantity * scaleFactor;
      if (!list[key]) {
        list[key] = { ...ing, quantity: scaledQuantity };
      } else {
        list[key].quantity += scaledQuantity;
      }
    });
  });
  return Object.values(list);
}
