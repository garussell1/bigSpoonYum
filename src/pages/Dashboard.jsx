// Dashboard.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

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
  const navigate = useNavigate();

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const favorites = MOCK_FAVORITES;

  const filteredRecipes = useMemo(() => {
    if (activeTag === "all") return favorites.recipes;
    return favorites.recipes.filter((r) =>
      (r.tags || []).some((t) => t.toLowerCase() === activeTag.toLowerCase())
    );
  }, [activeTag, favorites.recipes]);


  const [selectedRecipes, setSelectedRecipes] = useState([]);

const toggleSelectRecipe = (id) => {
  setSelectedRecipes((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );
};


  

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

        {/* Recipe Database / Filters */}
        <div className="text-center mt-32">
          <h2 className="font-bold text-3xl mb-6">Welcome, {user?.name || user?.email || "friend"}!</h2>
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
          <h2 className="text-2xl font-semibold text-center">Your Favorite Recipes</h2>
          {filteredRecipes.length === 0 ? (
            <EmptyState text="No favorite recipes match that filter." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRecipes.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  selected={selectedRecipes.includes(r.id)}
                  onToggle={() => toggleSelectRecipe(r.id)}
                />
              ))}
            </div>

          )}
        </section>

        {/* Favorite Lists */}
        <section className="space-y-4">
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
        </section>
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
