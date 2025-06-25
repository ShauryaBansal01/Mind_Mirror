import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import api from '../../utils/api';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile(res.data.user || res.data);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <Card className="text-center py-12">Loading...</Card>
        ) : error ? (
          <Card className="text-center py-12 text-red-500">{error}</Card>
        ) : profile ? (
          <Card className="py-10 px-8 shadow-xl rounded-2xl relative overflow-hidden">
            <div className="flex flex-col items-center mb-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-3">
                {profile.profile?.avatarUrl ? (
                  <img src={profile.profile.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
                ) : profile.profile?.fullName ? (
                  profile.profile.fullName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                ) : profile.username ? (
                  profile.username[0].toUpperCase()
                ) : (
                  <User className="w-10 h-10 text-white opacity-70" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.profile?.fullName || profile.username || profile.email}</h1>
              <div className="text-gray-500 text-sm mb-1">@{profile.username}</div>
              <div className="text-gray-400 text-xs">Member since: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div className="mb-4 text-center">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-2">{profile.email}</span>
              {profile.profile?.bio && (
                <div className="mt-2 text-gray-700 italic">{profile.profile.bio}</div>
              )}
            </div>
            {/* Extra info */}
            {profile.profile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {profile.profile.location && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <span className="font-semibold text-gray-600">Location:</span> {profile.profile.location}
                  </div>
                )}
                {profile.profile.fullName && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <span className="font-semibold text-gray-600">Name:</span> {profile.profile.fullName}
                  </div>
                )}
              </div>
            )}
          </Card>
        ) : (
          <Card className="text-center py-12">No profile data found.</Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
