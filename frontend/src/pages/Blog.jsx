import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; 
import Categories from "../components/Categories";

const Blog = () => {
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category_id");

  
  const categoryContent = {
    1: [
      {
        title: "How to learn almost anything with AI",
        description: "Ever felt overwhelmed by the sheer amount of information out there when trying to learn something?",
      },
      {
        title: "Discover the exciting world of online learning",
        description: "Stream your class on social media platforms. With Clascity’s public class feature, you can ...",
      },
      {
        title: "Online lessons are now available on Clascity!",
        description: "Since staying at home became the new normal, we have been receiving an increasing number of requests ...",
      },
    ],
    2: [
      {
        title: "Mastering the Guitar: A Step-by-Step Guide",
        description: "Learn the basics of playing guitar and some tips to improve your skills.",
      },
      {
        title: "Piano for Beginners",
        description: "Get started with playing the piano and become proficient in reading musical notes.",
      },
      {
        title: "The Art of Singing: Tips to Improve Your Voice",
        description: "Learn how to control your voice and practice techniques to improve your singing.",
      },
    ],
    3: [
      {
        title: "Soccer Basics: Getting Started",
        description: "Learn the fundamental skills of soccer, from dribbling to shooting.",
      },
      {
        title: "Basketball 101: Rules & Techniques",
        description: "A beginner's guide to basketball rules, techniques, and drills.",
      },
      {
        title: "Fitness for Athletes: Training Tips",
        description: "How to stay fit and enhance your athletic performance with focused training.",
      },
    ],
    4: [
      {
        title: "Basic Conversational Spanish",
        description: "Learn essential phrases and vocabulary for effective communication in Spanish.",
      },
      {
        title: "French Language Essentials",
        description: "Start learning the basics of the French language with essential words and expressions.",
      },
      {
        title: "Understanding German Grammar",
        description: "A beginner's guide to German grammar, focusing on key concepts and sentence structure.",
      },
    ],
    5: [
      {
        title: "Top 3 Skills Employers are looking for 2021",
        description: "As the world of work has shifted into more virtual and online-centric enterprise, businesses are now more focused on tech skills.",
      },
      {
        title: "Why Personal Development is Critical to Success",
        description: "Personal Development is the action you take to improve and better yourself. It’s an ongoing challenge that requires continuous growth.",
      },
      {
        title: "The 15 Most Wanted Skills to Get a Job",
        description: "Education is constantly changing. In this day and age, filled with easily accessible technology, the demand for new skill sets is rising.",
      },
    ],
    6: [
      {
        title: "Digital Marketing: A Beginner's Guide",
        description: "Learn the basics of digital marketing, from SEO to social media strategies.",
      },
      {
        title: "Introduction to Web Development",
        description: "Start learning web development by understanding the fundamentals of HTML, CSS, and JavaScript.",
      },
      {
        title: "Becoming a Digital Content Creator",
        description: "Tips and strategies to create content online and build your digital presence.",
      },
    ],
  };

  
  const [categoryPosts, setCategoryPosts] = useState([]);

  
  useEffect(() => {
    if (categoryId) {
      
      setCategoryPosts(categoryContent[categoryId] || []);
    }
  }, [categoryId]);

  
  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar */}
      <div className="w-full lg:w-64 p-6 lg:h-screen lg:sticky top-0 bg-white shadow-sm">
        <Categories />
      </div>

      {/* Blog Content */}
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Blog Posts for the selected Category */}
          <div className="space-y-6">
            {categoryPosts.length > 0 ? (
              categoryPosts.map((post, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <Link
                    to={`/blog/${generateSlug(post.title)}`}
                    className="text-2xl font-semibold text-black hover:text-blue-500 hover:underline transition-all duration-300 ease-in-out"
                  >
                    {post.title}
                  </Link>
                  <p className="text-lg text-gray-700">{post.description}</p>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-700">No posts available for this category.</p>
            )}
          </div>

          {/* Contribute Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              src="/path-to-image" 
              alt="Contribute Illustration"
              className="mb-4 w-full max-w-xs mx-auto"
            />
            <p className="text-lg text-gray-700 text-center mb-4">
              Want to contribute an article?
            </p>
            <a
              href="/contact"
              className="text-blue-500 hover:underline text-lg font-medium block text-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
