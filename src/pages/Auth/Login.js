// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Importing useDispatch to dispatch actions
import { setUser,} from '../../redux/user'; // Import the setUser action
import { statusFetch } from '../../utils/customFetch';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch to dispatch actions

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const body={email,
    password}
    try {
      const {data,status} = await statusFetch("POST",null,body,"auth/login")
      console.log(data);
      console.log(status);
  
      // If login is successful, save the token in localStorage
      localStorage.setItem('token', data.token);
      
      // Dispatch the setUser action to store the user's information in Redux
      dispatch(setUser({
        name: data.name,  // Accessing name directly
        email: data.email, // Accessing email directly
      }));
  
      // Redirect the user to the home page or wherever you'd like
      navigate('/');
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.log(err);
        
        setError(err.response.data.message);
        alert(err.response.data.message)
      } else {
        setError('Something went wrong, please try again.');
      }
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
