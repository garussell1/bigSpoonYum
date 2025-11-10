import express from "express";
import cors from "cors";
import "dotenv/config"; //loads environment variables from .env file
import {GoogleGenAI} from "@google/genai";

const app = express();
// Will's fix
// app.disable('x-powered-by');
const port = 5001; // Using a different port from your React app

app.use(cors()); //React talks to server
app.use(express.json());

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});
app.post("/api/get-prices", async (req, res) => {
  const { searchQueries } = req.body;
  console.log("Received search queries:", searchQueries);//debug
  if (!searchQueries || !Array.isArray(searchQueries)) {
    return res.status(400).json({ error: "searchQueries must be an array." });
  }

  try {
    const model = genAI.models.generateContent({ model: "gemini-2.5-flash" });
    
    // We send all queries in one go for efficiency
    const prompt = "Provide a price estimate for each of the following items, " +
      "returning only a JSON array of strings with the prices. For example:" +
      " [\"$2.99\", \"$5.49\", \"$1.25\"]. Items: " + searchQueries.join(", ");
    const result = await genAI.models.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // The AI should return a JSON string like '["$2.99", "$5.49"]'
    // We parse it into a real array before sending it to the frontend
    const prices = JSON.parse(text);
    console.log("Fetched prices from AI:", prices);//DEBUG
    res.json({ prices });

  } 
  catch (error) 
  {
    console.error("Error calling Google AI:", error);
    res.status(500).json({ error: "Failed to fetch prices from AI." });
  }
});

//start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});