/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "http://localhost:3000/api/callback";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = request.cookies.get('spotify_auth_state')?.value;

  // Check state match to prevent CSRF attacks
  if (!state || state !== storedState) {
    return NextResponse.redirect('/error?message=state_mismatch');
  }

  if (code) {
    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        },
        body: new URLSearchParams({
          code,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to fetch token');
      }

      const data: SpotifyAuthResponse = await tokenResponse.json();

      // Store tokens securely (you might want to use a more secure storage method)
      const response = NextResponse.redirect('http://localhost:3000/dashboard');
      response.cookies.set('spotify_access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.expires_in,
      });
      
      response.cookies.set('spotify_refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;
    } catch (error) {
      console.error('Error getting token:', error);
      return NextResponse.redirect('http://localhost:3000/dashboard');
    }
  }
  const cookieStore = await cookies();
  const access_token  = await cookieStore.get('spotify_access_token')?.value;
  const data = await fetchProfile(access_token);
  console.log(data);

  return NextResponse.redirect('http://localhost:3000/dashboard');
}

export interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

async function fetchProfile(token:any): Promise<any> {
  const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}