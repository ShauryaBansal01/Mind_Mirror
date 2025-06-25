import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Eye, 
  EyeOff,
  Settings,
  Bell,
  Shield,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile
  } = useForm({
    defaultValues: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      email: user?.email || '',
      username: user?.username || '',
      timezone: user?.profile?.timezone || 'UTC',
      bio: user?.profile?.bio || ''
    }
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
    watch
  } = useForm();

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data) => {
    const result = await updateProfile({
      profile: {
        firstName: data.firstName,
        lastName: data.lastName,
        timezone: data.timezone,
        bio: data.bio
      }
    });

    if (result.success) {
      toast.success('Profile updated successfully!');
    }
  };

  const onPasswordSubmit = async (data) => {
    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });

    if (result.success) {
      resetPassword();
      toast.success('Password changed successfully!');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'password', name: 'Password', icon: Lock },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'privacy', name: 'Privacy', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card padding="none">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          w-full flex items-center space-x-3 px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors
                          ${activeTab === tab.id
                            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <Card>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
                    <p className="text-gray-600">Update your personal information and profile details.</p>
                  </div>

                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            {...registerProfile('firstName', {
                              required: 'First name is required'
                            })}
                            type="text"
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter your first name"
                          />
                        </div>
                        {profileErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            {...registerProfile('lastName', {
                              required: 'Last name is required'
                            })}
                            type="text"
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter your last name"
                          />
                        </div>
                        {profileErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={user?.username || ''}
                        disabled
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-sm text-gray-500">Username cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        {...registerProfile('timezone')}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        {...registerProfile('bio')}
                        rows={4}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Tell us a bit about yourself..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        loading={isProfileSubmitting}
                        className="flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {activeTab === 'password' && (
                <Card>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h2>
                    <p className="text-gray-600">Update your password to keep your account secure.</p>
                  </div>

                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          {...registerPassword('currentPassword', {
                            required: 'Current password is required'
                          })}
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          {...registerPassword('newPassword', {
                            required: 'New password is required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters'
                            }
                          })}
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          {...registerPassword('confirmPassword', {
                            required: 'Please confirm your new password',
                            validate: value => value === newPassword || 'Passwords do not match'
                          })}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        loading={isPasswordSubmitting}
                        className="flex items-center space-x-2"
                      >
                        <Lock className="h-4 w-4" />
                        <span>Update Password</span>
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {activeTab === 'preferences' && (
                <Card>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Preferences</h2>
                    <p className="text-gray-600">Customize your MindMirror experience.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive email updates about your progress</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Daily Reminders</h3>
                        <p className="text-sm text-gray-500">Get reminded to write in your journal</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">AI Analysis</h3>
                        <p className="text-sm text-gray-500">Automatically analyze entries for cognitive distortions</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Weekly Reports</h3>
                        <p className="text-sm text-gray-500">Receive weekly progress summaries</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <Button className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Preferences</span>
                    </Button>
                  </div>
                </Card>
              )}

              {activeTab === 'privacy' && (
                <Card>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Privacy & Security</h2>
                    <p className="text-gray-600">Manage your privacy settings and account security.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="text-sm font-medium text-green-800">Your data is secure</h3>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        All your journal entries are encrypted and stored securely. We never share your personal data.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Data Export</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Download all your journal entries and data in JSON format.
                        </p>
                        <Button variant="outline" size="sm">
                          Export My Data
                        </Button>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Account Deletion</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="danger" size="sm" className="flex items-center space-x-2">
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Account</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
