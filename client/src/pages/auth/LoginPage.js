import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Brain, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login({
      identifier: data.identifier,
      password: data.password,
      rememberMe: data.rememberMe || false // Pass rememberMe to backend
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('root', { message: result.error });
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
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to continue your mental wellness journey
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

            {/* Email/Username Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('identifier', {
                  required: 'Email or username is required'
                })}
                type="text"
                placeholder="Email or username"
                className={`
                  w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  ${errors.identifier 
                    ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }
                `}
              />
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-600">{errors.identifier.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('password', {
                  required: 'Password is required'
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('rememberMe')}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="text-primary-600 hover:text-primary-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full py-3"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Create your account
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

export default LoginPage;