import querystring from 'querystring';
import { NextResponse } from 'next/server';


const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/callback';


export async function GET() {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email';

  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: state,
  });
  const response = NextResponse.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
  response.cookies.set('spotify_auth_state', state); 
  return response;
}

export function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map(x => possible[x % possible.length])
    .join('');
}

