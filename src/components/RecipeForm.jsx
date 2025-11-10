import { useState } from "react";
import FilterDropdown from "./FilterDropdown";

export default function RecipeForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(() => {
    return initialData
      ? {
          ...initialData,
          filters: Array.isArray(initialData.filters)
            ? initialData.filters
            : [],
          ingredients: Array.isArray(initialData.ingredients)
            ? initialData.ingredients
            : [{ name: "", quantity: 0, unit: "" }],
        }
      : {
          name: "",
          ingredients: [{ name: "", quantity: 0, unit: "" }],
          filters: [],
          instructions: "",
          time: 0,
          numberOfPeople: 1,
        };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "time" || name === "numberOfPeople" ? Number(value) : value,
    });
  };

  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData.ingredients];
    updated[index][name] = name === "quantity" ? Number(value) : value;
    setFormData({ ...formData, ingredients: updated });
  };

  const addIngredient = () =>
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: "", quantity: 0, unit: "" }],
    });

  const removeIngredient = (index) =>
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });

    const handleFiltersChange = (selectedFilters) => {
      setFormData({
        ...formData,
        filters: selectedFilters,
      });
    };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const url = initialData
      ? `https://bsy-backend.vercel.app/api/items${initialData._id}`  // Update if editing
      : "https://bsy-backend.vercel.app/api/items";                  // Create if adding new

    const method = initialData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to save recipe");
    }

    const savedRecipe = await response.json();
    console.log("Recipe saved:", savedRecipe);

    onSubmit(savedRecipe); // Notify parent (dashboard) to update state
    onCancel(); // Close form
  } catch (error) {
    console.error(error);
    alert("There was an error saving the recipe.");
  }
};


  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] p-6 overflow-y-auto">
    
            <form onSubmit={handleSubmit} className="recipe-form space-y-4 p-4">
                <h2 className="text-xl font-semibold mb-2">Add a New Recipe</h2>

                {/* Name */}
                <div className="flex flex-col">
                    <label className="font-medium">Name:</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Recipe name:"
                      value={formData.name}
                      onChange={handleChange}
                      className="border rounded p-2"
                    />
                </div>

                {/* Ingredients */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                    {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                        <input
                        type="text"
                        name="name"
                        placeholder="Ingredient"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, e)}
                        required
                        className="border rounded p-2 flex-1"
                        />
                        <input
                        type="number"
                        name="quantity"
                        placeholder="Qty"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, e)}
                        required
                        className="border rounded p-2 w-20"
                        />
                        <input
                        type="text"
                        name="unit"
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, e)}
                        required
                        className="border rounded p-2 w-24"
                        />
                        <button 
                        type="button" 
                        onClick={() => removeIngredient(index)} 
                        className="text-red-500 hover:underline"
                        >
                        Remove
                        </button>
                    </div>
                    ))}
                    <button 
                    type="button" 
                    onClick={addIngredient} 
                    className="text-blue-600 hover:underline"
                    >
                    + Add Ingredient
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col">
                  <label className="font-medium mb-1">Filters:</label>
                  <FilterDropdown formData={formData} handleFiltersChange={handleFiltersChange} />
                </div>

                {/* Instructions */}
                <div className="flex flex-col">
                    <label className="font-medium">Instructions:</label>
                    <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    required
                    className="border rounded p-2 min-h-[80px]"
                    />
                </div>

                {/* Time and People in one row */}
                <div className="flex gap-4">
                    <div className="flex flex-col flex-1">
                    <label className="font-medium">Time (minutes):</label>
                    <input
                        type="number"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="border rounded p-2"
                    />
                    </div>

                    <div className="flex flex-col flex-1">
                    <label className="font-medium">Servings:</label>
                    <input
                        type="number"
                        name="numberOfPeople"
                        value={formData.numberOfPeople}
                        onChange={handleChange}
                        required
                        className="border rounded p-2"
                    />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-3 pt-4">
                    <button type="submit" className="cosmic-button">Save Recipe</button>
                    <button type="button" onClick={onCancel} className="cosmic-button secondary">
                    Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>

  );
}
