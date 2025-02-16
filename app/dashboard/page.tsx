'use client';

import { useEffect, useState } from 'react';
import { SpotifyUser } from '@/types/types';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('spotify_user='));
    
    if (!userCookie) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user.display_name}!</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Profile Information</h2>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Spotify ID: {user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}