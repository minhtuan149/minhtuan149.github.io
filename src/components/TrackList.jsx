import { formatTime } from '../data';
import './TrackList.css';

export default function TrackList({ tracks, currentTrack, onTrackSelect }) {
  return (
    <section className="tracklist" id="tracklist">
      <div className="tracklist__header">
        <h2 className="tracklist__title">
          DANH SÁCH PHÁT
          <span className="tracklist__count">(846 BÀI HÁT)</span>
        </h2>
        <button className="tracklist__view-toggle" id="btn-view-toggle" title="Chuyển chế độ xem">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" strokeLinecap="round" />
            <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" strokeLinecap="round" />
            <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="tracklist__table-wrapper">
        <table className="tracklist__table">
          <thead>
            <tr className="tracklist__row tracklist__row--header">
              <th className="tracklist__cell tracklist__cell--num">#</th>
              <th className="tracklist__cell tracklist__cell--title">BÀI HÁT</th>
              <th className="tracklist__cell tracklist__cell--artist">NGHỆ SĨ</th>
              <th className="tracklist__cell tracklist__cell--album">ALBUM</th>
              <th className="tracklist__cell tracklist__cell--duration">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </th>
              <th className="tracklist__cell tracklist__cell--action"></th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <tr
                  key={track.id}
                  className={`tracklist__row ${isActive ? 'tracklist__row--active' : ''}`}
                  onClick={() => onTrackSelect(track)}
                  id={`track-${track.id}`}
                >
                  <td className="tracklist__cell tracklist__cell--num">
                    {isActive ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    ) : (
                      track.id
                    )}
                  </td>
                  <td className="tracklist__cell tracklist__cell--title">{track.title}</td>
                  <td className="tracklist__cell tracklist__cell--artist">{track.artist}</td>
                  <td className="tracklist__cell tracklist__cell--album">{track.album}</td>
                  <td className="tracklist__cell tracklist__cell--duration">{formatTime(track.duration)}</td>
                  <td className="tracklist__cell tracklist__cell--action">
                    <button className="tracklist__add-btn" title="Thêm vào playlist" onClick={(e) => e.stopPropagation()}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
