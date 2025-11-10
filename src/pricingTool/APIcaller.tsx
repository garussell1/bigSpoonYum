// /**
//  * Fetches price estimates for a list of items by calling your backend server.
//  * @param {string[]} constructedPrompts - An array of item prompts.
//  * @returns {Promise<string[]>} A promise that resolves to an array of price strings.
//  */
export async function fetchPrices(constructedPrompts: string[]) {
  //API endpoint we call to, defined in  Express server's endpoint
  const API_URL = "https://bsy-backend.vercel.app/api/pricing"; 

  if (!constructedPrompts || constructedPrompts.length === 0) 
{
    return [];
  }// If no prompts, return empty array

  try {
    //fetch sends website(post) request
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ searchQueries: constructedPrompts }),
      //stringify converts JS to JSON string 
      //"FETCH" only sends plaintext, that is why we must convert
      //searchQueries is what server expects, as defined in server.js
    });

    //server-side errors (400 or 500)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    //Parse the JSON response
    const data = await response.json();
    //response comes from server as JSON obj, must translate to JS obj so it can be assigned here
    
    // The server is designed to return the array of prices directly
    return data.prices; 

  } 
  catch (error) 
  {
    console.error("Error fetching prices from server:", error);
    //If the call fails, return an empty array
    return []; 
  }
}