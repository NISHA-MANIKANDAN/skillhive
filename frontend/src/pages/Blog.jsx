import React from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import Categories from "../components/Categories";  // Import the Categories component

// Helper function to generate a slug from the title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with a dash
    .replace(/(^-|-$)/g, ''); // Remove leading or trailing dashes
};

const Blog = () => {
  const blogs = useSelector((state) => state.blog.blogs); // Get blogs from Redux store
  const categories = useSelector((state) => state.blog.categories); // Get categories from Redux store
  const location = useLocation();

  // Extract category_id from the URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("category_id");

  // Find the category name
  const categoryName = categories.find((cat) => cat.id === parseInt(categoryId))?.name || "All";

  // Get blogs for the selected category
  const categoryBlogs = blogs[categoryId] || [];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Sidebar with Categories Component */}
      <div className="w-full md:w-1/4">
        <Categories /> {/* Rendering Categories component */}
      </div>

      {/* Blog Section */}
      <div className="w-full md:w-2/4">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">{categoryName} Blogs</h1>
          {categoryBlogs.length > 0 ? (
            <ul>
              {categoryBlogs.map((blog, index) => (
                <li key={index} className="mb-6">
                  <h2 className="text-xl font-semibold text-black">
                    <Link
                      to={`/blog/${generateSlug(blog.title)}`} // Generate URL with slug
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mt-2">{blog.excerpt}</p>
                  <hr className="mt-4" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No blogs available for this category.</p>
          )}
        </div>
      </div>

      {/* Contribute Card */}
      <div className="w-full md:w-1/4">
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Contribute Illustration"
            className="w-2/3 mb-4"
          />
          <p className="text-gray-700 text-center mb-4">
            Want to contribute an article?
          </p>
          <a
            href="/contact-us"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Contact Us
          </a>
          <div className="mt-6 text-center">
            <span className="text-gray-700 text-2xl font-bold">17</span>
            <p className="text-gray-600">Articles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
