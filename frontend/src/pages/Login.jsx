import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { loginUser } from '../store/slice/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLoginHandler = (event) => {
    event.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        toast.success('Login successful!');
        // Redirect or handle success
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <form onSubmit={onLoginHandler} className="login-form flex flex-col items-center gap-6 p-8 rounded-md shadow-lg w-full max-w-sm mx-auto">
      <h2 className="text-3xl font-bold">Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-3 border rounded focus:outline-primary"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 border rounded focus:outline-primary"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full p-3 rounded bg-primary text-white font-bold ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'}`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col items-center gap-4 w-full">
        <p className="text-sm text-gray-600">Or login with</p>
        <button className="w-full p-3 border rounded flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100">
          <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
          <span>Login with Google</span>
        </button>
      </div>
    </form>
  );
};

export default Login;
