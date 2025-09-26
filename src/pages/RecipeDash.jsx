// RecipeDash.jsx — styled to match Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useMemo, useState } from "react";

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
const RECIPES = [
  {
    id: 0,
    name: "Mac and Cheese",
    filters: ["GF"],
    instructions:
      "Boil macaroni, then stir in cheese and butter. Serve hot.",
    time: 15,
    numberOfPeople: 4,
  },
  {
    id: 1,
    name: "Bacon Pepperoni",
    filters: ["GF"],
    instructions:
      "Sauté pepperoni in butter; top with crisped bacon. Serve.",
    time: 10,
    numberOfPeople: 2,
  },
  {
    id: 2,
    name: "Coconut Lentil Curry",
    filters: ["Vegan", "GF", "Soy-Free"],
    instructions:
      "Simmer red lentils in coconut milk with curry spices.",
    time: 25,
    numberOfPeople: 4,
  },
  {
    id: 3,
    name: "Bagels & Lox",
    filters: ["Kosher"],
    instructions:
      "Toast bagels, add cream cheese and smoked salmon.",
    time: 8,
    numberOfPeople: 2,
  },
];

export const RecipeDash = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  const [activeTag, setActiveTag] = useState("all");
  const [selected, setSelected] = useState([]);

  const filtered = useMemo(() => {
    if (activeTag === "all") return RECIPES;
    return RECIPES.filter((r) =>
      (r.filters || []).some(
        (t) => t.toLowerCase() === activeTag.toLowerCase()
      )
    );
  }, [activeTag]);

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
                  key={r.id}
                  onClick={() => toggleSelect(r.id)}
                  className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow transition cursor-pointer ${
                    selected.includes(r.id) ? "ring-2 ring-blue-500" : ""
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
