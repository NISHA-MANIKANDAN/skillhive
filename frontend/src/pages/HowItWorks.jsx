import React from "react";
import { useSelector } from "react-redux"; 
import Categories from "../components/Categories";

const HowItWorks = () => {
  const user = useSelector((state) => state.auth.user); 

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col lg:flex-row relative pt-8">
      {/* Categories Component positioned at the top-left outside the main content */}
      <div className="lg:absolute lg:top-8 lg:left-0 lg:w-64 lg:p-6 sm:w-full sm:p-4">
        <Categories />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:px-4 lg:ml-64 flex flex-col justify-start items-center lg:pt-0 lg:px-6 text-center pb-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4 sm:text-3xl lg:mb-6">
            Meet Clascity - A Skill Sharing Platform
          </h1>
          <p className="text-lg mb-4 sm:text-base lg:mb-8">
            We all have something to learn from one another
          </p>
          <div className="flex justify-center mb-8 w-full">
            <iframe
              className="w-full max-w-2xl h-64 sm:h-48 lg:h-64"
              src="https://www.youtube.com/embed/example" 
              title="Introducing Clascity"
              allowFullScreen
            ></iframe>
          </div>
          <section className="mb-8 lg:mb-12">
            <h2 className="text-3xl font-semibold mb-4 sm:text-2xl">What is Clascity</h2>
            <p className="text-lg leading-7 sm:text-base">
              Clascity is created for everyone to share their talents and for
              those who want to learn to find the best teachers in their
              community. Want to play the guitar but don't know how? Or see a
              beautiful handmade jewelry piece and wonder how it's created? No
              matter how big or small, there's always someone teaching something
              you don't yet know about.
            </p>
          </section>

          {/* Teaching on Clascity Section */}
          <section className="mb-8 lg:mb-12">
            <h2 className="text-3xl font-semibold mb-4 sm:text-2xl">Teaching on Clascity</h2>
            <p className="text-lg leading-7 sm:text-base">
              Who doesn’t like things that are good and cheap? Clascity is just
              that. As fellow tutors, we understand that fees are annoying, and
              that’s why we’re trying to offer as much as possible for as little
              as possible. We’ve built features such as booking, scheduling,
              payment, performance tracking, and review that will help you succeed
              as a tutor. All that for an 8% commission fee (free for students).
              You may read more about our price comparison with other platforms
              here.
            </p>
            {/* Button After Teaching on Clascity Section */}
            <div className="mt-6">
              <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
                Start Teaching Today
              </button>
            </div>
          </section>

          {/* Other sections remain unchanged */}
          <section className="mb-8 lg:mb-12">
            <h2 className="text-3xl font-semibold mb-4 sm:text-2xl">
              That sounds good, but how does it work?
            </h2>
            <p className="text-lg leading-7 sm:text-base">
              Getting started is easy, we encourage everyone to teach what they
              know and at the same time to learn what they don’t. All you’ll need
              is one account. Want to learn landscape painting? Search for classes
              near the park! Looking for some activities to do this weekend? You
              may find someone teaching how to build a sand castle on the beach.
              Better yet, if you know a secret recipe of a homemade dish, create
              a class and share it! There is always something happening in your
              city that can help improve yourself both personally and professionally.
            </p>
          </section>

          {/* Additional sections follow the same pattern */}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
