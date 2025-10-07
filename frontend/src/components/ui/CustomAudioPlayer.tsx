"use client";
import { useRef, useState, useEffect } from "react";
import { TfiControlBackward, TfiControlForward } from "react-icons/tfi";
import { IoCaretForwardCircleOutline, IoPauseCircleOutline } from "react-icons/io5";
import { HiVolumeUp } from "react-icons/hi";

export default function CustomAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);
    const setAudioDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = (Number(e.target.value) / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(Number(e.target.value));
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol;
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex items-center gap-4 bg-white py-2 w-full max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => skip(-10)} className="text-2xl text-gray-600 hover:scale-110 transition">
          <TfiControlBackward />
        </button>
        <button onClick={togglePlay} className="text-4xl text-blue-500 hover:scale-110 transition">
          {isPlaying ? <IoPauseCircleOutline /> : <IoCaretForwardCircleOutline />}
        </button>
        <button onClick={() => skip(10)} className="text-2xl text-gray-600 hover:scale-110 transition">
          <TfiControlForward />
        </button>
      </div>

      {/* Thanh tiến trình */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm text-gray-500 w-12 text-right">{formatTime(audioRef.current?.currentTime || 0)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full accent-blue-500"
        />
        <span className="text-sm text-gray-500 w-12">{formatTime(duration)}</span>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-28">
        <HiVolumeUp className="text-gray-600" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          className="accent-blue-500 w-full"
        />
      </div>

      <audio ref={audioRef} src={src} />
    </div>
  );
}
