import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect after successful registration
import { statusFetch } from '../../utils/customFetch';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
    // Validate email format
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
  
    // Validate password strength
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters, include one capital letter and one number.");
      setLoading(false);
      return;
    }
  
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
  
    const body = { name, email, password };
  
    try {
      const { data, status } = await statusFetch("POST", null, body, 'auth/register');
      console.log(data, status);
  
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      }
    } catch (err) {
      setLoading(false);
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong, please try again.');
      }
    }
  };
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
