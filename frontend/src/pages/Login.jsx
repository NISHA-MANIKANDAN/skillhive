import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { setCredentials } from '../store/slice/authSlice';

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Get the target path or default to home
  const from = location.state?.from || '/';

  useEffect(() => {
    // Clear any existing session data when the login component mounts
    sessionStorage.clear();

    const handleMessage = async (event) => {
      if (event.origin === import.meta.env.VITE_BACKEND_URL) {
        try {
          const { token, user } = event.data;
          dispatch(setCredentials({ token, user }));
          navigate(from);
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
    setError('');
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

      // Clear any existing session data before setting new credentials
      sessionStorage.clear();
      
      dispatch(setCredentials({
        token: data.token,
        user: data.user,
      }));

      navigate(from);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);

    const popup = window.open(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/google?state=${state}`,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const pollTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollTimer);
        setIsGoogleLoading(false);
        if (!sessionStorage.getItem('auth_success')) {
          setError('Authentication was cancelled');
        }
      }
    }, 500);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/google-check?state=${state}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (data.exists) {
        // Clear any existing session data before setting new credentials
        sessionStorage.clear();
        
        dispatch(setCredentials({ token: data.token, user: data.user }));
        navigate(from);
      } else {
        setError('User not found. Please sign up first.');
      }
    } catch (err) {
      setError('Error checking user existence: ' + err.message);
    } finally {
      setIsGoogleLoading(false);
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

            {/* Sign in with Google button */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93h3.66v-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 4.56c1.07 0 2.08.37 2.86.98l2.12-2.12C15.46 2.03 13.57.88 12 0 7.7 0 3.99 2.47 2.18 5.47l3.66 2.83c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Continue with Google'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
