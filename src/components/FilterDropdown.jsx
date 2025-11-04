import { useState, useRef, useEffect } from "react";

const filterOptions = [
    "Vegetarian", 
    "Vegan", 
    "GF", 
    "Peanut-Free", 
    "Treenut-Free", 
    "Soy-Free", 
    "Lactose-Free", 
    "Diabetes", 
    "Kosher"
];

function FilterDropdown({ formData, handleFiltersChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = (filter) => {
    const newFilters = formData.filters.includes(filter)
      ? formData.filters.filter((f) => f !== filter)
      : [...formData.filters, filter];
    handleFiltersChange(newFilters);
  };

  return (
    <div className="flex flex-col relative w-64" ref={dropdownRef}>

      {/* Combobox-style button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="border rounded p-2 flex justify-between items-center bg-white"
      >
        <span className="truncate">
          {formData.filters.length > 0
            ? formData.filters.join(", ")
            : "Select filters..."}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-1 w-full border rounded bg-white shadow p-2 z-10">
          {filterOptions.map((filter) => (
            <label key={filter} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={formData.filters.includes(filter)}
                onChange={() => toggleFilter(filter)}
              />
              <span className="capitalize">{filter.replace("-", " ")}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
