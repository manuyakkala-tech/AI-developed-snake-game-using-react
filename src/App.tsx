import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-vga select-none">
      <div className="crt-overlay"></div>
      <div className="static-noise"></div>
      
      <div className="relative z-10 w-full max-w-5xl">
        <header className="mb-12 border-b-4 border-magenta pb-4 flex justify-between items-end">
          <div>
             <h1 
               className="text-6xl text-cyan uppercase glitch-text m-0 leading-none drop-shadow-[2px_2px_0px_#ff00ff]" 
               data-text="SYS.SERPENT_WAV"
             >
               SYS.SERPENT_WAV
             </h1>
          </div>
          <div className="text-right text-yellow text-2xl tracking-widest hidden md:block leading-tight">
            <p>MEM: 640K OK</p>
            <p className="animate-pulse">AUDIO_LINK: ESTABLISHED</p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Left Side: Game */}
          <div className="w-full lg:w-3/5 border-4 border-cyan p-1 relative bg-black shadow-[0_0_15px_#00ffff]">
            <div className="absolute top-0 left-0 bg-cyan text-black px-2 uppercase text-lg border-b-2 border-r-2 border-black font-bold z-10">EXEC: SNAKE.EXE</div>
            <SnakeGame />
          </div>

          {/* Right Side: Music Player */}
          <div className="w-full lg:w-2/5 flex flex-col items-center">
             <MusicPlayer />
          </div>
        </div>
      </div>
    </div>
  );
}
