"use client"

import React, { useEffect, useState } from "react";
import {useCookies} from 'next-client-cookies';



interface SpotifyProfile {
    display_name: string;
    id: string;
    email: string;
    // add more fields from the API response if needed
}

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<SpotifyProfile | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const cookies = useCookies();

    // Utility function to get a cookie by name
    const spotify_token = cookies.get('spotify_access_token');

    useEffect(() => {
        const fetchSpotifyProfile = async () => {
            const token = spotify_token;
            if (!token) {
                setError("Spotify access token not found in cookies.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("https://api.spotify.com/v1/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch profile: ${response.statusText}`);
                }

                const data = await response.json();
                setProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSpotifyProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Spotify Profile</h1>
            {profile && (
                <div>
                    <p>
                        <strong>Name:</strong> {profile.display_name}
                    </p>
                    <p>
                        <strong>ID:</strong> {profile.id}
                    </p>
                    <p>
                        <strong>Email:</strong> {profile.email}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;