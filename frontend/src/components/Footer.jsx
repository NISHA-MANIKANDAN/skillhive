import React from "react";
import { useSelector } from "react-redux"; // Import Redux hook to access state
import footerImage from "../assets/assets_frontend/footer.jpg";

const Footer = () => {
  // Access Redux state
  const user = useSelector((state) => state.user); // Replace `state.user` with your store slice
  const isAuthenticated = useSelector((state) => state.auth.token !== null); // Check if the user is logged in

  return (
    <footer className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-between mb-6">
          {/* About Section */}
          <div className="w-full sm:w-1/4 mb-4">
            <h4 className="text-lg font-semibold mb-2">About</h4>
            <ul className="space-y-2">
              <li className="text-gray-700 cursor-pointer hover:underline">Search a class</li>
              <li className="text-gray-700 cursor-pointer hover:underline">Pricing</li>
              <li className="text-gray-700 cursor-pointer hover:underline">Blog</li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="w-full sm:w-1/4 mb-4">
            <h4 className="text-lg font-semibold mb-2">Resources</h4>
            <ul>
              <li className="text-gray-700 cursor-pointer hover:underline">
                Best Online Tutoring Platform Comparison
              </li>
            </ul>
          </div>

          {/* Help Center Section */}
          <div className="w-full sm:w-1/4 mb-4">
            <h4 className="text-lg font-semibold mb-2">Help Center</h4>
            <ul className="space-y-2">
              <li className="text-gray-700 cursor-pointer hover:underline">Support</li>
              <li className="text-gray-700 cursor-pointer hover:underline">Report a concern</li>
            </ul>
          </div>

          {/* Call to Action Section */}
          <div className="w-full sm:w-1/4 flex flex-col items-center">
            <img
              src={footerImage}
              alt="Illustration"
              className="w-20 h-20 mb-4"
            />

            <p className="text-center text-gray-800 mb-4">
              {isAuthenticated
                ? `Welcome back, ${user?.name || "User"}!`
                : "Have something to share?"}
            </p>

            {isAuthenticated ? (
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => console.log("Redirect to teach a class")}
              >
                Teach a class
              </button>
            ) : (
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => console.log("Redirect to Sign Up")}
              >
                Sign Up to Teach
              </button>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 pt-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 sm:mb-0 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
            <span className="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></span>
            SkillHive, Inc © 2024
          </p>
          <div className="flex space-x-4">
            <a href="#privacy" className="text-gray-700 text-sm hover:underline">
              Privacy
            </a>
            <a href="#terms" className="text-gray-700 text-sm hover:underline">
              Terms
            </a>
            <a href="#facebook" className="text-gray-700 text-sm font-bold">f</a>
            <a href="#twitter" className="text-gray-700 text-sm font-bold">x</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
