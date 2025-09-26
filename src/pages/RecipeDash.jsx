// RecipeDash.jsx — styled to match Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useMemo, useState } from "react";

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
    const [ recipes, setRecipes] = useState([])
    const navigate = useNavigate();

    const [activeTag, setActiveTag] = useState("all");
    const [selected, setSelected] = useState([]);

    const filtered = useMemo(() => {
    if (activeTag === "all") return recipes;
    return recipes.filter((r) =>
      (r.filters || []).some(
        (t) => t.toLowerCase() === activeTag.toLowerCase()
      )
    );
  }, [recipes, activeTag]);

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!isAuthenticated) {
    // If you want this page open to everyone, remove this redirect.
    // Otherwise, mirror Dashboard's auth gate:
    return navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#e6f0f8]">
      {/* --- Navbar (matches Dashboard) --- */}
      <div className="flex justify-between items-center p-4 page-title">
        <a href="/">
          <h1 className="text-primary text-xl font-bold hover:text-blue-500">
            BIG SPOON YUM
          </h1>
        </a>
        <button
          className="cosmic-button"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
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

          {filtered.length === 0 ? (
            <EmptyState text="No recipes match that filter." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((r) => (
                <article
                  key={r._id}
                  onClick={() => toggleSelect(r._id)}
                  className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow transition cursor-pointer ${
                    selected.includes(r._id) ? "ring-2 ring-blue-500" : ""
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
                </article>
              ))}
            </div>
          )}
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

export default RecipeDash;
