import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignUp = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSignUpHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/user/signup', { name, email, password });

      if (response.data.token) {
        dispatch(setToken(response.data.token)); // Optionally store token in Redux after signup
        toast.success('Account created successfully! Please log in.');
        // Redirect to login page
      } else {
        toast.error(response.data.message || 'Sign up failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const onOAuthSignUpHandler = () => {
    window.location.href = '/api/user/google'; // Redirect to backend for Google OAuth
  };

  return (
    <div className="flex my-32 justify-center h-screen">
      <form
        onSubmit={onSignUpHandler}
        className="flex flex-col items-center gap-11 p-8 rounded shadow-md w-full max-w-md bg-white h-auto"
      >
        <h2 className="text-2xl font-semibold">Sign Up</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded w-full">
          Sign Up
        </button>
        <button
          type="button"
          onClick={onOAuthSignUpHandler}
          className="border border-primary text-primary px-4 py-2 rounded w-full mt-4"
        >
          Sign Up with Google
        </button>
      </form>
    </div>
  );
};

export default SignUp;
