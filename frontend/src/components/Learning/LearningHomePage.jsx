import React from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import { assets } from "/src/assets/assets_frontend/assets";

const LearningHomePage = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="flex flex-col items-center justify-center h-[700px] bg-gradient-to-l text-center px-4">
      {/* Animated Icon */}
      <div className="mb-6" data-aos="flip-left">
        <img
          src={assets.learning} // replace with your own learning icon
          alt="Learning Icon"
          className="w-24 h-24 "
        />
      </div>

      {/* Animated Tagline */}
      <h1
        className="text-4xl font-extrabold text-cyan-800 mb-4"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Fuel Your Curiosity
      </h1>

      {/* Animated Subtext */}
      <p
        className="text-lg text-gray-600 mb-8"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        Dive into topics that excite you and expand your horizons.
      </p>

      {/* Animated CTA Button */}
      <a
        href="/learning-page"
        className="bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-cyan-800 transition-all duration-300"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        Explore Learning Paths
      </a>
    </section>
  );
};

export default LearningHomePage;
