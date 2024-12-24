import React from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import { assets } from "/src/assets/assets_frontend/assets"; 

const RegisterSkillsCard = () => {
  // Initialize AOS animations
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div
      className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      <div className="flex flex-row items-center p-6 space-x-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
          <img src={assets.bulb} alt="Register Skills Icon" className="w-10 h-10" />
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Register Skills</h3>
          <p className="text-gray-600">
            Add your skills to track your progress and showcase your expertise to others.
          </p>
          <a
            href="/register-skills"
            className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Start Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterSkillsCard;
