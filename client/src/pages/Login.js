import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Shield, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const { elderlyMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await login(data);
      if (result.success) {
        // Navigation will be handled by the auth context
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Login failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <span className="text-3xl">🌿</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">AyurSutra</h1>
                <p className="text-primary-100">Government-Standard Ayurveda Platform</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-primary-200 mr-3" />
              <div>
                <h3 className="font-semibold">Government Compliant</h3>
                <p className="text-primary-100 text-sm">NDHM & AYUSH certified platform</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-primary-200 mr-3" />
              <div>
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-primary-100 text-sm">Your health data is protected</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-2xl text-white">🌿</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">AyurSutra</h1>
                <p className="text-neutral-600 text-sm">Admin Panel</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className={`font-semibold text-neutral-900 ${elderlyMode ? 'text-2xl' : 'text-xl'}`}>
              Welcome back
            </h2>
            <p className="text-neutral-600 mt-2">
              Sign in to your admin account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                id="email"
                className={`input ${errors.email ? 'input-error' : ''} ${elderlyMode ? 'text-lg py-3' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`input ${errors.password ? 'input-error' : ''} ${elderlyMode ? 'text-lg py-3' : ''} pr-10`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="ml-2 text-sm text-neutral-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Forgot password?
              </button>
            </div>

            {/* Error message */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full btn btn-primary ${elderlyMode ? 'py-3 text-lg' : ''} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-500">
              © 2024 AyurSutra. All rights reserved.
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Government-compliant healthcare platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;