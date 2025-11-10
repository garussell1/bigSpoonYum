import { useState, useEffect } from "react";
import { fetchPrices } from "./APIcaller";

function PricingTool({ shoppingList }){
  // The shoppingList is passed directly as a prop, so we can render it.
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const[error, setError] = useState(null);

    useEffect(() => {
    // If the shopping list is empty, do nothing.
    if (!shoppingList || shoppingList.length === 0) {
      return;
    }

    // Define an async function to call the API
    const getPricesFromServer = async () => {
      setLoading(true);
      setError(null);

      try {
        //Build the prompts inside the effect, now that we have the shoppingList
        const ingredientNames = shoppingList.map(ingredient => ingredient.name);
        const constructedPrompts = ingredientNames.map(name => `${name} from aldi in tuscaloosa alabama`);

        console.log("Constructed Prompts:", constructedPrompts);//DEBUG

        //Call your fetchPrices function from APIcaller.tsx
        const fetchedPrices = await fetchPrices(constructedPrompts);
        
        setPrices(fetchedPrices);//Update state with the results

      } 
      catch (err)
      {
        setError("Could not fetch prices. Check server connection.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    //Call the function to start the process
    getPricesFromServer();
  }, [shoppingList]);

  //sum of total price function exists outside of useEffect to recalculate on prices change
  //
  const totalPrice = prices.reduce((sum,prices) => {
    const cleanPrice = String(prices).replace(/[$,\s]/g,'');//remove $ and other chars
    const priceValue = parseFloat(cleanPrice);//convert to float

    if (!isNaN(priceValue)){//add priceValue to sum only if it's a valid number
      return sum + priceValue;
    }
  }, 0).toFixed(2);//keep two decimals

  if (!shoppingList || shoppingList.length === 0) {
    return <p>Waiting for shopping list...</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mt-4">Shopping List Prices</h2>
      {loading && <p>Fetching prices...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {shoppingList.map((ing, i) => (
          <li key={i}>
            {ing.quantity} {ing.unit} {ing.name}
            {/* Display the price for the corresponding ingredient */}
            {prices[i] && <span className="font-bold ml-2">- {prices[i]}</span>}
          </li>
        ))}
      </ul>
      {/* Display the Total Price */}
      {prices.length > 0 && !loading && (
        <>
          <hr className="my-2 border-t border-gray-300" />
          <p className="text-xl font-bold mt-2">
            Total Estimated Price: ${totalPrice}
          </p>
        </>
      )}
    </div>
  );
}

export default PricingTool;

