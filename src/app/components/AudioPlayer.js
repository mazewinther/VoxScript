import React, { useState, useRef, useEffect } from 'react';
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";

const AudioPlayer = ({ file }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setAnimationProgress(progress);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  if (!file) return null;

  return (
    <div 
      className="mt-4 animate-fade-in w-full max-w-md relative group" 
      onClick={togglePlay}
    >
      <div className="bg-white shadow-md rounded-lg p-4 py-3 flex items-center cursor-pointer overflow-hidden">
        <div className="mr-3 transition-transform duration-300 transform group-hover:scale-110">
          {isPlaying ? (
            <PauseCircleIcon className="h-6 w-6 text-gray-500" />
          ) : (
            <PlayCircleIcon className="h-6 w-6 text-gray-500" />
          )}
        </div>

        <div className="overflow-hidden">
          <p className="text-lg font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
        </div>

        <div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-bl-lg" 
          style={{ width: `${animationProgress}%` }} 
        />
      </div>

      <audio
        key={file.name} // Add key prop to force re-render
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded} // Add onEnded event handler
      >
        <source src={URL.createObjectURL(file)} type={file.type} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;