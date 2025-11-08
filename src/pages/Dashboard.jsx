// Dashboard.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { Onboarding } from "./Onboarding";
import Popup from "../components/Popup";
import RecipeForm from "../components/RecipeForm";

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

const MOCK_FAVORITES = {
  recipes: [
    { id: "r1", title: "One-Pot Chili", tags: ["GF"], calories: 520 },
    { id: "r2", title: "Pesto Pasta", tags: ["Vegetarian"], calories: 450 },
    { id: "r3", title: "Trail Tacos", tags: ["Lactose-Free"], calories: 610 },
    { id: "r4", title: "Coconut Lentil Curry", tags: ["Vegan", "GF"], calories: 540 },
    { id: "r5", title: "Chicken & Rice", tags: ["Peanut-Free", "Treenut-Free"], calories: 620 },
    { id: "r6", title: "Bagels & Lox", tags: ["Kosher"], calories: 430 },
  ],
  lists: [
    { id: "l1", name: "3-Day Backpacking Basics", itemsCount: 12 },
    { id: "l2", name: "Gluten-Free Weekender", itemsCount: 7 },
  ],
};

const Dashboard = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [activeTag, setActiveTag] = useState("all");
  const [selected, setSelected] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [userName, setUserName] = useState("");
  const [LWL, setLWL] = useState(0)
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  

  const navigate = useNavigate();

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch(`http://localhost:5000/users`);
      const data = await res.json();
      const matchedUser = data.find(f => user.sub == f.user_id);
      setUserName(matchedUser ? matchedUser.name : "friend");
      setHasCompletedOnboarding(matchedUser ? matchedUser.onboarded : false);
      setUserLoaded(true);
    }
    loadUser();
  }, [user]);

  useEffect(() => {
    if(user && userLoaded) {
      if(!hasCompletedOnboarding){
        setShowOnboarding(true);  
      }else{
        setShowOnboarding(false);
      }
    }
  },[user, userLoaded, hasCompletedOnboarding]);

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

  // preload favorites
  useEffect(() => {
  const loadFavorites = async () => {
    try {
      // Fetch all favorites
      const favRes = await fetch("http://localhost:5000/favorites");
      const favData = await favRes.json(); // [{ user_id, recipe_id }, ...]

      // Filter favorites for the logged-in user
      const userFavorites = favData.filter((f) => f.user_id === user?.sub);

      // Fetch all recipes
      const recipeRes = await fetch("http://localhost:5000/items");
      const allRecipes = await recipeRes.json(); // [{ _id, title, filters, calories, ... }]

      // Match recipes that are in the user's favorites
      const favoriteRecipes = allRecipes.filter((r) =>
        userFavorites.some((f) => f.recipe_id === r._id)
      );

      // Save to state
      setRecipes(favoriteRecipes);
    } catch (err) {
      console.error("Error loading favorites:", err);
    }
  };

  if (user) loadFavorites();
}, [user]);


  //transition the favorite ids to recipes
  // useEffect(() => {
  //   const loadRecipes = async () => {
  //     const res = await fetch('http://localhost:5000/items');
  //     const data = await res.json();
  //     setRecipes(data.map((f)))
  //   }
  // })

  const filtered = useMemo(() => {
    if (activeTag === "all") return recipes;
    return recipes.filter((r) =>
      (r.filters || []).some(
        (t) => t.toLowerCase() === activeTag.toLowerCase()
      )
    );
  }, [recipes, activeTag]);


  

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };


  console.log(user);

  return (
    <div className="min-h-screen bg-[#e6f0f8]">
      {/* --- Navbar --- */}
      <div className="flex justify-between items-center p-4 page-title">
        <a href="/dashboard">
          <img src="/logo.png" className="w-30 h-20 logo-hover-blue"/>
          {/* <h1 className="text-primary text-xl font-bold hover:text-blue-500">
            BIG SPOON YUM
          </h1> */}
        </a>

        <button className="cosmic-button" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log Out
        </button>

        <button
          className="cosmic-button"
          onClick={() => navigate("/recipes")}
        >
          View All Recipes
        </button>
      </div>

      {/* --- Main Content --- */}
      <div className="p-6 max-w-6xl mx-auto space-y-10">

        {showOnboarding && <Onboarding />}
        {console.log(userName)}

        {/* Recipe Database / Filters */}
        <div className="text-center mt-32">
          <h2 className="font-bold text-3xl mb-6">Welcome, {userName}!</h2>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {TAGS.map((filter) => (
              <button
                key={filter}
                className={`px-5 py-2 rounded-full transition-colors duration-300 capitalize
                  ${
                    activeTag === filter
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/70 text-foreground hover:bg-secondary"
                  }`}
                onClick={() => setActiveTag(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite Recipes */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-center">Your Favorite Recipes</h3>
              <Popup
                isOpen={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
              >
                {selectedRecipe && (
                  <div>
                    <h1 className="text-2xl font-bold">{selectedRecipe.name}</h1>
                    <p>{selectedRecipe.instructions}</p>
                    <list>
                            
                    </list>
                    <button className="cosmic-button" onClick={() => toggleSelect(selectedRecipe)}>
                      {selected.includes(selectedRecipe) ? "Remove from Cart" : "Add To Cart"}
                    </button>
                        
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent toggling recipe selection
                        handleFavoriteClick(selectedRecipe._id);
                      }}
                    >
                      <Heart
                        className={`w-6 h-6 transition-colors ${
                        favorites.includes(selectedRecipe._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-400"
                        }`}
                      />
                    </button>
                  </div>  
                    )}
                  </Popup>

                  {filtered.length === 0 ? (
                    <EmptyState text="No recipes match that filter." />
                    ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filtered.map((r) => (
                        <article
                          key={r._id}
                          onClick={() => setSelectedRecipe(r)}
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
                          
        
                          {/* Edit and Delete Buttons */}
                          <div className="mt-4 flex justify-between">
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
                      </div>
                    </article>
                  ))}
                  </div>
                )}
              </section>

        {/* Favorite Lists */}
        {/* <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">Favorite Custom Lists</h2>
          {favorites.lists.length === 0 ? (
            <EmptyState text="No favorite lists yet." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favorites.lists.map((l) => (
                <ListCard key={l.id} list={l} />
              ))}
            </div>
          )}
        </section> */}
      </div>
    </div>
  );
};

/* --- Presentational components --- */

const RecipeCard = ({ recipe, selected, onToggle }) => {
  const { title, tags = [], calories } = recipe;
  return (
    <article
      onClick={onToggle}
      className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow transition cursor-pointer
        ${selected ? "ring-2 ring-blue-500" : ""}`}
      title="Click to select"
    >
      <h3 className="font-semibold text-lg text-center">{title}</h3>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {typeof calories === "number" && (
        <p className="text-sm text-gray-600 mt-3 text-center">{calories} kcal</p>
      )}
    </article>
  );
};


const ListCard = ({ list }) => {
  const { name, itemsCount } = list;
  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow transition">
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-sm text-gray-600 mt-2">
        {itemsCount} {itemsCount === 1 ? "item" : "items"}
      </p>
    </article>
  );
};

const EmptyState = ({ text }) => (
  <div className="rounded-2xl border bg-white p-6 text-center text-gray-600">
    {text}
  </div>
);

export default Dashboard;
