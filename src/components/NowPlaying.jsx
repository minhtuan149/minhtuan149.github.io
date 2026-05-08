import { useRef, useEffect } from 'react';
import { formatTime } from '../data';
import './NowPlaying.css';

// Detailed SVG Cassette Tape with pixel/retro feel
function CassetteTape({ isPlaying }) {
  return (
    <div className="cassette" id="cassette-art">
      <div className="cassette__wrapper">
        <svg viewBox="0 0 260 180" className="cassette__svg">
          {/* Background panel with grid */}
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(0,255,65,0.05)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect x="0" y="0" width="260" height="180" fill="url(#grid)" rx="6" />
          
          {/* Cassette body outline */}
          <rect x="15" y="10" width="230" height="160" rx="10" ry="10" 
                fill="rgba(0,20,0,0.6)" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Top label area */}
          <rect x="30" y="18" width="200" height="65" rx="4" ry="4"
                fill="rgba(0,40,0,0.4)" stroke="currentColor" strokeWidth="0.8" />
          
          {/* Label text lines */}
          <line x1="40" y1="32" x2="220" y2="32" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
          <line x1="40" y1="42" x2="220" y2="42" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
          <line x1="40" y1="52" x2="220" y2="52" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
          <line x1="40" y1="62" x2="220" y2="62" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
          <line x1="40" y1="72" x2="220" y2="72" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
          
          {/* Tape window - transparent area */}
          <rect x="55" y="90" width="150" height="18" rx="3"
                fill="rgba(0,20,0,0.5)" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
          
          {/* Left reel hub */}
          <circle cx="90" cy="125" r="26" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="90" cy="125" r="18" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <circle cx="90" cy="125" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.8" />
          <circle cx="90" cy="125" r="4" fill="currentColor" opacity="0.3" />
          {/* Left reel spokes */}
          <g className={`cassette__reel ${isPlaying ? 'cassette__reel--spinning' : ''}`} style={{ transformOrigin: '90px 125px' }}>
            <line x1="90" y1="107" x2="90" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="73" y1="115" x2="80" y2="120" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="73" y1="135" x2="80" y2="130" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="90" y1="143" x2="90" y2="135" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="107" y1="135" x2="100" y2="130" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="107" y1="115" x2="100" y2="120" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          </g>
          
          {/* Right reel hub */}
          <circle cx="170" cy="125" r="26" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="170" cy="125" r="18" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <circle cx="170" cy="125" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.8" />
          <circle cx="170" cy="125" r="4" fill="currentColor" opacity="0.3" />
          {/* Right reel spokes */}
          <g className={`cassette__reel ${isPlaying ? 'cassette__reel--spinning' : ''}`} style={{ transformOrigin: '170px 125px' }}>
            <line x1="170" y1="107" x2="170" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="153" y1="115" x2="160" y2="120" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="153" y1="135" x2="160" y2="130" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="170" y1="143" x2="170" y2="135" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="187" y1="135" x2="180" y2="130" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="187" y1="115" x2="180" y2="120" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          </g>
          
          {/* Bottom screws */}
          <circle cx="35" cy="158" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          <line x1="33" y1="158" x2="37" y2="158" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <circle cx="225" cy="158" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          <line x1="223" y1="158" x2="227" y2="158" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          
          {/* Bottom teeth/guides */}
          <rect x="105" y="162" width="50" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
          <line x1="115" y1="162" x2="115" y2="167" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
          <line x1="125" y1="162" x2="125" y2="167" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
          <line x1="135" y1="162" x2="135" y2="167" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
          <line x1="145" y1="162" x2="145" y2="167" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
}

// Waveform visualizer
function Waveform({ isPlaying }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const heightsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const bars = 80;
    const barWidth = Math.floor(w / bars) - 1;
    
    if (!heightsRef.current) {
      heightsRef.current = Array.from({ length: bars }, () => Math.random() * h * 0.7 + h * 0.15);
    }
    const heights = heightsRef.current;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      
      for (let i = 0; i < bars; i++) {
        if (isPlaying) {
          heights[i] += (Math.random() - 0.5) * 6;
          heights[i] = Math.max(3, Math.min(h - 2, heights[i]));
        }
        const barH = heights[i];
        const x = i * (barWidth + 1);
        const y = (h - barH) / 2;
        
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 2;
        ctx.fillRect(x, y, barWidth, barH);
      }

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(draw);
      }
    }

    draw();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      className="waveform__canvas" 
      width="400" 
      height="36" 
      id="waveform-canvas"
    />
  );
}

export default function NowPlaying({ currentTrack, isPlaying, currentTime, duration, onSeek }) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(percent * duration);
  };

  return (
    <section className="now-playing" id="now-playing">
      <div className="now-playing__top-bar">
        <span className="now-playing__header">NOW PLAYING</span>
        <div className="now-playing__dots">
          <span className="now-playing__dot"></span>
          <span className="now-playing__dot"></span>
          <span className="now-playing__dot"></span>
        </div>
      </div>
      
      <div className="now-playing__content">
        {/* Cassette Tape Art */}
        <div className="now-playing__art">
          <CassetteTape isPlaying={isPlaying} />
        </div>

        {/* Track Info + Waveform */}
        <div className="now-playing__info">
          <h1 className="now-playing__title neon-text" id="track-title">
            {currentTrack?.title || 'No Track'}
          </h1>
          <p className="now-playing__artist" id="track-artist">
            {currentTrack?.artist || 'Unknown Artist'}
          </p>

          {/* Waveform */}
          <div className="now-playing__waveform">
            <Waveform isPlaying={isPlaying} />
          </div>

          {/* Time Display */}
          <div className="now-playing__time">
            <span id="current-time">{formatTime(currentTime)}</span>
            <span> / </span>
            <span id="total-time">{formatTime(duration)}</span>
          </div>

          {/* Progress Bar */}
          <div className="now-playing__progress" onClick={handleProgressClick} id="progress-bar">
            <div className="now-playing__progress-track">
              <div 
                className="now-playing__progress-fill" 
                style={{ width: `${progressPercent}%` }}
              />
              <div 
                className="now-playing__progress-thumb"
                style={{ left: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
