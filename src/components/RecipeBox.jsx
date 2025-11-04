
export const RecipeBox = () => {
    return(
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
                </article>
    )
}