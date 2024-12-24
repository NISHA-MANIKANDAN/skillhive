import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { setCredentials } from '/src/store/slice/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the target path or default to home
  const from = location.state?.from || '/';

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin === import.meta.env.VITE_BACKEND_URL) {
        try {
          const { token, user } = event.data;
          dispatch(setCredentials({ token, user }));
          navigate(from); // Redirect to the previous page or default route
        } catch (error) {
          setError('Failed to process Google login');
          console.error('Google login error:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch, navigate, from]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Account not found. Please sign up first.');
        } else if (response.status === 401) {
          throw new Error('Invalid credentials. Please check your email and password.');
        } else {
          throw new Error(data.message || 'Login failed');
        }
      }

      dispatch(setCredentials({
        token: data.token,
        user: data.user,
      }));

      navigate(from); // Redirect to the previous page or default route
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-2">Enter your credentials to login</p>
        </div>

        <div className="p-6 pt-0">
          {error && (
            <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
