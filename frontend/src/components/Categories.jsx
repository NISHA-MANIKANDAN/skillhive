import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Categories = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const categories = [
    { id: 1, name: "Tutoring" },
    { id: 2, name: "Music" },
    { id: 3, name: "Sports" },
    { id: 4, name: "Languages" },
    { id: 5, name: "Arts" },
    { id: 6, name: "Digital" },
  ];

  return (
    <aside className="bg-white shadow-md p-4 rounded-lg max-w-xs mx-auto">
      {/* Categories Button for smaller screens */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu visibility
          className="text-lg text-gray-700 hover:text-blue-500 transition w-full mb-4"
        >
          Categories
        </button>

        {/* Display the categories as buttons when the menu is open */}
        {isMenuOpen && (
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className="w-full py-2 text-lg text-gray-700 hover:text-blue-500 transition"
              >
                <NavLink
                  to={`/blog?category_id=${category.id}`}
                  activeClassName="text-blue-500"
                  className="w-full hover:text-blue-500 transition"
                >
                  {category.name}
                </NavLink>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List of category buttons for larger screens */}
      <ul className="hidden lg:block space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <button className="w-full py-2 text-lg text-gray-700 hover:text-blue-500 transition">
              <NavLink
                to={`/blog?category_id=${category.id}`}
                activeClassName="text-blue-500"
                className="w-full hover:text-blue-500 transition"
              >
                {category.name}
              </NavLink>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Categories;
