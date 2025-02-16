import { NextRequest, NextResponse } from 'next/server';
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
    return NextResponse.redirect('http://localhost:3000/login?error=state_mismatch&message=Authentication failed. Please try again.');
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
        throw new Error('Token fetch failed: ' + tokenResponse.statusText);
      }

      const data: SpotifyAuthResponse = await tokenResponse.json();

      // Verify we got a valid access token
      if (!data.access_token) {
        throw new Error('No access token received');
      }

      // Try to fetch the profile to verify the token works
      try {
        const profileResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${data.access_token}` }
        });

        if (!profileResponse.ok) {
          throw new Error('Profile fetch failed');
        }

        // If we get here, both token and profile fetch worked
        const response = NextResponse.redirect('http://localhost:3000/profile?login=success');
        
        // Set cookies
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

      } catch (profileError) {
        console.error('Profile fetch error:', profileError);
        return NextResponse.redirect('http://localhost:3000/login?error=profile_fetch_failed&message=Failed to fetch profile. Please try logging in again.');
      }

    } catch (error) {
      console.error('Token fetch error:', error);
      return NextResponse.redirect('http://localhost:3000/login?error=token_fetch_failed&message=Authentication failed. Please try logging in again.');
    }
  }

  // If we get here, no code was provided
  return NextResponse.redirect('http://localhost:3000/login?error=no_code&message=No authorization code received. Please try logging in again.');
}

export interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}