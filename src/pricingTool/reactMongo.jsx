import { useState, useEffect } from "react";

function RecipeViewer({ selectedRecipe }) {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (!selectedRecipe) return;

    const fetchIngredients = async () => {//fetchIngredients function, aysnc added to optimize network requests
      try {
        //res = responsce
        const res = await fetch("http://localhost:5000/items");//http request to backend API endpoint
        const data = await res.json();//await means don't move until next line finishes this request
        console.log("Fetched data:", data);//debug code
        //example id: 68d6192bee5f5900881cd44d
        //find the recipe that matches what the user selected

        //TODO: whenever website and database are synced, set website to have same recipe IDs as database
        //WORKFLOW: recipe selected -> recipe id grabbed -> go to database and search for id ->
              //grab ingredients for that id -> display ingredients on website
        const recipe = data.find(
          (item) => item.name.toLowerCase() === selectedRecipe.toLowerCase()
        );
        // const recipe = data.find((item) => item._id === "68d6192bee5f5900881cd44d");

        if (recipe && recipe.ingredients) {
          // Pull only ingredient names into array
          const names = recipe.ingredients.map((ing) => ing.name);
          setIngredients(names);
        } else {
          setIngredients([]);
        }
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchIngredients();
  }, [selectedRecipe]);

  return (
    <div>
      <h2>{selectedRecipe} Ingredients</h2>
      <ul>
        {ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeViewer;
