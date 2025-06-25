import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Brain, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    // Debug: log data being sent
    // console.log('Register data:', data);
    const result = await registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword, // <-- add this line
      profile: {
        firstName: data.firstName,
        lastName: data.lastName
      }
    });
    // Debug: log backend result
    // console.log('Register result:', result);

    if (result.success) {
      navigate('/login');
    } else {
      setError('root', { message: result.error || 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <Brain className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">MindMirror</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Start your mental wellness journey today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Global Error */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.root.message}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  {...register('firstName', {
                    required: 'First name is required'
                  })}
                  type="text"
                  placeholder="First name"
                  className={`
                    w-full px-3 py-3 border rounded-lg transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    ${errors.firstName 
                      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                    }
                  `}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  {...register('lastName', {
                    required: 'Last name is required'
                  })}
                  type="text"
                  placeholder="Last name"
                  className={`
                    w-full px-3 py-3 border rounded-lg transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    ${errors.lastName 
                      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                    }
                  `}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: 'Username can only contain letters, numbers, underscores, and hyphens'
                  }
                })}
                type="text"
                placeholder="Username"
                className={`
                  w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  ${errors.username 
                    ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }
                `}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                type="email"
                placeholder="Email address"
                className={`
                  w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  ${errors.email 
                    ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }
                `}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`
                  w-full pl-10 pr-10 py-3 border rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  ${errors.password 
                    ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                className={`
                  w-full pl-10 pr-10 py-3 border rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  ${errors.confirmPassword 
                    ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Privacy */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register('acceptTerms', {
                    required: 'You must accept the terms and conditions'
                  })}
                  id="accept-terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="accept-terms" className="text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full py-3"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign in to your account
            </Link>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;