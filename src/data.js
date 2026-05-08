// Mock track data for the music player
export const tracks = [
  {
    id: '846',
    title: 'Đôi Mắt',
    artist: 'Wanbi Tuấn Anh',
    album: 'Đôi Mắt - Single',
    duration: 289,
    genre: 'V-Pop'
  },
  {
    id: '847',
    title: 'Cho Bạn Cho Tôi',
    artist: 'Lam Trường',
    album: 'Tình Thôi Xót Xa',
    duration: 275,
    genre: 'V-Pop'
  },
  {
    id: '848',
    title: 'Em Thì Khóc Tôi Thì Đau',
    artist: 'Akira Phan',
    album: 'Vết Thương Trái Tim',
    duration: 301,
    genre: 'V-Pop'
  },
  {
    id: '849',
    title: 'Ngày Mất Em',
    artist: 'Khánh Trung',
    album: 'Ngày Mất Em',
    duration: 282,
    genre: 'V-Pop'
  },
  {
    id: '850',
    title: 'Tuyệt Yêu Thương',
    artist: 'Young Uno',
    album: 'Tuyệt Yêu Thương - Single',
    duration: 268,
    genre: 'V-Pop'
  },
  {
    id: '851',
    title: 'Nhiều Lúc Như Đôi Khi',
    artist: 'Phạm Trưởng',
    album: 'Nhiều Lúc Như Đôi Khi',
    duration: 259,
    genre: 'V-Pop'
  },
  {
    id: '852',
    title: 'Café Đắng Và Mưa',
    artist: 'Thanh Ngọc',
    album: 'Café Đắng Và Mưa - Single',
    duration: 273,
    genre: 'V-Pop'
  },
  {
    id: '853',
    title: 'Hứa Thật Nhiều Thất Hứa Thật Nhiều',
    artist: 'Ưng Hoàng Phúc',
    album: 'Hứa Thật Nhiều Thất Hứa Thật Nhiều',
    duration: 293,
    genre: 'V-Pop'
  },
  {
    id: '854',
    title: 'Tình Yêu Màu Nắng',
    artist: 'Đoàn Thúy Trang ft BigDaddy',
    album: 'Tình Yêu Màu Nắng - Single',
    duration: 245,
    genre: 'V-Pop'
  },
  {
    id: '855',
    title: 'Người Ấy',
    artist: 'Trịnh Thăng Bình',
    album: 'Người Ấy - Single',
    duration: 310,
    genre: 'V-Pop'
  },
  {
    id: '856',
    title: 'Anh Nhớ Em Nhiều',
    artist: 'Hoài Lâm',
    album: 'Anh Nhớ Em Nhiều',
    duration: 265,
    genre: 'V-Pop'
  },
  {
    id: '857',
    title: 'Yêu Là Tha Thu',
    artist: 'Only C ft Karik',
    album: 'Yêu Là Tha Thu - Single',
    duration: 278,
    genre: 'V-Pop'
  }
];

export const playlists = [
  { id: 'nhac-tre-8x9x', name: 'Nhạc Trẻ 8x9x', icon: '🎵' },
  { id: 'lofi-chill', name: 'Lo-fi Chill', icon: '🎵' },
  { id: 'game-nostalgia', name: 'Game Nostalgia', icon: '🎵' },
  { id: 'karaoke-hits', name: 'Karaoke Hits', icon: '🎵' },
  { id: 'chill-cung-dem', name: 'Chill Cùng Đêm', icon: '🎵' },
  { id: 'rap-viet-hot', name: 'Rap Việt Hot', icon: '🎵' },
  { id: 'acoustic-cover', name: 'Acoustic Cover', icon: '🎵' },
];

export const navItems = [
  { id: 'home', label: 'TRANG CHỦ', icon: 'home', active: true },
  { id: 'explore', label: 'KHÁM PHÁ', icon: 'explore' },
  { id: 'library', label: 'THƯ VIỆN', icon: 'library' },
  { id: 'radio', label: 'RADIO', icon: 'radio' },
  { id: 'favorites', label: 'YÊU THÍCH', icon: 'favorites' },
  { id: 'playlist', label: 'PLAYLIST', icon: 'playlist' },
];

// Format seconds to mm:ss
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
