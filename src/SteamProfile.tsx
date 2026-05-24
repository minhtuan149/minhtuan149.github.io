// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Search, Key, User, Gamepad2, Clock, AlertCircle, BarChart3, Info, X, Trophy, Calendar, Sparkles, Bot, RefreshCw } from 'lucide-react';

const App = () => {
  // Gắn mặc định Steam API Key
  const [apiKey, setApiKey] = useState('8BB16CA07B0FEAD7B40F02622A3B9905');
  const [profileUrl, setProfileUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [steamId, setSteamId] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('playtime'); // 'playtime', 'name'

  // States cho Modal chi tiết game & Thành tựu
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameDetails, setGameDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  // States cho tính năng AI
  const [aiProfileSummary, setAiProfileSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiError, setAiError] = useState('');
  const [achievementTips, setAchievementTips] = useState({});
  const [loadingTips, setLoadingTips] = useState({});

  // Sử dụng danh sách proxy dự phòng để tránh lỗi "Failed to fetch" khi một proxy bị sập/quá tải
  const fetchWithProxy = async (url) => {
    const proxies = [
      'https://corsproxy.io/?',
      'https://api.allorigins.win/raw?url=',
      'https://api.codetabs.com/v1/proxy?quest='
    ];

    let lastError;

    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(`${proxyUrl}${encodeURIComponent(url)}`);
        if (!response.ok) {
          // Nếu API của Steam trả về lỗi (ví dụ 404), proxy cũng sẽ trả về lỗi
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.warn(`Proxy ${proxyUrl} thất bại:`, error.message);
        lastError = error;
        // Gặp lỗi mạng (Failed to fetch) thì sẽ tiếp tục vòng lặp để thử proxy tiếp theo
      }
    }
    
    // Nếu tất cả các proxy đều lỗi, mới báo ra màn hình
    throw new Error('Tất cả các máy chủ Proxy trung chuyển đều đang bận hoặc lỗi mạng. Vui lòng thử lại sau ít phút.');
  };

  // Hàm gọi API Gemini với cơ chế thử lại (Exponential Backoff)
  const callGemini = async (prompt) => {
    const geminiApiKey = ""; // Môi trường sẽ tự động cung cấp key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiApiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];

    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
      } catch (err) {
        if (i === maxRetries) throw err;
        await new Promise(r => setTimeout(r, delays[i]));
      }
    }
  };

  // Tính năng 1: Phân tích Profile
  const handleGenerateSummary = async () => {
    if (!games.length || !profile) return;
    setIsGeneratingSummary(true);
    setAiError('');
    
    // Tính tổng giờ chơi để gửi cho AI
    const totalMinutes = games.reduce((total, game) => total + game.playtime_forever, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    // Lấy top 10 game chơi nhiều nhất
    const topGames = [...games].sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 10);
    const gamesListText = topGames.map(g => `- ${g.name}: ${(g.playtime_forever / 60).toFixed(1)} giờ`).join('\n');
    
    const prompt = `Bạn là một AI chuyên gia về game. Hãy phân tích hồ sơ Steam của người chơi tên "${profile.personaname}".\n\nTổng giờ chơi: ${totalHours} giờ.\nTop game chơi nhiều nhất:\n${gamesListText}\n\nYêu cầu:\n1. Viết 1 đoạn ngắn (3-4 câu) nhận xét vui nhộn, hài hước về phong cách chơi game của họ. Có thể "roast" (chọc ghẹo) nhẹ nhàng nếu họ dành quá nhiều thanh xuân cho 1 tựa game.\n2. Gợi ý 1 tựa game Steam khác phù hợp với sở thích của họ và giải thích ngắn gọn tại sao.\n\nTrả về kết quả bằng văn bản thuần túy (không dùng markdown in đậm/nghiêng phức tạp, chỉ cần xuống dòng). BẮT BUỘC PHẢI TRẢ LỜI BẰNG TIẾNG VIỆT CÓ DẤU HOÀN CHỈNH VÀ CHUẨN XÁC.`;

    try {
      const response = await callGemini(prompt);
      setAiProfileSummary(response);
    } catch (error) {
      setAiError('Lỗi kết nối AI. Vui lòng thử lại sau.');
      console.error(error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Tính năng 2: Xin mẹo Thành tựu
  const handleGetAchievementTip = async (achievement) => {
    setLoadingTips(prev => ({ ...prev, [achievement.name]: true }));
    
    const prompt = `Trong tựa game "${selectedGame.name}", làm cách nào để mở khóa thành tựu "${achievement.displayName}" (Mô tả: ${achievement.description || 'Không có mô tả'})? Hãy đưa ra một mẹo hoặc hướng dẫn ngắn gọn, dễ hiểu trong khoảng 2-3 câu. BẮT BUỘC PHẢI TRẢ LỜI BẰNG TIẾNG VIỆT CÓ DẤU HOÀN CHỈNH VÀ CHUẨN XÁC.`;
    
    try {
      const response = await callGemini(prompt);
      setAchievementTips(prev => ({ ...prev, [achievement.name]: response }));
    } catch (error) {
      setAchievementTips(prev => ({ ...prev, [achievement.name]: 'Không thể lấy mẹo lúc này. Hãy thử lại sau.' }));
    } finally {
      setLoadingTips(prev => ({ ...prev, [achievement.name]: false }));
    }
  };

  const handleFetchData = async (e) => {
    e.preventDefault();
    if (!apiKey.trim() || !profileUrl.trim()) {
      setError('Vui lòng nhập đầy đủ API Key và URL Profile.');
      return;
    }

    setLoading(true);
    setError('');
    setProfile(null);
    setGames([]);
    setAiProfileSummary('');
    setAiError('');

    try {
      let steamId = '';
      const cleanUrl = profileUrl.trim().replace(/\/$/, '');

      // 1. Phân tích URL để lấy SteamID64 hoặc VanityURL
      if (cleanUrl.includes('/profiles/')) {
        steamId = cleanUrl.split('/profiles/')[1];
      } else if (cleanUrl.includes('/id/')) {
        const vanityName = cleanUrl.split('/id/')[1];
        // Gọi API để giải mã VanityURL thành SteamID64
        const resolveUrl = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${vanityName}`;
        const resolveData = await fetchWithProxy(resolveUrl);
        
        if (resolveData.response && resolveData.response.success === 1) {
          steamId = resolveData.response.steamid;
        } else {
          throw new Error('Không thể tìm thấy SteamID từ URL tùy chỉnh này. Vui lòng kiểm tra lại URL.');
        }
      } else {
        throw new Error('Định dạng URL Profile không hợp lệ. Vui lòng sử dụng link có chứa /id/ hoặc /profiles/.');
      }

      // 2. Lấy thông tin tóm tắt của người chơi
      const summaryUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
      const summaryData = await fetchWithProxy(summaryUrl);
      
      if (summaryData.response && summaryData.response.players && summaryData.response.players.length > 0) {
        setProfile(summaryData.response.players[0]);
        setSteamId(steamId); // Lưu lại steamId để gọi API thành tựu
      } else {
        throw new Error('Không tìm thấy thông tin profile.');
      }

      // 3. Lấy danh sách game
      const gamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`;
      const gamesData = await fetchWithProxy(gamesUrl);

      if (gamesData.response && gamesData.response.games) {
        setGames(gamesData.response.games);
      } else {
        // Trường hợp API trả về thành công nhưng không có mảng games (thường do Profile Private)
        setGames([]);
        setError('Không tìm thấy danh sách game. Vui lòng đảm bảo "Chi tiết trò chơi" (Game details) trong cài đặt Quyền riêng tư của tài khoản Steam đang được đặt là "Công khai" (Public).');
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng kiểm tra lại API Key và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = async (game) => {
    setSelectedGame(game);
    setDetailsLoading(true);
    setDetailsError('');
    setGameDetails([]);

    try {
      // 1. Lấy schema của game để lấy thông tin thành tựu (tên, icon, mô tả)
      const schemaUrl = `http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${apiKey}&appid=${game.appid}`;
      let schemaData;
      try {
         schemaData = await fetchWithProxy(schemaUrl);
      } catch(e) {
         throw new Error('Trò chơi này không hỗ trợ thống kê thành tựu trên Steam.');
      }

      if (!schemaData.game || !schemaData.game.availableGameStats || !schemaData.game.availableGameStats.achievements) {
        throw new Error('Trò chơi này không có hệ thống thành tựu.');
      }

      // 2. Lấy tiến độ thành tựu của người chơi
      const achUrl = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${game.appid}&key=${apiKey}&steamid=${profile.steamid}`;
      let achData;
      try {
        achData = await fetchWithProxy(achUrl);
      } catch(e) {
         throw new Error('Không thể lấy dữ liệu thành tựu cá nhân. (Do thiết lập riêng tư hoặc bạn chưa từng chơi game này)');
      }

      const schemaAchs = schemaData.game.availableGameStats.achievements;
      const playerAchs = (achData.playerstats && achData.playerstats.success && achData.playerstats.achievements) ? achData.playerstats.achievements : [];

      // Kết hợp dữ liệu
      const combined = schemaAchs.map(sa => {
        const pa = playerAchs.find(p => p.apiname === sa.name);
        return {
          ...sa,
          achieved: pa ? pa.achieved : 0,
          unlocktime: pa ? pa.unlocktime : 0
        };
      });

      // Sắp xếp: Đã đạt được lên đầu, sau đó theo thời gian mới nhất
      combined.sort((a, b) => {
        if (a.achieved !== b.achieved) return b.achieved - a.achieved;
        return b.unlocktime - a.unlocktime;
      });

      setGameDetails(combined);
    } catch (err) {
      setDetailsError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedGame(null);
    setGameDetails([]);
    setAchievementTips({});
    setLoadingTips({});
  };

  // Tính toán thống kê và lọc, sắp xếp game
  const filteredAndSortedGames = useMemo(() => {
    let result = [...games];

    if (searchTerm) {
      result = result.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'playtime') {
        return b.playtime_forever - a.playtime_forever;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [games, searchTerm, sortBy]);

  const totalPlaytimeHours = useMemo(() => {
    const totalMinutes = games.reduce((total, game) => total + game.playtime_forever, 0);
    return (totalMinutes / 60).toFixed(1);
  }, [games]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 font-sans relative overflow-hidden">
      {/* Thêm style CSS tùy chỉnh cho thanh cuộn (Scrollbar) */}
      <style>{`
        /* Thanh cuộn toàn trang (ngoài cùng) */
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #070b14; 
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.6);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.4); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.8);
        }
        
        .custom-scrollbar-modal::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 8px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Ambient Background Lights cho hiệu ứng Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto space-y-10 p-4 md:p-8 relative z-10">
        
        {/* Header */}
        <header className="text-center space-y-3 pt-4">
          <div className="flex justify-center items-center space-x-3 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
            <Gamepad2 size={48} className="animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Steam Profile Stats
            </h1>
          </div>
          <p className="text-slate-400 text-lg font-medium tracking-wide">Khám phá vũ trụ game của bạn</p>
        </header>

        {/* Input Form - Glass 3D */}
        <section className="relative bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] max-w-2xl mx-auto transform transition-all hover:bg-white/[0.04]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent rounded-3xl pointer-events-none"></div>
          <form onSubmit={handleFetchData} className="space-y-6 relative z-10">
            
            {/* Đã ẩn mục nhập API Key */}
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-300 ml-1">
                <User className="w-4 h-4 mr-2 text-emerald-400" /> Steam Profile URL
              </label>
              <input 
                type="text" 
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="VD: https://steamcommunity.com/id/khonghieu/ hoặc /profiles/765611..."
                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-black/50 transition-all placeholder:text-slate-500 shadow-inner"
              />
              <div className="text-xs text-slate-400 ml-1 mt-3 space-y-1.5 bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="flex items-start">
                  <Info className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0 text-emerald-400" />
                  <span><strong>Cách 1 (Trình duyệt):</strong> Vào trang Hồ sơ (Profile) của bạn trên web và copy toàn bộ đường link ở thanh địa chỉ.</span>
                </p>
                <p className="flex items-start">
                  <Info className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0 text-emerald-400" />
                  <span><strong>Cách 2 (App Steam):</strong> Mở trang Hồ sơ &gt; Nhấn chuột phải vào nền trống &gt; Chọn <strong>"Sao chép địa chỉ trang web"</strong> (Copy Page URL) rồi dán vào đây.</span>
                </p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <span className="flex items-center text-lg">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Đang xử lý dữ liệu...
                </span>
              ) : (
                <span className="flex items-center text-lg"><Search className="w-5 h-5 mr-2" /> Phân Tích Dữ Liệu</span>
              )}
            </button>
          </form>
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-400 p-5 rounded-2xl flex items-start max-w-2xl mx-auto shadow-[0_8px_32px_0_rgba(239,68,68,0.15)] animate-in slide-in-from-top-4">
            <AlertCircle className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Dashboard Results */}
        {profile && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* Profile Overview & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Profile Card - Glass 3D */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row lg:flex-col items-center gap-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity animate-pulse"></div>
                  <img 
                    src={profile.avatarfull} 
                    alt={profile.personaname} 
                    className="w-32 h-32 rounded-full border-4 border-slate-900 shadow-2xl relative z-10"
                  />
                </div>
                <div className="text-center md:text-left lg:text-center z-10">
                  <h2 className="text-3xl font-bold text-white truncate max-w-[250px] drop-shadow-md" title={profile.personaname}>
                    {profile.personaname}
                  </h2>
                  <a 
                    href={profile.profileurl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center mt-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors border border-white/5 shadow-sm"
                  >
                    <User className="w-4 h-4 mr-2" /> Xem Profile Steam
                  </a>
                </div>
              </div>

              {/* Stats Cards - Glass 3D */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                  <div className="absolute -right-8 -top-8 text-white/5 group-hover:text-white/10 group-hover:scale-110 transition-all duration-500">
                    <Gamepad2 size={160} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-emerald-400/80 font-semibold mb-2 flex items-center tracking-wider uppercase text-sm">
                      <BarChart3 className="w-5 h-5 mr-2" /> Tổng Số Game
                    </p>
                    <p className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 drop-shadow-sm">
                      {games.length}
                    </p>
                  </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                  <div className="absolute -right-8 -top-8 text-white/5 group-hover:text-white/10 group-hover:scale-110 transition-all duration-500">
                    <Clock size={160} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-cyan-400/80 font-semibold mb-2 flex items-center tracking-wider uppercase text-sm">
                      <Clock className="w-5 h-5 mr-2" /> Tổng Giờ Chơi
                    </p>
                    <p className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 drop-shadow-sm flex items-baseline">
                      {totalPlaytimeHours} <span className="text-2xl text-slate-500 font-medium ml-2">giờ</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Khối AI Phân Tích Hồ Sơ */}
            {games.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(79,70,229,0.15)] relative overflow-hidden transition-all duration-500">
                <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white flex items-center mb-2 drop-shadow-md">
                      <Bot className="w-6 h-6 mr-3 text-indigo-400" /> 
                      Phân Tích AI <Sparkles className="w-5 h-5 ml-2 text-yellow-400 animate-pulse" />
                    </h3>
                    <p className="text-indigo-200/80 text-sm">Để AI phân tích tính cách chơi game của bạn và đưa ra những lời "cà khịa" thú vị.</p>
                  </div>
                  
                  {!isGeneratingSummary && (
                    <button 
                      onClick={handleGenerateSummary}
                      className="whitespace-nowrap px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1 flex items-center"
                    >
                      {aiProfileSummary ? (
                        <><RefreshCw className="w-5 h-5 mr-2" /> Phân Tích Lại</>
                      ) : (
                        <><Sparkles className="w-5 h-5 mr-2" /> ✨ Bắt Đầu Phân Tích</>
                      )}
                    </button>
                  )}
                </div>

                {isGeneratingSummary && (
                  <div className="mt-6 p-6 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-center text-indigo-300">
                    <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                    AI đang "soi" profile của bạn...
                  </div>
                )}

                {aiError && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                    {aiError}
                  </div>
                )}

                {aiProfileSummary && !isGeneratingSummary && (
                  <div className="mt-6 p-6 bg-black/30 rounded-2xl border border-indigo-500/30 text-indigo-50 leading-relaxed whitespace-pre-wrap shadow-inner animate-in fade-in slide-in-from-bottom-4">
                    {aiProfileSummary}
                  </div>
                )}
              </div>
            )}

            {/* Games Section */}
            {games.length > 0 && (
              <div className="space-y-8">
                
                {/* Controls - Glass */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.03] backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm trò chơi..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500 shadow-inner text-sm font-medium"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3 w-full sm:w-auto bg-black/40 border border-white/10 rounded-xl px-4 py-1.5 shadow-inner">
                    <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Sắp xếp:</label>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent border-none py-2 text-sm text-emerald-400 font-semibold focus:outline-none cursor-pointer w-full sm:w-auto appearance-none pr-4"
                    >
                      <option value="playtime" className="bg-slate-900 text-white">Thời gian chơi (Nhiều nhất)</option>
                      <option value="name" className="bg-slate-900 text-white">Tên (A-Z)</option>
                    </select>
                  </div>
                </div>

                {/* Games Grid - Glass Cards */}
                {filteredAndSortedGames.length === 0 ? (
                  <div className="text-center py-16 bg-white/[0.02] backdrop-blur-md rounded-3xl border border-white/5 shadow-inner">
                    <Gamepad2 className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                    <p className="text-lg text-slate-400 font-medium">Không tìm thấy trò chơi nào phù hợp.</p>
                  </div>
                ) : (
                  <div className="max-h-[75vh] overflow-y-auto pr-2 pb-4 custom-scrollbar rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredAndSortedGames.map((game) => (
                        <div 
                          key={game.appid} 
                          onClick={() => handleGameClick(game)}
                          className="bg-slate-800/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col h-full cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)] relative shadow-lg"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 z-10 pointer-events-none"></div>
                          <div className="aspect-[460/215] w-full bg-slate-800/80 relative overflow-hidden flex items-center justify-center">
                            <Gamepad2 className="absolute text-slate-700 w-12 h-12" />
                            <img 
                              src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
                              alt={game.name}
                              onError={(e) => {
                                if (e.target.dataset.fallback !== 'true') {
                                  e.target.dataset.fallback = 'true';
                                  e.target.src = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                                  e.target.className = "w-16 h-16 relative z-10 object-contain drop-shadow-lg opacity-80 group-hover:scale-110 transition-transform duration-700";
                                } else {
                                  e.target.style.display = 'none';
                                }
                              }}
                              className="w-full h-full object-cover relative z-10 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                            />
                          </div>
                          <div className="p-5 flex flex-col flex-grow relative z-20 -mt-6">
                            <h3 className="font-bold text-slate-100 line-clamp-2 leading-snug mb-4 drop-shadow-md text-lg" title={game.name}>
                              {game.name}
                            </h3>
                            <div className="mt-auto flex items-center justify-between text-sm">
                              <span className="text-white font-medium flex items-center bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">
                                <Clock className="w-4 h-4 mr-2 text-emerald-400" />
                                {(game.playtime_forever / 60).toFixed(1)} <span className="text-slate-400 ml-1 text-xs">giờ</span>
                              </span>
                              <a 
                                href={`https://store.steampowered.com/app/${game.appid}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-8 h-8 rounded-full bg-slate-700/50 hover:bg-emerald-500 flex items-center justify-center transition-colors border border-slate-600 group/btn"
                                onClick={(e) => e.stopPropagation()}
                                title="Xem trên cửa hàng Steam"
                              >
                                <Info className="w-4 h-4 text-slate-300 group-hover/btn:text-white" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Chi tiết Game & Thành tựu - Glass 3D */}
        {selectedGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={closeModal}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>
            
            <div 
              className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.1)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="relative h-56 sm:h-72 flex-shrink-0 bg-slate-900 overflow-hidden group flex items-center justify-center">
                <Gamepad2 className="absolute text-slate-800 w-24 h-24" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent z-10"></div>
                <img 
                  src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${selectedGame.appid}/header.jpg`}
                  alt={selectedGame.name}
                  onError={(e) => { e.target.style.display = 'none'; }}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 relative z-0"
                />
                
                <button 
                  onClick={closeModal}
                  className="absolute top-6 right-6 z-20 bg-black/40 hover:bg-red-500 text-white p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all hover:rotate-90 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="absolute bottom-0 left-0 p-8 w-full z-20">
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-tight">{selectedGame.name}</h2>
                  <div className="flex flex-wrap gap-3 text-sm font-medium">
                    <span className="flex items-center bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg text-emerald-300">
                      <Clock className="w-4 h-4 mr-2" />
                      {(selectedGame.playtime_forever / 60).toFixed(1)} giờ chơi
                    </span>
                    {selectedGame.rtime_last_played > 0 && (
                      <span className="flex items-center bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg text-cyan-300">
                        <Calendar className="w-4 h-4 mr-2" />
                        Lần chơi cuối: {new Date(selectedGame.rtime_last_played * 1000).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Body Modal (Thành tựu) */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar-modal">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-md" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-wide">Thành tựu của bạn</h3>
                </div>

                {detailsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-emerald-400">
                    <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
                    <p className="font-medium animate-pulse">Đang đồng bộ dữ liệu thành tựu...</p>
                  </div>
                ) : detailsError ? (
                  <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 p-8 rounded-2xl text-center shadow-inner">
                    <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4 drop-shadow-md" />
                    <p className="text-red-200 font-medium text-lg">{detailsError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {gameDetails.map((ach) => (
                      <div 
                        key={ach.name} 
                        className={`flex gap-5 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                          ach.achieved 
                            ? 'bg-white/[0.05] border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.05)] hover:bg-white/[0.08] hover:border-emerald-400/50 hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)]' 
                            : 'bg-black/20 border-white/5 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 hover:bg-black/30'
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <img 
                            src={ach.achieved ? ach.icon : ach.icongray} 
                            alt={ach.displayName}
                            className="w-16 h-16 rounded-xl shadow-lg relative z-10"
                          />
                          {ach.achieved === 1 && (
                            <div className="absolute inset-0 bg-emerald-400 rounded-xl blur-md opacity-30 z-0"></div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className={`font-bold text-lg leading-tight mb-1 ${ach.achieved ? 'text-emerald-300 drop-shadow-sm' : 'text-slate-400'}`}>
                            {ach.displayName}
                          </h4>
                          {ach.description && (
                            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{ach.description}</p>
                          )}
                          {ach.achieved === 1 && ach.unlocktime > 0 && (
                            <p className="text-xs text-emerald-400/80 mt-2.5 flex items-center font-medium">
                              <Calendar className="w-3.5 h-3.5 mr-1.5" />
                              Đạt được: {new Date(ach.unlocktime * 1000).toLocaleString('vi-VN')}
                            </p>
                          )}

                          {/* Nút hỏi AI mẹo thành tựu cho các thành tựu chưa đạt được */}
                          {ach.achieved === 0 && (
                            <div className="mt-4">
                              {!achievementTips[ach.name] && !loadingTips[ach.name] ? (
                                <button 
                                  onClick={() => handleGetAchievementTip(ach)}
                                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-colors w-max"
                                >
                                  <Sparkles className="w-3.5 h-3.5 mr-1.5" /> ✨ Hỏi AI cách lấy
                                </button>
                              ) : loadingTips[ach.name] ? (
                                <p className="text-xs text-indigo-400 flex items-center animate-pulse">
                                  <div className="w-3 h-3 border border-indigo-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                                  AI đang nghĩ...
                                </p>
                              ) : (
                                <div className="mt-2 p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-xl text-xs text-indigo-100 leading-relaxed relative">
                                  <Sparkles className="w-4 h-4 text-yellow-400 absolute top-3 right-3 opacity-50" />
                                  <span className="font-semibold text-indigo-300 mb-1 block">✨ Gợi ý từ AI:</span>
                                  {achievementTips[ach.name]}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;