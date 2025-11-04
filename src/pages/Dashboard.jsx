// in Dashboard.jsx
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState("");

  async function refresh() {
    const r = await fetch("/api/recipes");
    setRecipes(await r.json());
  }

  useEffect(() => { refresh(); }, []);

  async function addRecipe(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/recipes", {
      method: "POST",
      body: JSON.stringify({ title })
    });
    setTitle("");
    refresh();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Recipes</h1>
      <form onSubmit={addRecipe} className="flex gap-2 mb-4">
        <input className="border rounded px-3 py-2 flex-1"
               value={title} onChange={e => setTitle(e.target.value)}
               placeholder="Recipe title" />
        <button className="border rounded px-3 py-2">Add</button>
      </form>
      <ul className="space-y-2">
        {recipes.map(r => (
          <li key={r._id} className="border rounded px-3 py-2">
            {r.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
