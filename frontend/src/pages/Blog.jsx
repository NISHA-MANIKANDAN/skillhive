import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectCategory } from "../store/slice/blog";
import Categories from "../components/Categories";

const Blog = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const selectedCategoryId = useSelector((state) => state.blog.selectedCategoryId);
  const blogPosts = useSelector((state) =>
    selectedCategoryId
      ? state.blog.blogPosts.filter((post) => post.categoryId === selectedCategoryId)
      : state.blog.blogPosts
  );

  // Handle query parameters to set category
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryId = parseInt(queryParams.get("category_id"), 10);

    if (categoryId) {
      dispatch(selectCategory(categoryId));
    }
  }, [location.search, dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar */}
      <div className="w-full lg:w-64 p-6 lg:h-screen lg:sticky top-0 bg-white shadow-sm">
        <Categories />
      </div>

      {/* Blog Content */}
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        <div className="grid grid-cols-1 gap-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h2 className="text-2xl font-semibold text-gray-900">{post.title}</h2>
              <p className="text-lg text-gray-700">{post.description}</p>
            </div>
          ))}
          {blogPosts.length === 0 && (
            <p className="text-lg text-gray-500">No blog posts found for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
