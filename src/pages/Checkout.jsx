import { useEffect, useState } from "react";
import PricingTool from "../pricingTool/reactMongo";

export const Checkout = () => {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedRecipes");
    if (stored) {
      const recipes = JSON.parse(stored);
      setSelectedRecipes(recipes);
      // build combined shopping list
      setShoppingList(buildShoppingList(recipes));
      
    }
  }, []);
  return (
    
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <h2 className="text-xl font-semibold mb-2">Selected Recipes</h2>
      {selectedRecipes.map((r) => (
        <div key={r._id} className="mb-4">
          <h3 className="font-medium">{r.name}</h3>
        </div>
      ))}

      {/* Render the PricingTool component here and pass the shoppingList as a prop */}
      <PricingTool shoppingList={shoppingList} />
    </div>
  );
}

// helper
function buildShoppingList(recipes) {
  const list = {};
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      const key = `${ing.name}-${ing.unit || ""}`;
      if (!list[key]) {
        list[key] = { ...ing };
      } else {
        list[key].quantity += ing.quantity;
      }
    });
  });
  return Object.values(list);
}
