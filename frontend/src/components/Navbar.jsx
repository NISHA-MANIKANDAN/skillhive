import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { setToken } from '/src/store/slice/authSlice'; // Action to update token in Redux store
import { assets } from '/src/assets/assets_frontend/assets';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const token = useSelector((state) => state.auth.token); // Access token from Redux store
  const dispatch = useDispatch(); // Access the dispatch function

  const handleLogout = () => {
    dispatch(setToken(null)); // Dispatch action to clear token
    navigate('/login');
  };

  return (
  // Change this line at the top level of the return statement:
<div className='fixed top-0 left-0 right-0 bg-white z-40 flex items-center justify-between text-sm py-4 mb-5'>
  {/* Align SkillHive to the left */}
 
  <h1 className="text-4xl ml-28 font-semibold text-brown tracking-wider drop-shadow-md flex-grow-0">
    SkillHive
  </h1>

  {/* Desktop Navigation Links */}
  <ul className='hidden md:flex mr-16 items-center gap-8 font-medium ml-auto'>
    {/* 'How It Works' link */}
    <NavLink
      to="/how-it-works"
      className={({ isActive }) =>
        isActive ? 'active py-1 text-green-500' : 'py-1'
      }
    >
      <li>HOW IT WORKS</li>
    </NavLink>

    {/* Conditional links for user state */}
    {token ? (
      <div className='relative flex items-center gap-2 cursor-pointer group'>
        <img
          className='w-8 rounded-full'
          src={assets.profile_pic}
          alt="Profile"
        />
        <img
          className='w-2.5'
          src={assets.dropdown_icon}
          alt="Dropdown Icon"
        />
        {/* Dropdown Menu */}
        <div className='absolute top-14 right-0 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
          <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
            <p onClick={() => navigate('/my-profile')}>My Profile</p>
            <p onClick={handleLogout}>Logout</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/sign-up')}
          className='bg-primary text-white px-6 py-2 rounded-full font-light'
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate('/sign-in')}
          className='bg-primary text-white px-6 py-2 rounded-full font-light'
        >
          Sign In
        </button>
      </div>
    )}
  </ul>

  {/* Mobile Menu Icon */}
  <div
    onClick={() => setShowMenu(true)}
    className='w-6 h-6 flex flex-col justify-between items-center cursor-pointer md:hidden'
  >
    <div className='w-3/4 h-0.5 bg-primary'></div>
    <div className='w-3/4 h-0.5 bg-primary'></div>
    <div className='w-3/4 h-0.5 bg-primary'></div>
  </div>

  {/* Mobile Menu */}
  {showMenu && (
    <div className='fixed w-full h-full bg-white z-50 right-0 top-0 bottom-0'>
      {/* Close Button */}
      <div className='flex items-center justify-between px-5 py-6'>
        <h1 className="text-4xl font-bold text-brown">SkillHive</h1>
        <div
          className='w-6 h-6 flex flex-col justify-between items-center cursor-pointer md:hidden'
          onClick={() => setShowMenu(false)}
        >
          <div className='w-full h-0.5 bg-black transform rotate-45 translate-y-1'></div>
          <div className='w-full h-0.5 bg-black transform -rotate-45 -translate-y-1'></div>
        </div>
      </div>

      {/* Menu Links */}
      <ul className='flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium'>
        <NavLink onClick={() => setShowMenu(false)} to="/how-it-works">
          <p className='px-4 py-2 rounded inline-block'>HOW IT WORKS</p>
        </NavLink>
        {token && (
          <NavLink onClick={() => setShowMenu(false)} to="/dashboard">
            <p className='px-4 py-2 rounded inline-block'>DASHBOARD</p>
          </NavLink>
        )}
        {!token && (
          <div className="flex flex-col gap-4 mt-6">
            <NavLink to="/sign-up">
              <button className="bg-primary text-white px-8 py-3 rounded-full font-light">Sign Up</button>
            </NavLink>
            <NavLink to="/sign-in">
              <button className="bg-primary text-white px-8 py-3 rounded-full font-light">Sign In</button>
            </NavLink>
          </div>
        )}
      </ul>
    </div>
  )}
</div>

  );
};

export default Navbar;
