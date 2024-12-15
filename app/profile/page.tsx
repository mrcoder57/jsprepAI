"use client";
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

const UserProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the session and retrieve the token
        const session = await getSession();
        
        if (!session?.token) {
          throw new Error('No token found');
        }

        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.token}`, // Use token from session
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div>
      <h1>{profile.fullName}</h1>
      <p>Email: {profile.email}</p>
      <p>Country: {profile.country}</p>
      <p>Subjects: {profile.subjects.join(', ')}</p>
    </div>
  );
};

export default UserProfile;
