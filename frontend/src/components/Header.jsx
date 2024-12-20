import { assets } from '/src/assets/assets_frontend/assets'; // Assuming the image is in your assets folder.

const Header = () => {
  return (
    <div className="relative text-brown flex flex-col md:flex-row items-center justify-center md:justify-between py-8 px-4 md:py-16 md:px-0 h-auto">
      {/* Left Content */}
      <div className="text-center md:text-left md:w-1/2 flex flex-col items-center md:items-start">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Connect, Learn, Grow.</h1>
        <p className="text-sm md:text-lg font-light">
          Find the right skills, learn from the right people.
        </p>
      </div>

      {/* Right Image (hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 justify-center">
        <img
          src={assets.learntogether} // Replace 'header_img' with the correct image name.
          alt="Skill Representation"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Header;
