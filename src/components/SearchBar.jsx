import { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="searchbar" id="searchbar">
      <div className="searchbar__input-wrapper">
        <svg className="searchbar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="searchbar__input"
          placeholder="Tìm bài hát hoặc ca sĩ..."
          value={query}
          onChange={handleChange}
          id="search-input"
        />
      </div>
      <div className="searchbar__actions">
        <button className="searchbar__btn" id="btn-equalizer" title="Equalizer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="2" height="20" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="9" y="8" width="2" height="14" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="14" y="5" width="2" height="17" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="19" y="10" width="2" height="12" rx="1" fill="currentColor" opacity="0.3" />
          </svg>
        </button>
        <button className="searchbar__btn" id="btn-grid-view" title="Grid view">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
