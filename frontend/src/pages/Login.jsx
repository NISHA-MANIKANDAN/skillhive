import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setToken } from '../store/slice/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLoginHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/user/login', { email, password });

      if (response.data.success) {
        dispatch(setToken(response.data.token)); // Save token to Redux
        toast.success('Login successful!');
        // Redirect to dashboard or another page here
      } else {
        toast.error(response.data.message || 'Login failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={onLoginHandler} className="flex flex-col items-center gap-4 p-4 rounded-sm shadow-md w-full  max-w-md mx-auto">
      <h2 className="text-2xl font-semibold">Login</h2>
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
        Login
      </button>
    </form>
  );
};

export default Login;
