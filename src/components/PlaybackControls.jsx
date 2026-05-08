import './PlaybackControls.css';

export default function PlaybackControls({
  isPlaying,
  volume,
  repeatMode,
  isShuffled,
  onPlayPause,
  onPrev,
  onNext,
  onVolumeChange,
  onRepeatToggle,
  onShuffleToggle,
}) {
  return (
    <div className="controls" id="playback-controls">
      {/* Volume */}
      <div className="controls__volume">
        <button className="controls__btn controls__btn--noborder" id="btn-volume" title="Âm lượng">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.3" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
            <path d="M19.07 4.93a10 10 0 010 14.14" />
          </svg>
        </button>
        <div className="controls__volume-slider">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="controls__volume-input"
            id="volume-slider"
            style={{ '--volume-percent': `${volume}%` }}
          />
        </div>
      </div>

      {/* Transport Controls */}
      <div className="controls__transport">
        <button className="controls__btn" onClick={onPrev} id="btn-prev" title="Bài trước">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="5" width="3" height="14" rx="1" />
            <polygon points="21 5 10 12 21 19 21 5" />
          </svg>
        </button>

        <button className="controls__btn" id="btn-rewind" title="Tua lùi">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="11 5 1 12 11 19 11 5" />
            <polygon points="22 5 12 12 22 19 22 5" />
          </svg>
        </button>

        <button className="controls__btn controls__btn--play" onClick={onPlayPause} id="btn-play-pause" title={isPlaying ? 'Tạm dừng' : 'Phát'}>
          {isPlaying ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        <button className="controls__btn" id="btn-forward" title="Tua tới">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="2 5 12 12 2 19 2 5" />
            <polygon points="13 5 23 12 13 19 13 5" />
          </svg>
        </button>

        <button className="controls__btn" onClick={onNext} id="btn-next" title="Bài sau">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="3 5 14 12 3 19 3 5" />
            <rect x="18" y="5" width="3" height="14" rx="1" />
          </svg>
        </button>
      </div>

      {/* Mode Controls */}
      <div className="controls__modes">
        <div className="controls__mode-group">
          <span className="controls__mode-label">REPEAT</span>
          <button
            className={`controls__btn controls__btn--mode ${repeatMode !== 'none' ? 'controls__btn--active' : ''}`}
            onClick={onRepeatToggle}
            id="btn-repeat"
            title="Lặp lại"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 014-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
            {repeatMode === 'one' && <span className="controls__mode-badge">1</span>}
          </button>
        </div>

        <div className="controls__mode-group">
          <span className="controls__mode-label">SHUFFLE</span>
          <button
            className={`controls__btn controls__btn--mode ${isShuffled ? 'controls__btn--active' : ''}`}
            onClick={onShuffleToggle}
            id="btn-shuffle"
            title="Trộn bài"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </button>
        </div>

        {/* Favorite + More */}
        <button className="controls__btn controls__btn--sm" id="btn-favorite-now" title="Yêu thích">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        <button className="controls__btn controls__btn--sm" id="btn-add-track" title="Thêm vào playlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>

        <button className="controls__btn controls__btn--sm" id="btn-more" title="Thêm tùy chọn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
