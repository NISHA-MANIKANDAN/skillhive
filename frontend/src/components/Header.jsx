import { assets } from '/src/assets/assets_frontend/assets'; // Assuming the image is in your assets folder.

const Header = () => {
  return (
    <div className="relativ text-brown flex items-center justify-between py-16 px-36">
      {/* Left Content */}
      <div className="text-center md:text-left md:w-1/2">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Connect, Learn, Grow.</h1>
        <p className="text-base md:text-lg font-light">
          Find the right skills, learn from the right people.
        </p>
      </div>

      {/* Right Image */}
      <div className="hidden md:block md:w-1/2">
        <img 
          src={assets.learntogether} // Replace 'header_img' with the correct image name.
          alt="Skill Representation"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Header;
