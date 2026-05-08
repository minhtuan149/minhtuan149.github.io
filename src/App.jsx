import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import NowPlaying from './components/NowPlaying';
import PlaybackControls from './components/PlaybackControls';
import TrackList from './components/TrackList';
import SearchBar from './components/SearchBar';
import { tracks } from './data';
import './App.css';

function App() {
  const [activeNav, setActiveNav] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(146); // 02:26
  const [volume, setVolume] = useState(70);
  const [repeatMode, setRepeatMode] = useState('none');
  const [isShuffled, setIsShuffled] = useState(false);
  const [filteredTracks, setFilteredTracks] = useState(tracks);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleTrackSelect = useCallback((track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
  }, []);

  const handlePrev = useCallback(() => {
    const idx = tracks.findIndex((t) => t.id === currentTrack?.id);
    const prevIdx = idx > 0 ? idx - 1 : tracks.length - 1;
    setCurrentTrack(tracks[prevIdx]);
    setCurrentTime(0);
  }, [currentTrack]);

  const handleNext = useCallback(() => {
    const idx = tracks.findIndex((t) => t.id === currentTrack?.id);
    const nextIdx = idx < tracks.length - 1 ? idx + 1 : 0;
    setCurrentTrack(tracks[nextIdx]);
    setCurrentTime(0);
  }, [currentTrack]);

  const handleSeek = useCallback((time) => {
    setCurrentTime(time);
  }, []);

  const handleVolumeChange = useCallback((vol) => {
    setVolume(vol);
  }, []);

  const handleRepeatToggle = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  }, []);

  const handleShuffleToggle = useCallback(() => {
    setIsShuffled((prev) => !prev);
  }, []);

  const handleSearch = useCallback((query) => {
    if (!query.trim()) {
      setFilteredTracks(tracks);
      return;
    }
    const q = query.toLowerCase();
    setFilteredTracks(
      tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.album.toLowerCase().includes(q)
      )
    );
  }, []);

  return (
    <div className="app" id="app">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      <main className="main" id="main-content">
        <NowPlaying
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={currentTrack?.duration || 0}
          onSeek={handleSeek}
        />
        <PlaybackControls
          isPlaying={isPlaying}
          volume={volume}
          repeatMode={repeatMode}
          isShuffled={isShuffled}
          onPlayPause={handlePlayPause}
          onPrev={handlePrev}
          onNext={handleNext}
          onVolumeChange={handleVolumeChange}
          onRepeatToggle={handleRepeatToggle}
          onShuffleToggle={handleShuffleToggle}
        />
        <TrackList
          tracks={filteredTracks}
          currentTrack={currentTrack}
          onTrackSelect={handleTrackSelect}
        />
        <SearchBar onSearch={handleSearch} />
      </main>
    </div>
  );
}

export default App;
