import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated } from "../../store/slice/authSlice";

const RegisterSkillsCard = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleStartNow = () => {
    if (isAuthenticated) {
      navigate("/register-skills"); // Redirect to the register-skills page
    } else {
      navigate("/sign-in", { state: { from: "/register-skills" } }); // Pass target route to sign-in
    }
  };

  return (
    <div data-aos="fade-up" className="w-full max-w-4xl mx-auto mb-16">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="sm:order-2 mb-4 sm:mb-0">
          <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-right">
            Register Skills
          </h3>
          <p className="text-gray-600 hidden sm:block text-right">
            Add your skills to track your progress and showcase your expertise.
          </p>
        </div>
        <div className="sm:order-1">
          <button
            onClick={handleStartNow}
            className="inline-block bg-gray-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSkillsCard;
