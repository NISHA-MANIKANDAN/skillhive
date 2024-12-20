import React from "react";

const Categories = () => {
  const categories = ["Tutoring", "Music", "Sports", "Languages", "Arts", "Digital"];

  return (
    <aside className="bg-white shadow-md p-4 rounded-lg max-w-xs mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category}
            className="text-lg text-gray-700 hover:text-blue-500 transition"
          >
            {category}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Categories;
