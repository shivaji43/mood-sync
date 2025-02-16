import React from "react";
import { cookies } from 'next/headers';

interface SpotifyImage {
    url: string;
    height: number;
    width: number;
}

interface SpotifyProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string | null;
        total: number;
    };
    href: string;
    id: string;
    images: SpotifyImage[];
    product: string;
    type: string;
    uri: string;
}

async function getSpotifyProfile() {
    const cookieStore = await cookies();
    const token = cookieStore.get('spotify_access_token');

    if (!token) {
        throw new Error("Login required");
    }

    const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return response.json();
}

export default async function ProfilePage() {
    let profile: SpotifyProfile;
    
    try {
        profile = await getSpotifyProfile();
    } catch (error) {
        return (
            <div className="min-h-screen p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-black text-lg font-semibold mb-2">Error</h2>
                    <p className="text-black">
                        {error instanceof Error ? error.message : 'Failed to load profile'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-start space-x-6">
                        {profile.images && profile.images[0] && (
                            <img
                                src={profile.images[0].url}
                                alt={profile.display_name}
                                className="w-32 h-32 rounded-full"
                            />
                        )}
                        <div className="flex-1">
                            <h1 className="text-2xl text-black font-bold mb-2">{profile.display_name}</h1>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-black">Email</p>
                                    <p className="font-medium text-black">{profile.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-black">Country</p>
                                    <p className="font-medium text-black">{profile.country}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-black">Followers</p>
                                    <p className="font-medium text-black">{profile.followers.total}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-black">Account Type</p>
                                    <p className="font-medium text-black capitalize">{profile.product}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg text-black font-semibold mb-4">Profile Details</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-black">Spotify URI</p>
                                <p className="font-mono text-black text-sm">{profile.uri}</p>
                            </div>
                            <div>
                                <p className="text-sm text-black">Profile URL</p>
                                <a 
                                    href={profile.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-black hover:underline"
                                >
                                    Open in Spotify
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg text-black font-semibold mb-4">Content Settings</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-black">Explicit Content Filter</p>
                                <p className="font-medium text-black">
                                    {profile.explicit_content.filter_enabled ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-black">Filter Lock</p>
                                <p className="font-medium text-black">
                                    {profile.explicit_content.filter_locked ? 'Locked' : 'Unlocked'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg text-black font-semibold mb-4">Raw Profile Data</h2>
                    <pre className="bg-gray-100 p-4 text-black rounded-lg overflow-auto max-h-96 text-sm">
                        {JSON.stringify(profile, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}