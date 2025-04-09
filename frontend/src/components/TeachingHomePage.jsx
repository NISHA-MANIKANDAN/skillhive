import React from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import { assets } from '/src/assets/assets_frontend/assets'; 
const TeachingHomePage = () => {
  // Initialize AOS animations
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="flex flex-col items-center justify-center h-[700px] bg-gradient-to-r text-brown text-center px-4">
      {/* Animated Icon */}
      <div className="mb-6" data-aos="zoom-in">
        <img
          src={assets.bulb}
          alt="Knowledge Icon"
          className="w-24 h-24 animate-bounce"
        />
      </div>

      {/* Animated Tagline */}
      <h1
        className="text-4xl font-bold mb-4"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Empower Knowledge Sharing
      </h1>

      {/* Animated Subtext */}
      <p
        className="text-lg mb-8"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        Register and teach your expertise to inspire others.
      </p>

      {/* Animated CTA Button */}
      <a
        href="/teaching-page"
        className="bg-yellow-400 text-black font-medium py-3 px-6 rounded-lg hover:bg-yellow-500 transition-all duration-300"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        Register Your Teaching Skills
      </a>
    </section>
  );
};



    
export default TeachingHomePage;