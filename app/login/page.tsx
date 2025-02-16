// 'use client';

// export default function LoginPage() {
//   const handleLogin = () => {
//     window.location.href = '/api/signin';
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       <button 
//         onClick={handleLogin}
//         className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full"
//       >
//         Connect with Spotify
//       </button>
//     </div>
//   );
// }


"use client"

import Link from "next/link"
import { Music4 } from "lucide-react"

export default function LoginPage() {
  const handleLogin = () => {
        window.location.href = '/api/signin';
       };
  return (
    <>
      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        
        @layer base {
          :root {
            --background: 0 0% 100%;
            --foreground: 0 0% 3.9%;
            --card: 0 0% 100%;
            --card-foreground: 0 0% 3.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 0 0% 3.9%;
            --primary: 0 0% 9%;
            --primary-foreground: 0 0% 98%;
            --secondary: 0 0% 96.1%;
            --secondary-foreground: 0 0% 9%;
            --muted: 0 0% 96.1%;
            --muted-foreground: 0 0% 45.1%;
            --accent: 0 0% 96.1%;
            --accent-foreground: 0 0% 9%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 0 0% 98%;
            --border: 0 0% 89.8%;
            --input: 0 0% 89.8%;
            --ring: 0 0% 3.9%;
            --radius: 0.5rem;
          }
        
          .dark {
            --background: 0 0% 3.9%;
            --foreground: 0 0% 98%;
            --card: 0 0% 3.9%;
            --card-foreground: 0 0% 98%;
            --popover: 0 0% 3.9%;
            --popover-foreground: 0 0% 98%;
            --primary: 0 0% 98%;
            --primary-foreground: 0 0% 9%;
            --secondary: 0 0% 14.9%;
            --secondary-foreground: 0 0% 98%;
            --muted: 0 0% 14.9%;
            --muted-foreground: 0 0% 63.9%;
            --accent: 0 0% 14.9%;
            --accent-foreground: 0 0% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 0 0% 98%;
            --border: 0 0% 14.9%;
            --input: 0 0% 14.9%;
            --ring: 0 0% 83.1%;
          }
        }
      `}</style>

      <div className="min-h-screen w-full justify-evenly items-center relative flex  bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900 overflow-hidden">
        
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-[calc(50%-500px)] left-[calc(50%-500px)] w-[1000px] h-[1000px] rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
          <div className="absolute top-[calc(50%-400px)] left-[calc(50%-400px)] w-[800px] h-[800px] rounded-full bg-blue-500/20 blur-3xl animate-pulse delay-1000" />
        </div>
         <div>
          <h1 className="text-7xl">Your Music,<br></br>Your Mood</h1>
          <p className="text-xl mt-4">Let MoodSync curate the perfect playlist based on your mood :)</p>
         </div>
      
        <div className="w-full max-w-md mx-4 bg-black/40 border border-white/10 rounded-lg backdrop-blur-xl">
         
          <div className="space-y-6 text-center p-6 pb-8">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Music4 className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight">MoodSync</h1>
            </div>
            <p className="text-zinc-400 px-8">
              Discover personalized playlists that match your mood, powered by Spotify
            </p>
          </div>
          <div className="space-y-4 p-6">
            <button onClick={handleLogin} className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90 text-white py-3 px-4 rounded-md font-medium transition-colors">
              Continue with Spotify
            </button>
          </div>
          <div className="text-sm text-center text-zinc-400 p-6 pt-0 flex flex-col gap-4">
            <p>By continuing, you agree to MoodSync's Terms of Service and Privacy Policy</p>
            <div className="text-xs">
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              {" • "}
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

