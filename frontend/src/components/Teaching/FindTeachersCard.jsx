import React from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import { assets } from "/src/assets/assets_frontend/assets"; 

const FindTeachersCard = () => {
  // Initialize AOS animations
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div
      className="flex justify-between items-end w-full max-w-4xl bg-white p-6  text-left transition-shadow duration-300 mb-8"
      data-aos="fade-up"
      data-aos-delay="300"
    >
      <div className="flex flex-col space-y-4 w-3/4">
        <h3 className="text-2xl font-semibold text-gray-800">Find Teachers</h3>
        <p className="text-gray-600">
          Discover qualified teachers to guide you in skill development and improvement.
        </p>
      </div>
      <div className="w-1/4 flex justify-end">
        <a
          href="/find-teachers"
          className="bg-gray-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-700 transition"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Explore
        </a>
      </div>
    </div>
  );
};

export default FindTeachersCard;
