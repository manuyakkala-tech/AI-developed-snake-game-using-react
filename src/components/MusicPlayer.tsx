import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'DATA_STREAM_0X01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'OVERRIDE_PROTOCOL.WAV',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'KERNEL_PANIC_MIX',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [glitchTrigger, setGlitchTrigger] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log('SYS.AUDIO.ERR', e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
     const cycle = setInterval(() => {
        setGlitchTrigger(prev => prev + 1);
     }, 3000);
     return () => clearInterval(cycle);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const toggleMute = () => {
    if (audioRef.current) {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    }
  }

  return (
    <div className="w-full bg-black border-4 border-magenta p-4 mt-6 lg:mt-0 relative group shadow-[0px_0px_20px_rgba(255,0,255,0.4)]">
      <div className="absolute top-0 right-0 bg-magenta text-black px-2 py-1 text-lg uppercase font-bold">AUDIO_MODULE</div>
      
      <div className="mt-8 mb-4 border-2 border-cyan p-3 bg-cyan/10">
         <div className="flex justify-between items-center text-cyan mb-1 text-xl">
           <span>TRACK_{currentTrack.id}</span>
           <span className="uppercase">{isPlaying ? 'PLAYING' : 'HALTED'}</span>
         </div>
         <div className={`text-3xl uppercase font-bold sm:truncate ${glitchTrigger % 3 === 0 && isPlaying ? 'text-magenta animate-pulse' : 'text-white'} transition-colors`}>
           {currentTrack.title}
         </div>
         {isPlaying && (
           <div className="w-full h-2 mt-4 flex gap-1 items-end">
             {[...Array(20)].map((_, i) => (
                <div key={i} className="flex-1 bg-cyan animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
             ))}
           </div>
         )}
      </div>

      <div className="flex gap-2 mb-4 h-6">
         {TRACKS.map((t, idx) => (
            <div 
              key={t.id} 
              className={`flex-1 border-2 ${idx === currentTrackIndex ? 'bg-cyan border-cyan' : 'border-gray-800 bg-transparent'}`}
            ></div>
         ))}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={skipBack} 
          className="flex-1 bg-black text-magenta border-2 border-magenta hover:bg-magenta hover:text-black uppercase py-3 text-2xl font-bold cursor-pointer transition-colors"
        >
          &lt;&lt; BWD
        </button>
        <button 
          onClick={togglePlay} 
          className="flex-[1.5] bg-cyan text-black border-2 border-cyan hover:bg-white hover:border-white uppercase py-3 text-2xl font-bold cursor-pointer transition-colors"
        >
          {isPlaying ? 'PAUSE' : 'EXECUTE'}
        </button>
        <button 
          onClick={skipForward} 
          className="flex-1 bg-black text-magenta border-2 border-magenta hover:bg-magenta hover:text-black uppercase py-3 text-2xl font-bold cursor-pointer transition-colors"
        >
          FWD &gt;&gt;
        </button>
      </div>
      
      <div className="mt-6 flex justify-between items-end text-right">
        <div className="text-gray-600 text-lg uppercase animate-pulse">
           {isPlaying ? 'DECODING_STREAM...' : 'STANDBY'}
        </div>
        <button onClick={toggleMute} className="text-yellow border-2 border-yellow px-3 py-1 hover:bg-yellow hover:text-black cursor-pointer uppercase text-xl font-bold transition-colors">
           MUTE: {isMuted ? 'ON' : 'OFF'}
        </button>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={skipForward}
        autoPlay={isPlaying}
        loop={false}
      />
    </div>
  );
}
