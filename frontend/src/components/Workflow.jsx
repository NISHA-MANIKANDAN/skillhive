import { Link } from 'react-router-dom';
import { assets } from '/src/assets/assets_frontend/assets'; 

const Workflow = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-end md:pr-32 pt-56 bg-white">
      {/* Left Content */}
      <div className="md:w-1/2 text-center md:text-right pr-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Unlock Your Full Potential Through Skill Sharing
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Discover the power of shared knowledge and expertise. SkillHive connects you with the right people and resources to help you learn, grow, and achieve your goals. Whether you&apos;re mastering a new skill or refining your craft, our platform ensures you have the support to succeed. Your journey to greatness starts here.
        </p>
        <Link to="/how-it-works" className="inline-block mt-6 text-blue-600 hover:text-blue-800 font-medium text-lg">
          Learn How It Works
        </Link>
      </div>
      {/* Right Image */}
      <div className="md:w-1/2 mt-8 md:mt-0 flex justify-end">
        {/* Add your image if needed */}
        <img
          src={assets.learntogether}
          alt="Skill Sharing"
          className="w-full h-auto "
        />
      </div>
    </div>
  );
};

export default Workflow;