// RecipeDash.jsx — styled to match Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useMemo, useState } from "react";
import Popup from "../components/Popup";
import RecipeForm from "../components/RecipeForm";
import { Heart } from "lucide-react";

// Keep the same tag set used on Dashboard
const TAGS = [
  "all",
  "Vegetarian",
  "Vegan",
  "GF",
  "Peanut-Free",
  "Treenut-Free",
  "Soy-Free",
  "Lactose-Free",
  "Diabetes",
  "Kosher",
];

// Mock recipe data (you can swap this later)


export const RecipeDash = () => {
    useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("http://localhost:5000/items");
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };
    fetchRecipes();
    }, []);
    
  
    

    const { isAuthenticated, user, isLoading } = useAuth0();
    const [ recipes, setRecipes] = useState([]);
    const navigate = useNavigate();
    const [ isPopupOpen, setIsPopupOpen] = useState(false);
    const [ isRecipePopupOpen, setIsRecipePopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const handleCheckout = () => {
        localStorage.setItem("selectedRecipes", JSON.stringify(selected));
        navigate("/checkout");
    }

    const [activeTag, setActiveTag] = useState("all");
    const [selected, setSelected] = useState([]);

    const [recipeToEdit, setRecipeToEdit] = useState(null);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    
    const [favorites, setFavorites] = useState([]);

  // preload favorites
  useEffect(() => {
    const loadFavorites = async () => {
      const res = await fetch(`http://localhost:5000/favorites`);
      const data = await res.json();
      setFavorites(data.map((f) => f.recipe_id));
    };
    if (user) loadFavorites();
  }, [user]);

    //add to favorites list
    const toggleFavorites = (recipeId) => {
      setFavorites((prev) =>
        prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
      );
    };


    //filter recipes by tag
    const filtered = useMemo(() => {
    if (activeTag === "all") return recipes;
    return recipes.filter((r) =>
      (r.filters || []).some(
        (t) => t.toLowerCase() === activeTag.toLowerCase()
      )
    );
  }, [recipes, activeTag]);

  //toggle the select function for recipes
  const toggleSelect = (recipe) => {
    setSelected((prev) =>
        prev.find((r) => r._id === recipe._id)
        ? prev.filter((r) => r._id !== recipe._id) // remove if already selected
        : [...prev, recipe] // otherwise add recipe object
    );
  };

    //add recipe to database
    const handleAddRecipe = async (recipe) => {
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });

      if (!res.ok) throw new Error("Failed to add recipe");
      const newRecipe = await res.json();
      console.log("Recipe saved:", newRecipe);

      setIsRecipePopupOpen(false); // close popup
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditRecipe = (recipe) => {
    setRecipeToEdit(recipe); // Set the recipe you want to edit
    setIsRecipePopupOpen(true); // Open the popup with the form
  };

  const handleDeleteRecipe = async () => {
    if (!recipeToDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/items/${recipeToDelete._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete recipe');
      setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id)); // Remove from UI
      setRecipeToDelete(null); // Clear the state
      setIsPopupOpen(false); // Close popup
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  };

 const handleFavoriteClick = async (recipeId) => {
    const isFav = favorites.includes(recipeId);
    toggleFavorites(recipeId); // update UI immediately for responsiveness

    try {
      const res = await fetch(`http://localhost:5000/favorites`, {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.sub,   // Auth0 user ID
          recipe_id: recipeId, // match your schema
        }),
      });

      if (!res.ok) throw new Error("Failed to update favorites");
    } catch (err) {
      console.error("Error updating favorites:", err);
      // Revert UI if backend request fails
      toggleFavorites(recipeId);
    }
};



  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#e6f0f8]">
      {/* --- Navbar (matches Dashboard) --- */}
      <div className="flex justify-between items-center p-4 page-title">
        <a href="/dashboard">
          <img src="/logo.png" className="w-30 h-20 logo-hover-blue"/>
          {/* <h1 className="text-primary text-xl font-bold hover:text-blue-500">
            BIG SPOON YUM
          </h1> */}
        </a>
        {/* <button
          className="cosmic-button"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button> */}
      </div>

      {/* --- Main Content (matches container spacing) --- */}
      <div className="p-6 max-w-6xl mx-auto space-y-10">
        {/* Section header + filters (aligned with Dashboard) */}
        <div className="text-center mt-32">
          <h2 className="font-bold text-3xl mb-6">
            Recipe Database
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {TAGS.map((t) => {
              const active = activeTag === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`px-5 py-2 rounded-full transition-colors duration-300 capitalize
                    ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/70 text-foreground hover:bg-secondary"
                    }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid of recipe cards (same card style as Dashboard RecipeCard) */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-center">All Recipes</h3>

            <button onClick={() => setIsRecipePopupOpen(true)}className="cosmic-button"> Add Recipe</button>

            <Popup isOpen={isRecipePopupOpen} onClose={() => setIsRecipePopupOpen(false)}>
              <RecipeForm
                onSubmit={(updatedRecipe) => {
                  if (recipeToEdit) {
                    console.log('Recipe: ', recipeToEdit)
                    // Update the edited recipe in the list
                    setRecipes((prev) =>
                      prev.map((r) =>
                        r._id === updatedRecipe._id ? updatedRecipe : r
                      )
                    );
                  } else {
                    // Add new recipe
                    setRecipes((prev) => [...prev, updatedRecipe]);
                  }

                  setRecipeToEdit(null);
                  setIsRecipePopupOpen(false);
                }}
                onCancel={() => {
                  setRecipeToEdit(null);
                  setIsRecipePopupOpen(false);
                }}
                initialData={recipeToEdit}
              />
            </Popup>

          {filtered.length === 0 ? (
            <EmptyState text="No recipes match that filter." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((r) => (
                <article
                  key={r._id}
                  onClick={() => toggleSelect(r)}
                  className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow transition cursor-pointer ${
                    selected.find((x) => x._id === r._id) ? "ring-2 ring-blue-500" : ""
                  }`}
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
                      ? `${r.numberOfPeople} servings`
                      : ""}
                  </p>

                  {/* instructions (short preview) */}
                  {r.instructions && (
                    <p className="text-sm text-gray-700 mt-3 line-clamp-3">
                      {r.instructions}
                    </p>
                  )}

                  {/* Edit and Delete Buttons */}
                  <div className="mt-4 flex justify-between">
                    <button onClick={() => handleEditRecipe(r)} className="text-blue-500 hover:underline">Edit</button>
                    <div className="mt-3 flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent toggling recipe selection
                        handleFavoriteClick(r._id);
                      }}
                    >
                      <Heart
                        className={`w-6 h-6 transition-colors ${
                          favorites.includes(r._id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-400"
                        }`}
                      />
                    </button>
                </div>
                    <button onClick={() => setRecipeToDelete(r)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div>
            <button onClick={() => setIsPopupOpen(true)}className="cosmic-button"> Checkout</button>

            <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                <h2> Are these the correct recipes? </h2>
                <div>
                    {selected
                        .map((r) => (
                        <h2 key={r._id}>{r.name}</h2>
                        ))}
                </div>

               <button onClick={() => handleCheckout()} className="cosmic-button"> Proceed to Checkout </button>
            </Popup>

          </div>
        </section>
      </div>
    </div>
  );
};

/* shared empty state (matches Dashboard tone) */
const EmptyState = ({ text }) => (
  <div className="rounded-2xl border bg-white p-6 text-center text-gray-600">
    {text}
  </div>
);

