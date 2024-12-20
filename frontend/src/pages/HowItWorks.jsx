import React from "react";
import { useSelector } from "react-redux"; // Import Redux hook
import Categories from "../components/Categories";

const HowItWorks = () => {
  const user = useSelector((state) => state.auth.user); // Access user data from Redux store

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">
          Meet Clascity - A Skill Sharing Platform
        </h1>
        <p className="text-center text-lg mb-8">
          We all have something to learn from one another
        </p>

        <div className="flex justify-center mb-12">
          <iframe
            className="w-full max-w-2xl h-64"
            src="https://www.youtube.com/embed/example" // Replace with actual YouTube link
            title="Introducing Clascity"
            allowFullScreen
          ></iframe>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">What is Clascity</h2>
          <p className="text-lg leading-7">
            Clascity is created for everyone to share their talents and for
            those who want to learn to find the best teachers in their
            community. Want to play the guitar but don't know how? Or see a
            beautiful handmade jewelry piece and wonder how it's created? No
            matter how big or small, there's always someone teaching something
            you don't yet know about.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Teaching on Clascity</h2>
          <p className="text-lg leading-7 mb-6">
            Who doesn't like things that are good and cheap? Clascity is just
            that. As fellow tutors, we understand that fees are annoying, and
            that's why we're trying to offer as much as possible for as little
            as possible. We've built features such as booking scheduling,
            payment, performance tracking, and reviews that will help you
            succeed as a tutor. All that for an 8% commission fee (free for
            students). You may read more about our price comparison with other
            platforms here.
          </p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Teach a Class
          </button>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">
            That sounds good, but how does it work?
          </h2>
          <p className="text-lg leading-7 mb-6">
            Getting started is easy; we encourage everyone to teach what they
            know and learn what they don't.
          </p>
          <div className="flex justify-center">
            <img
              src="/path-to-image" // Replace with the actual image path
              alt="How Clascity Works"
              className="rounded-lg shadow-lg w-full max-w-3xl"
            />
          </div>
        </section>
      </div>
      <Categories />
    </div>
  );
};

export default HowItWorks
