import { useEffect, useMemo, useState } from "react";

const TAGS = [
  "All","Vegetarian","Vegan","GF","Peanut-Free","Treenut-Free",
  "Soy-Free","Lactose-Free","Diabetes","Kosher",
];

function toIdString(x) {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (x.$oid) return x.$oid;
  return String(x);
}

function normalizeDoc(r) {
  // normalize ID, title/name, and filters
  const filters = Array.isArray(r.filters)
    ? r.filters.map(String)
    : typeof r.filters === "string"
      ? r.filters.split(",").map(s => s.trim())
      : [];

  return {
    ...r,
    _id: toIdString(r._id),
    title: r.title || r.name || "Untitled",
    filters, // keep as raw strings for matching; we’ll title-case when displaying
  };
}

function titleCase(s) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

export default function RecipeDash() {
  const [activeTag, setActiveTag] = useState("All");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);



  // 1) Load from your Vercel API (recipe = singular collection)
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/recipes?col=recipe");
      const raw = await res.json();
      const normalized = (Array.isArray(raw) ? raw : []).map(normalizeDoc);
      setRecipes(normalized);
    })();
  }, []);

  // 2) Filter case-insensitively
  const filtered = useMemo(() => {
    if (activeTag === "All") return recipes;
    const tag = activeTag.toLowerCase();
    return recipes.filter(r =>
      (r.filters || []).some(t => t.toLowerCase() === tag)
    );
  }, [recipes, activeTag]);

  return (
    <div className="min-h-screen bg-[#e6f0f8]">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <a href="/"><img src="/logo.png" className="w-28 h-auto" /></a>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Recipe Database</h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`px-5 py-2 rounded-full transition-colors capitalize
                ${activeTag === t ? "bg-purple-500 text-white" : "bg-white text-gray-800 border"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-center mb-4">All Recipes</h2>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-center text-gray-600">
            No recipes match that filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(r => (
              <article key={r._id} className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-lg">{r.title}</h3>

                {/* tag pills */}
                {Array.isArray(r.filters) && r.filters.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.filters.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800"
                      >
                        {titleCase(tag)}
                      </span>
                    ))}
        {/* Grid of recipe cards (same card style as Dashboard RecipeCard) */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-center">All Recipes</h3>

            <button onClick={() => setIsRecipePopupOpen(true)}className="cosmic-button"> Add Recipe</button>

            <Popup isOpen={isRecipePopupOpen} onClose={() => setIsRecipePopupOpen(false)}>
              <RecipeForm
                onSubmit={(updatedRecipe) => {
                  if (recipeToEdit) {
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
            {/* Recipe Popup for checkout and such */}
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
                    <button onClick={(e) => {e.stopPropagation(); setSelectedRecipe(null); handleEditRecipe(r);}} className="text-blue-500 hover:underline">Edit</button>
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
                    <button onClick={() => { setRecipeToDelete(r); setIsDeletePopupOpen(true) } } className="text-red-500 hover:underline">Delete</button>

                    <Popup isOpen={isDeletePopupOpen} onClose={() => setIsDeletePopupOpen(false)} showCloseButton={false}>
                      <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                      {recipeToDelete && (
                        <div>
                          <p>Are you sure you want to delete the recipe:</p>
                          <p className="font-semibold mt-2">{recipeToDelete.name}</p>
                        </div>
                      )}

                      <div className="mt-6 flex justify-between gap-4">
                        <button
                          onClick={() => {
                            handleDeleteRecipe();
                            setIsDeletePopupOpen(false);
                          }}
                          className="cosmic-button bg-red-600 hover:bg-red-700"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setIsDeletePopupOpen(false)}
                          className="cosmic-button bg-gray-400 hover:bg-gray-500 flex justify-between"
                        >
                          Cancel
                        </button>
                      </div>
                    </Popup>
                  </div>
                )}

                {/* simple metadata */}
                <p className="text-sm text-gray-600 mt-3">
                  {typeof r.time === "number" ? `${r.time} min • ` : ""}
                  {typeof r.numberOfPeople === "number" ? `${r.numberOfPeople} servings` : ""}
                </p>

                {/* preview */}
                {r.instructions && (
                  <p className="text-sm text-gray-700 mt-3 line-clamp-3">{r.instructions}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
