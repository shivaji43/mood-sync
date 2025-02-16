import { cookies } from "next/headers";
import { SpotifyUser } from "@/types/types";

export const getSpotifyUser = async (): Promise<SpotifyUser> => {
    const cookieStore = await cookies();
    
    const access_token = cookieStore.get('spotify_access_token');

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user data');
  }

  return response.json();
};