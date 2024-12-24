import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const FindTeachersCard = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div
      data-aos="fade-up"
      className="w-full max-w-4xl mx-auto mb-16"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between  p-6">
        <div className="sm:order-1 mb-4 sm:mb-0">
          <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">Find Teachers</h3>
          <p className="text-gray-600 hidden sm:block text-left">
            Discover qualified teachers to guide you in skill development.
          </p>
        </div>
        <div className="sm:order-2">
          <a
            href="/find-teachers"
            className="inline-block bg-gray-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300"
          >
            Explore
          </a>
        </div>
      </div>
    </div>
  );
};

export default FindTeachersCard;