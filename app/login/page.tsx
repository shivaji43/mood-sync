'use client';

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/api/signin';
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button 
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full"
      >
        Connect with Spotify
      </button>
    </div>
  );
}