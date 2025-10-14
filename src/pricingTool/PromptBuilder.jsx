import { useState, useEffect } from "react";
//import { GoogleGenerativeAI } from "./GoogleGenerativeAI";

function PricingTool({ shoppingList }) {
  // The shoppingList is passed directly as a prop, so we can render it.

  console.log("PricingTool received shoppingList:", shoppingList);
  if (!shoppingList || shoppingList.length === 0) {
    return <p>No ingredients in the shopping list.</p>;
  }
  else{
    //Grab just the ingredient names and place them into a new array
    const ingredientNames = shoppingList.map(ingredient => ingredient.name);
    console.log("Array of ingredient names:", ingredientNames);

    //initialize a string array of the same size
    const searchQueries = new Array(ingredientNames.length);

    //loop through ingredientNames to create the search strings
    for (let i = 0; i < ingredientNames.length; i++) {
      const ingredient = ingredientNames[i];
      searchQueries[i] = `cost of ${ingredient} in aldi in tuscaloosa alabama`;
    }

    // // You can now see the array of search query strings in the console
    // console.log("Search query strings:", searchQueries);
    // fetchPrices(searchQueries);
    // console.log("Fetched prices:", Response.text);
  }
  return (
    <div>
      <h2>Shopping List Ingredients</h2>
      <ul>
        {shoppingList.map((ing, i) => (
          <li key={i}>
            {ing.quantity} {ing.unit} {ing.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PricingTool;

