import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignUp = () => {
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUpHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/user/register', { name, email, password });

      if (response.data.success) {
        toast.success('Account created successfully! Please log in.');
        // Redirect to Login or dispatch any action if necessary
      } else {
        toast.error(response.data.message || 'Sign up failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex my-32 justify-center h-screen">
      <form
        onSubmit={onSignUpHandler}
        className="flex flex-col items-center gap-11 p-8  rounded shadow-md w-full max-w-md bg-white h-96"
      >
        <h2 className="text-2xl font-semibold">Sign Up</h2>
       
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
      </form>
    </div>
  );
};

export default SignUp;
