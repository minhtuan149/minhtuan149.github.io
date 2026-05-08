# CLAUDE.md — HTGO-APP (Arcade Music Terminal)

## 🎯 Tổng Quan Dự Án

**HTGO-APP** là một website nghe nhạc trực tuyến theo phong cách **Arcade Music Terminal** — giao diện retro terminal với tông màu tối (dark theme) và hiệu ứng neon xanh lá (green neon glow). Nhạc được stream trực tiếp từ các file audio lưu trữ trong source code của dự án.

---

## 🎨 Design System

### Phong Cách Thiết Kế

- **Theme**: Dark Retro Terminal / Arcade Cabinet
- **Aesthetic**: Cyberpunk-inspired, CRT monitor feel, pixel/monospace typography
- **Mood**: Nostalgic, futuristic, immersive

### Bảng Màu (Color Palette)

| Token                  | Giá Trị HEX   | Mô Tả                                |
| ---------------------- | -------------- | ------------------------------------- |
| `--color-bg-primary`   | `#0a0a0a`      | Nền chính (gần như đen tuyệt đối)     |
| `--color-bg-secondary` | `#0d1a0d`      | Nền sidebar / panel phụ               |
| `--color-bg-card`      | `#111a11`      | Nền card / now playing area           |
| `--color-bg-hover`     | `#1a2e1a`      | Nền khi hover trên item               |
| `--color-bg-active`    | `#0f2b0f`      | Nền item đang active (bài đang phát)  |
| `--color-neon-primary` | `#00ff41`      | Neon xanh lá chính — text, icon, glow |
| `--color-neon-dim`     | `#00cc33`      | Neon xanh nhạt hơn — text phụ         |
| `--color-neon-dark`    | `#008f20`      | Xanh tối — border, divider            |
| `--color-neon-glow`    | `rgba(0,255,65,0.15)` | Hiệu ứng glow mờ               |
| `--color-text-primary` | `#00ff41`      | Text chính                            |
| `--color-text-secondary`| `#00cc33`     | Text phụ                              |
| `--color-text-muted`   | `#006b1a`      | Text mờ / disabled                    |
| `--color-border`       | `#004d15`      | Viền chung                            |
| `--color-scrollbar`    | `#00ff41`      | Scrollbar thumb                       |
| `--color-danger`       | `#ff0040`      | Cảnh báo / lỗi (neon đỏ)             |

### Typography

- **Font chính**: `"Share Tech Mono"`, `"Fira Code"`, `"Courier New"`, monospace
- **Font heading**: `"Press Start 2P"` hoặc `"Share Tech Mono"` (all caps, letter-spacing rộng)
- **Font size base**: `14px`
- **Line height**: `1.5`
- **Text transform**: UPPERCASE cho navigation, headings, labels
- **Letter spacing**: `0.05em` — `0.15em` tùy context

### Hiệu Ứng (Effects)

```css
/* Neon Glow Effect - dùng cho text nổi bật, icon active */
text-shadow: 0 0 4px #00ff41, 0 0 8px #00ff41, 0 0 16px rgba(0,255,65,0.5);

/* Box Neon Glow - dùng cho button, card active */
box-shadow: 0 0 4px rgba(0,255,65,0.3), 0 0 8px rgba(0,255,65,0.15), inset 0 0 4px rgba(0,255,65,0.1);

/* Border Glow */
border: 1px solid #004d15;
box-shadow: 0 0 4px rgba(0,255,65,0.2);

/* CRT Scanline Overlay (optional, subtle) */
background: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(0,0,0,0.1) 2px,
  rgba(0,0,0,0.1) 4px
);

/* Cassette Tape Spin Animation */
@keyframes tape-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Spacing & Layout

- **Sidebar width**: `220px`
- **Now Playing area height**: `~280px`
- **Track list row height**: `48px`
- **Bottom bar (search/control) height**: `60px`
- **Border radius**: `4px` — `8px` (giữ góc khá vuông cho retro feel)
- **Padding chung**: `12px`, `16px`, `20px`
- **Gap chung**: `8px`, `12px`, `16px`

---

## 🏗️ Kiến Trúc Dự Án

### Công Nghệ

- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript (ES6+ modules)
- **Streaming**: HTML5 `<audio>` API với Web Audio API cho visualization
- **Không dùng framework** — pure vanilla để tối ưu hiệu năng
- **Build tool**: Không cần — serve static files trực tiếp
- **Dev server**: Sử dụng `live-server` hoặc VS Code Live Server extension

### Cấu Trúc Thư Mục

```
HTGO-APP/
├── index.html                  # Entry point chính
├── CLAUDE.md                   # File hướng dẫn này
├── css/
│   ├── index.css               # CSS variables, reset, global styles
│   ├── layout.css              # Grid/flex layout chính
│   ├── sidebar.css             # Sidebar navigation styles
│   ├── player.css              # Now Playing section styles
│   ├── tracklist.css           # Track list / playlist table styles
│   ├── controls.css            # Playback controls styles
│   ├── search.css              # Search bar styles
│   └── animations.css          # Keyframes, transitions
├── js/
│   ├── app.js                  # Entry point JS, khởi tạo app
│   ├── player.js               # Audio player core logic (play, pause, seek, volume)
│   ├── playlist.js             # Playlist management (load, shuffle, repeat)
│   ├── tracklist.js            # Render track list, handle track selection
│   ├── sidebar.js              # Sidebar navigation, playlist switching
│   ├── search.js               # Search / filter logic
│   ├── visualizer.js           # Audio waveform / visualizer (Web Audio API)
│   ├── storage.js              # LocalStorage — lưu trạng thái, playlist, yêu thích
│   └── utils.js                # Helpers: format time, debounce, etc.
├── assets/
│   ├── images/
│   │   ├── logo.png            # Logo "Arcade Music Terminal"
│   │   ├── cassette.png        # Hình cassette tape cho Now Playing
│   │   └── icons/              # SVG icons (play, pause, next, prev, etc.)
│   └── fonts/                  # Web fonts nếu self-host
├── music/
│   ├── metadata.json           # Database bài hát (JSON)
│   └── tracks/                 # Thư mục chứa file nhạc (.mp3, .ogg, .wav)
│       ├── song-001.mp3
│       ├── song-002.mp3
│       └── ...
└── data/
    └── playlists.json          # Danh sách playlist mặc định
```

### File Metadata Bài Hát (`music/metadata.json`)

```json
{
  "tracks": [
    {
      "id": "001",
      "title": "Đôi Mắt",
      "artist": "Wanbi Tuấn Anh",
      "album": "Đôi Mắt - Single",
      "duration": 289,
      "file": "tracks/doi-mat.mp3",
      "cover": "images/covers/doi-mat.jpg",
      "genre": "V-Pop",
      "year": 2008
    }
  ]
}
```

### File Playlist (`data/playlists.json`)

```json
{
  "playlists": [
    {
      "id": "nhac-tre-8x9x",
      "name": "Nhạc Trẻ 8x9x",
      "icon": "music-note",
      "trackIds": ["001", "002", "003"]
    },
    {
      "id": "lofi-chill",
      "name": "Lo-fi Chill",
      "icon": "music-note",
      "trackIds": ["010", "011", "012"]
    }
  ]
}
```

---

## 📐 Layout & Components

### Layout Tổng Thể

```
┌──────────────────────────────────────────────────────────┐
│  ┌─────────┐  ┌──────────────────────────────────────┐   │
│  │         │  │         NOW PLAYING                   │   │
│  │         │  │  [Cassette Art]  Title / Artist       │   │
│  │ SIDEBAR │  │                 Waveform              │   │
│  │  (nav)  │  │                 Time / Progress       │   │
│  │         │  │  [Volume] [Controls] [Repeat/Shuffle] │   │
│  │         │  ├──────────────────────────────────────┤   │
│  │         │  │       DANH SÁCH PHÁT (Track List)     │   │
│  │         │  │  #  | Bài Hát | Nghệ Sĩ | Album | ⏱  │   │
│  │         │  │  ... scrollable rows ...              │   │
│  │         │  ├──────────────────────────────────────┤   │
│  │  [⚙️][🏠][⏻] │  │  🔍 Search Bar                │   │
│  └─────────┘  └──────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Components Chi Tiết

#### 1. Sidebar (`sidebar`)
- **Logo**: "ARCADE MUSIC TERMINAL" với icon retro
- **Navigation chính**: Trang Chủ, Khám Phá, Thư Viện, Radio, Yêu Thích, Playlist
- **Playlist của tôi**: Danh sách playlist tùy chỉnh + nút thêm mới (+)
- **Bottom icons**: Settings (⚙️), Home (🏠), Power (⏻)
- **Active state**: Nút được chọn có background neon glow + border-left accent

#### 2. Now Playing (`now-playing`)
- **Cassette artwork**: Hình ảnh cassette tape, cuộn băng xoay khi đang phát
- **Track info**: Tên bài hát (lớn, neon sáng), tên nghệ sĩ (neon dim)
- **Waveform visualizer**: Thanh sóng âm thanh (dùng Web Audio API AnalyserNode)
- **Time display**: `02:26 / 04:49` format
- **Progress bar**: Seekable, neon green track với thumb indicator

#### 3. Playback Controls (`playback-controls`)
- **Volume**: Icon loa + slider ngang
- **Transport**: ⏮ Previous | ⏪ Rewind | ⏸ Pause/▶ Play | ⏩ Forward | ⏭ Next
- **Mode**: Repeat (🔁) | Shuffle (🔀)
- **Extra**: Add to playlist (+) | More options (⋯)
- **Nút Play/Pause**: Lớn nhất, nổi bật nhất, có border glow

#### 4. Track List (`track-list`)
- **Header**: "DANH SÁCH PHÁT (N BÀI HÁT)" + toggle view icon
- **Columns**: `#` | Bài Hát | Nghệ Sĩ | Album | ⏱ Duration | + (Add)
- **Active track**: Highlighted row với play icon (▶) thay vì số thứ tự
- **Hover**: Background sáng hơn, hiển thị play icon
- **Scrollable**: Custom scrollbar (neon green thin)

#### 5. Search Bar (`search-bar`)
- **Input**: "Tìm bài hát hoặc ca sĩ..." placeholder
- **Icon trái**: 🔍
- **Icons phải**: Equalizer icon, Grid/List view toggle
- **Vị trí**: Fixed ở bottom, full width của content area

---

## ⚙️ Core Features & Logic

### Audio Player (`player.js`)

```javascript
// Core Player State
const playerState = {
  currentTrack: null,       // Track object đang phát
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,             // 0 - 1
  isMuted: false,
  repeatMode: 'none',      // 'none' | 'one' | 'all'
  isShuffled: false,
  playbackRate: 1.0
};
```

**Chức năng chính:**
- Play / Pause / Stop
- Next / Previous track
- Seek (kéo progress bar)
- Volume control + Mute toggle
- Repeat modes: None → Repeat All → Repeat One
- Shuffle: Fisher-Yates shuffle algorithm
- Auto-play next track khi hết bài
- Preload bài tiếp theo (performance)

### Audio Streaming

- Sử dụng HTML5 `<audio>` element với `preload="metadata"`
- Stream từ file local trong thư mục `music/tracks/`
- Hỗ trợ format: `.mp3` (chính), `.ogg` (fallback), `.wav`
- Xử lý buffering states: loading, canplay, canplaythrough
- Error handling: file not found, decode error, network error

### Audio Visualizer (`visualizer.js`)

- Sử dụng **Web Audio API**: `AudioContext` → `AnalyserNode`
- **Waveform display**: Vẽ trên `<canvas>` element
- **FFT size**: 256 hoặc 512
- **Style**: Thanh dọc (bars) hoặc sóng (wave), màu neon xanh
- **Animation**: `requestAnimationFrame` loop khi đang phát
- **Pause**: Freeze waveform khi pause, clear khi stop

### Playlist Management (`playlist.js`)

- Load playlists từ `data/playlists.json`
- CRUD playlist (tạo, đọc, sửa, xóa) — lưu vào LocalStorage
- Add/remove tracks từ playlist
- Drag & drop reorder (optional, nâng cao)
- "Yêu Thích" là playlist đặc biệt (toggle heart icon)

### Search & Filter (`search.js`)

- Tìm kiếm real-time (debounce 300ms)
- Search theo: tên bài hát, nghệ sĩ, album
- Highlight kết quả match
- Filter theo genre, năm (nâng cao)

### State Persistence (`storage.js`)

- **LocalStorage keys:**
  - `htgo_currentTrack` — bài đang phát (id)
  - `htgo_currentTime` — vị trí đang phát
  - `htgo_volume` — mức âm lượng
  - `htgo_repeatMode` — chế độ lặp
  - `htgo_shuffle` — shuffle on/off
  - `htgo_playlists` — custom playlists
  - `htgo_favorites` — danh sách yêu thích
  - `htgo_recentlyPlayed` — bài đã nghe gần đây

---

## 🎹 Keyboard Shortcuts

| Phím            | Chức năng             |
| --------------- | --------------------- |
| `Space`         | Play / Pause          |
| `→` Arrow Right | Seek forward 5s       |
| `←` Arrow Left  | Seek backward 5s      |
| `↑` Arrow Up    | Tăng volume           |
| `↓` Arrow Down  | Giảm volume           |
| `N`             | Next track            |
| `P`             | Previous track        |
| `M`             | Mute / Unmute         |
| `R`             | Toggle repeat mode    |
| `S`             | Toggle shuffle        |
| `F` hoặc `/`   | Focus search bar      |
| `Escape`        | Blur search / close   |

---

## 📋 Quy Tắc Code

### HTML
- Semantic HTML5: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`
- Mỗi element tương tác phải có `id` duy nhất và mô tả
- Sử dụng `data-*` attributes để bind data (track-id, playlist-id)
- Accessibility: `aria-label`, `role`, `tabindex` cho keyboard navigation
- SEO: Proper `<title>`, `<meta description>`, heading hierarchy

### CSS
- **Vanilla CSS** — KHÔNG dùng Tailwind, SCSS, hay preprocessor
- CSS Custom Properties (variables) cho toàn bộ design tokens
- Mobile-first responsive (nhưng ưu tiên desktop experience)
- BEM-like naming: `.sidebar__nav-item`, `.player__control-btn`
- Tách file CSS theo component (xem cấu trúc thư mục)
- Animations: Prefer CSS transitions/animations, dùng JS chỉ khi cần thiết
- `@media` breakpoints:
  - Desktop: `>= 1024px` (main target)
  - Tablet: `768px — 1023px`
  - Mobile: `< 768px`

### JavaScript
- **Vanilla JS** — KHÔNG dùng React, Vue, hay framework
- ES6+ modules (`import`/`export`)
- Event delegation cho track list (performance)
- `requestAnimationFrame` cho animations
- Debounce/throttle cho search input và resize events
- Error boundaries: try/catch cho Audio API calls
- Console logging chỉ ở development mode

### Ngôn Ngữ UI
- Giao diện hiển thị bằng **tiếng Việt**
- Code comments bằng **tiếng Anh**
- Variable/function names bằng **tiếng Anh**

---

## 🚀 Hướng Dẫn Chạy

```bash
# Cách 1: VS Code Live Server
# Cài extension "Live Server", click "Go Live" trên status bar

# Cách 2: npx serve
npx -y serve .

# Cách 3: Python HTTP Server
python -m http.server 8080

# Cách 4: Node.js live-server
npx -y live-server --port=8080
```

Truy cập: `http://localhost:8080`

---

## 🔧 Lưu Ý Kỹ Thuật

### Audio Streaming
- File nhạc phải nằm trong `music/tracks/` và được khai báo trong `music/metadata.json`
- Browser yêu cầu user interaction trước khi play audio (autoplay policy)
- Xử lý CORS nếu serve từ domain khác
- Lazy load metadata, không load tất cả file nhạc cùng lúc

### Performance
- Virtual scrolling cho track list nếu > 500 bài (optional)
- Debounce search input (300ms)
- Throttle waveform render (~30fps thay vì 60fps)
- Sử dụng `will-change` CSS cho animated elements
- Preload ảnh cover bài tiếp theo

### Browser Support
- Target: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- Web Audio API: Tất cả modern browsers
- CSS Custom Properties: Tất cả modern browsers
- ES6 Modules: Tất cả modern browsers

---

## 📝 Quy Trình Phát Triển

### Thứ Tự Build

1. **Phase 1 — Foundation**: `index.html` + `index.css` (design tokens, reset, layout grid)
2. **Phase 2 — Static UI**: Sidebar + Now Playing + Track List (HTML/CSS only, mock data)
3. **Phase 3 — Audio Core**: `player.js` — play/pause/seek/volume với 1 bài test
4. **Phase 4 — Playlist**: Load metadata.json, render track list, chọn bài
5. **Phase 5 — Visualizer**: Waveform canvas với Web Audio API
6. **Phase 6 — Features**: Search, repeat, shuffle, favorites
7. **Phase 7 — Polish**: Animations, keyboard shortcuts, responsive, LocalStorage

### Mỗi Phase Phải Đảm Bảo
- [ ] UI render đúng theo design reference
- [ ] Không có console errors
- [ ] Responsive ở desktop (ít nhất)
- [ ] Keyboard accessible
- [ ] Code clean, có comments

---

## 🖼️ Design Reference

Design theo phong cách **Arcade Music Terminal**:
- Tông màu: Đen tuyệt đối + Neon xanh lá (#00ff41)
- Font: Monospace (Share Tech Mono / Fira Code)
- Hiệu ứng: Neon glow, CRT scanlines (subtle), cassette tape spinning
- Vibe: Retro gaming terminal, hacker aesthetic, cyberpunk
- Tham khảo: Old-school arcade cabinets, VT100 terminals, Matrix rain effect
