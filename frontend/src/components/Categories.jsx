import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCategory } from "../store/slice/blogSlice";

const Categories = () => {
  const categories = useSelector((state) => state.blog.categories);
  const selectedCategoryId = useSelector((state) => state.blog.selectedCategoryId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = (id) => {
    dispatch(selectCategory(id)); // Update selectedCategoryId in the Redux store
    navigate(`/blog?category_id=${id}`); // Navigate to the blog page with the selected category
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={`block text-left w-full px-4 py-2 rounded-md transition ${selectedCategoryId === category.id
                ? "text-blue-500 bg-blue-50"
                : "text-gray-700 hover:text-blue-500 hover:bg-gray-100"
                }`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
