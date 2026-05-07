import { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, ShoppingCart, Swords, Search, ChevronDown, ChevronUp, 
  MapPin, CheckCircle2, Circle, ArrowLeft, BarChart3, 
  ExternalLink, Globe, Library, Database, Box, Map, Clock, 
  Fish, Banknote, Shirt, Gamepad2, Hammer, Sparkles, Copy, Download, Upload
} from 'lucide-react';
import './App.css'

// Helper to generate a stable list of all coordinate IDs
const getAllCoordKeys = () => {
  const keys: string[] = [];
  aetherData.forEach(exp => {
    exp.zones.forEach(zone => {
      zone.coords.forEach(coord => {
        keys.push(`${exp.id}-${zone.zone}-${coord}`);
      });
    });
  });
  return keys;
};

// Simple bitmask-based sync code logic
const encodeProgress = (checkedSet: Set<string>): string => {
  const allKeys = getAllCoordKeys();
  let binary = "";
  allKeys.forEach(key => {
    binary += checkedSet.has(key) ? "1" : "0";
  });
  // Pad to multiple of 8
  while (binary.length % 8 !== 0) binary += "0";
  
  const bytes = [];
  for (let i = 0; i < binary.length; i += 8) {
    bytes.push(parseInt(binary.substr(i, 8), 2));
  }
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const decodeProgress = (code: string): Set<string> => {
  try {
    const base64 = code.replace(/-/g, '+').replace(/_/g, '/');
    const binaryStr = atob(base64);
    let binary = "";
    for (let i = 0; i < binaryStr.length; i++) {
      binary += binaryStr.charCodeAt(i).toString(2).padStart(8, '0');
    }
    
    const allKeys = getAllCoordKeys();
    const newSet = new Set<string>();
    allKeys.forEach((key, idx) => {
      if (binary[idx] === "1") newSet.add(key);
    });
    return newSet;
  } catch (e) {
    console.error("Failed to decode sync code", e);
    return new Set();
  }
};

const linkCategories = [
  {
    id: "wiki", title: "百科", icon: <BookOpen size={22} className="icon-gold" />,
    links: [
      { name: "灰機 Wiki", url: "https://ff14.huijiwiki.com/", desc: "最全資料庫", icon: <Library size={24} className="icon-gold" /> },
      { name: "物品搜尋", url: "https://ff14.huijiwiki.com/wiki/ItemSearch", desc: "快速查找", icon: <Search size={24} className="icon-gold" /> },
      { name: "Garland", url: "https://www.garlandtools.org/", desc: "物品資料庫", icon: <Database size={24} className="icon-gold" /> },
      { name: "工具箱", url: "https://ff14.tw/", desc: "在地化工具", icon: <Box size={24} className="icon-gold" /> },
      { name: "藏寶圖", url: "https://cycleapple.github.io/xiv-tc-treasure-finder/", desc: "座標對比", icon: <Map size={24} className="icon-gold" /> },
    ]
  },
  {
    id: "life", title: "生活", icon: <ShoppingCart size={22} className="icon-gold" />,
    links: [
      { name: "採集時鐘", url: "https://caiji.ffxiv.cn/", desc: "節點提醒", icon: <Clock size={24} className="icon-gold" /> },
      { name: "魚糕", url: "https://ff14fish.com/", desc: "釣魚工具", icon: <Fish size={24} className="icon-gold" /> },
      { name: "Universalis", url: "https://universalis.app/", desc: "市場價格", icon: <Banknote size={24} className="icon-gold" /> },
      { name: "Market", url: "https://beherw.github.io/FFXIV_Market/", desc: "交易查看", icon: <ShoppingCart size={24} className="icon-gold" /> },
      { name: "幻化穿搭", url: "https://ffxiv.eorzeacollection.com/", desc: "風格參考", icon: <Shirt size={24} className="icon-gold" /> },
    ]
  },
  {
    id: "battle", title: "戰鬥", icon: <Swords size={22} className="icon-gold" />,
    links: [
      { name: "機制模擬", url: "https://www.xivsim.com/", desc: "副本練習", icon: <Gamepad2 size={24} className="icon-gold" /> },
      { name: "Teamcraft", url: "https://ffxivteamcraft.com/", desc: "製作清單", icon: <Hammer size={24} className="icon-gold" /> },
      { name: "青魔技能", url: "https://thewakingsands.github.io/blue-mage/", desc: "獲取途徑", icon: <Sparkles size={24} className="icon-gold" /> },
    ]
  }
];

const aetherData = [
  {
    expansion: "7.0 黃金的遺產", id: "7.0",
    zones: [
      { id: "z7-1", zone: "奧羅帕尼山 (Urqopacha)", coords: ["(X: 28.5, Y: 16.7)", "(X: 12.3, Y: 11.6)", "(X: 18.7, Y: 9.8)", "(X: 17.4, Y: 17.5)", "(X: 29.7, Y: 7.8)", "(X: 29.4, Y: 26.7) - 山上", "(X: 28.8, Y: 21.3) - 山上", "(X: 17.5, Y: 20.3) - 山上", "(X: 5.2, Y: 23.5)", "(X: 22.8, Y: 36.4) - 遠"] },
      { id: "z7-2", zone: "克扎爾烏卡濕地 (Kozama'uka)", coords: ["(X: 27.4, Y: 7.7)", "(X: 31.8, Y: 14.5)", "(X: 39.8, Y: 13.3)", "(X: 9.4, Y: 17.8)", "(X: 8.7, Y: 11.7)", "(X: 22.4, Y: 27.2)", "(X: 24.0, Y: 31.9)", "(X: 15.6, Y: 34.2)", "(X: 6.2, Y: 23.9)", "(X: 31.2, Y: 38.7) - 難找"] },
      { id: "z7-3", zone: "亞克特爾樹海 (Yak T'el)", coords: ["(X: 19.1, Y: 10.9)", "(X: 10.4, Y: 18.7)", "(X: 17.7, Y: 6.4)", "(X: 29.8, Y: 10.5)", "(X: 36.4, Y: 35.7) - 地下湖邊", "(X: 33.6, Y: 26.1) - 山頂", "(X: 19.1, Y: 33.9)", "(X: 7.9, Y: 26.2)", "(X: 22.2, Y: 21.4) - 遠", "(X: 25.5, Y: 24.7) - 稍遠"] },
      { id: "z7-4", zone: "夏勞尼荒野 (Shaaloani)", coords: ["(X: 27.3, Y: 31.5)", "(X: 17.6, Y: 20.4)", "(X: 20.2, Y: 17.9)", "(X: 25.1, Y: 20.2)", "(X: 9.4, Y: 14.4)", "(X: 7.2, Y: 19.8)", "(X: 9.0, Y: 27.9) - 峽谷深處(遠)", "(X: 29.0, Y: 11.3)", "(X: 34.6, Y: 23.1)", "(X: 34.4, Y: 13.0)"] },
      { id: "z7-5", zone: "遺產之地 (Heritage Found)", coords: ["(X: 29.4, Y: 25.9)", "(X: 23.0, Y: 18.5) - 山上", "(X: 35.1, Y: 11.1) - 山上(遠)", "(X: 33.6, Y: 17.6) - 山上", "(X: 25.5, Y: 7.9) - 洞裡(遠)", "(X: 9.7, Y: 12.0)", "(X: 9.4, Y: 26.8)", "(X: 20.9, Y: 28.1) - 山上", "(X: 12.3, Y: 35.3) - 稍遠", "(X: 15.7, Y: 16.1) - 山上(遠)"] },
      { id: "z7-6", zone: "活著的記憶 (Living Memory)", coords: ["(X: 7.4, Y: 30.9)", "(X: 11.1, Y: 35.0)", "(X: 36.5, Y: 28.4) - 稍遠", "(X: 34.0, Y: 34.2) - 摩天輪中間", "(X: 26.1, Y: 32.3) - 塔狀建築下", "(X: 24.8, Y: 15.3) - 競技場邊緣下", "(X: 11.7, Y: 20.4)", "(X: 10.2, Y: 11.3)", "(X: 27.7, Y: 10.6) - 遠", "(X: 31.6, Y: 8.4) - 遠"] }
    ]
  },
  {
    expansion: "6.0 曉月之終途", id: "6.0",
    zones: [
      { id: "z6-1", zone: "迷津 (Labyrinthos)", coords: ["(X: 28.4, Y: 6.1, Z: 4.3)", "(X: 36.3, Y: 22.6, Z: 3.3)", "(X: 10.5, Y: 34.7, Z: 2.0)", "(X: 18.9, Y: 35.0, Z: 2.0)"] },
      { id: "z6-2", zone: "薩維奈島 (Thavnair)", coords: ["(X: 18.0, Y: 32.2, Z: 0.2)", "(X: 20.0, Y: 7.3, Z: 0.9)", "(X: 23.8, Y: 14.6, Z: 0.0)", "(X: 32.4, Y: 14.6, Z: 0.0)"] },
      { id: "z6-3", zone: "加雷馬 (Garlemald)", coords: ["(X: 17.8, Y: 29.9, Z: 0.5)", "(X: 25.5, Y: 33.9, Z: 0.0)", "(X: 29.1, Y: 11.8, Z: 0.4)", "(X: 9.3, Y: 14.9, Z: 0.0)"] },
      { id: "z6-4", zone: "嘆息海 (Mare Lamentorum)", coords: ["(X: 22.3, Y: 18.1, Z: 1.2)", "(X: 11.8, Y: 9.5, Z: -1.6)", "(X: 27.8, Y: 9.7, Z: -1.6)", "(X: 2.1, Y: 0.0)"] },
      { id: "z6-5", zone: "厄爾庇斯 (Elpis)", coords: ["(X: 34.0, Y: 23.7, Z: 1.6)", "(X: 6.4, Y: 29.7, Z: 1.2)", "(X: 13.3, Y: 7.6, Z: 4.8)", "(X: 16.3, Y: 11.8, Z: 3.0)"] },
      { id: "z6-6", zone: "天外天垓 (Ultima Thule)", coords: ["(X: 14.7, Y: 14.2, Z: 2.2)", "(X: 21.5, Y: 6.2, Z: 2.3)", "(X: 34.5, Y: 29.5, Z: 3.9)", "(X: 32.2, Y: 26.2, Z: 3.9)"] }
    ]
  }
];

function Home() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["wiki", "life", "battle"]));
  const toggleCategory = (id: string) => {
    const n = new Set(openIds);
    n.has(id) ? n.delete(id) : n.add(id);
    setOpenIds(n);
  };

  return (
    <div className="page-container fade-in">
      <header className="header">
        <div className="header-logo"><Search size={32} className="icon-gold animate-glow" /></div>
        <h1>FFXIV 快速導航儀表板</h1>
        <p className="subtitle">艾歐澤亞的光之戰士專用工具箱</p>
      </header>

      <div className="main-cta-group">
        <Link to="/aether" className="cta-button highlight-btn"><Globe size={24} /><span>風脈泉追蹤</span></Link>
      </div>

      <div className="horizontal-container">
        {linkCategories.map((cat) => (
          <div key={cat.id} className={`column-item ${openIds.has(cat.id) ? 'active' : ''}`}>
            <button className="column-header" onClick={() => toggleCategory(cat.id)}>
              <div className="header-left"><span className="icon-wrapper">{cat.icon}</span><span className="category-name">{cat.title}</span></div>
              {openIds.has(cat.id) ? <ChevronUp size={18} className="icon-gold" /> : <ChevronDown size={18} />}
            </button>
            <div className="column-content">
              <div className="links-list">
                {cat.links.map((link, lIdx) => (
                  <a key={lIdx} href={link.url} target="_blank" rel="noopener noreferrer" className="nav-button-rich">
                    <div className="link-icon-box">{link.icon}</div>
                    <div className="button-content"><span className="button-name">{link.name}</span><span className="button-desc">{link.desc}</span></div>
                    <ExternalLink size={14} className="ext-icon" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AetherTracker() {
  const [checkedCoords, setCheckedCoords] = useState<Set<string>>(new Set());
  const [activeExpId, setActiveExpId] = useState("7.0");
  const [activeZoneId, setActiveZoneId] = useState("z7-1");
  const navigate = useNavigate();
  const location = useLocation();

  // Load from localStorage and URL
  useEffect(() => {
    const saved = localStorage.getItem('ff14-aether-progress');
    let initialSet = new Set<string>();
    if (saved) initialSet = new Set(JSON.parse(saved));

    const params = new URLSearchParams(location.search);
    const urlSync = params.get('sync');
    if (urlSync) {
      const decoded = decodeProgress(urlSync);
      if (decoded.size > 0) {
        initialSet = new Set([...Array.from(initialSet), ...Array.from(decoded)]);
        // Clean URL
        navigate(location.pathname, { replace: true });
      }
    }
    
    setCheckedCoords(initialSet);
  }, []);

  const toggleCoord = (coordId: string) => {
    const newChecked = new Set(checkedCoords);
    newChecked.has(coordId) ? newChecked.delete(coordId) : newChecked.add(coordId);
    setCheckedCoords(newChecked);
    localStorage.setItem('ff14-aether-progress', JSON.stringify(Array.from(newChecked)));
  };

  const activeExp = aetherData.find(e => e.id === activeExpId);
  const activeZone = activeExp?.zones.find(z => z.id === activeZoneId);

  const markAllInZone = () => {
    if (!activeZone) return;
    const newChecked = new Set(checkedCoords);
    activeZone.coords.forEach(coord => {
      newChecked.add(`${activeExpId}-${activeZone.zone}-${coord}`);
    });
    setCheckedCoords(newChecked);
    localStorage.setItem('ff14-aether-progress', JSON.stringify(Array.from(newChecked)));
  };

  const resetZone = () => {
    if (!activeZone) return;
    const newChecked = new Set(checkedCoords);
    activeZone.coords.forEach(coord => {
      newChecked.delete(`${activeExpId}-${activeZone.zone}-${coord}`);
    });
    setCheckedCoords(newChecked);
    localStorage.setItem('ff14-aether-progress', JSON.stringify(Array.from(newChecked)));
  };

  useEffect(() => {
    if (activeExp) {
      setActiveZoneId(activeExp.zones[0].id);
    }
  }, [activeExpId]);

  const totalCoords = useMemo(() => aetherData.reduce((sum, exp) => sum + exp.zones.reduce((zSum, zone) => zSum + zone.coords.length, 0), 0), []);
  const progressPercent = Math.round((checkedCoords.size / totalCoords) * 100);

  const handleExport = () => {
    const code = encodeProgress(checkedCoords);
    navigator.clipboard.writeText(code);
    alert("同步代碼已複製到剪貼簿！");
  };

  const handleImport = () => {
    const input = prompt("請貼入同步代碼：");
    if (input) {
      const decoded = decodeProgress(input.trim());
      if (decoded.size > 0) {
        if (confirm(`成功解析到 ${decoded.size} 個進度，是否覆蓋目前進度？`)) {
          setCheckedCoords(decoded);
          localStorage.setItem('ff14-aether-progress', JSON.stringify(Array.from(decoded)));
        }
      } else {
        alert("代碼無效或格式錯誤。");
      }
    }
  };

  const handleCopyLink = () => {
    const code = encodeProgress(checkedCoords);
    const url = `${window.location.origin}${window.location.pathname}#/aether?sync=${code}`;
    navigator.clipboard.writeText(url);
    alert("帶有進度的分享連結已複製！");
  };

  return (
    <div className="page-container aether-page fade-in">
      <nav className="top-nav">
        <button onClick={() => navigate('/')} className="back-link"><ArrowLeft size={18} /> 返回儀表板</button>
        <div className="exp-tabs">
          {aetherData.map(exp => (
            <button key={exp.id} className={`exp-tab ${activeExpId === exp.id ? 'active' : ''}`} onClick={() => setActiveExpId(exp.id)}>{exp.expansion}</button>
          ))}
        </div>
        <div className="sync-group">
          <button className="sync-btn" title="導出同步碼" onClick={handleExport}><Download size={18} /></button>
          <button className="sync-btn" title="導入同步碼" onClick={handleImport}><Upload size={18} /></button>
          <button className="sync-btn" title="複製分享連結" onClick={handleCopyLink}><Copy size={18} /></button>
        </div>
        <div className="progress-mini"><BarChart3 size={16} className="icon-gold" /><span>進度 {progressPercent}%</span></div>
      </nav>

      <div className="tracker-layout-horizontal">
        <aside className="zone-sidebar">
          {activeExp?.zones.map(zone => (
            <button key={zone.id} className={`zone-menu-item ${activeZoneId === zone.id ? 'active' : ''}`} onClick={() => setActiveZoneId(zone.id)}>
              <MapPin size={16} className={activeZoneId === zone.id ? "icon-gold" : ""} /><span>{zone.zone.split(' (')[0]}</span>
            </button>
          ))}
        </aside>

        <main className="coord-display-area">
          {activeZone && (
            <>
              <header className="coord-header">
                <h2>{activeZone.zone}</h2>
                <div className="coord-actions">
                  <button className="mini-btn" onClick={markAllInZone}>本區全選</button>
                  <button className="mini-btn reset" onClick={resetZone}>重置本區</button>
                  <div className="coord-stats">已收集: {activeZone.coords.filter(c => checkedCoords.has(`${activeExpId}-${activeZone.zone}-${c}`)).length} / {activeZone.coords.length}</div>
                </div>
              </header>
              <div className="coords-grid-wide">
                {activeZone.coords.map((coord, idx) => {
                  const id = `${activeExpId}-${activeZone.zone}-${coord}`;
                  const isChecked = checkedCoords.has(id);
                  return (
                    <div key={idx} className={`coord-card-wide ${isChecked ? 'checked' : ''}`} onClick={() => toggleCoord(id)}>
                      <div className="coord-checkbox">{isChecked ? <CheckCircle2 size={24} className="icon-gold" /> : <Circle size={24} className="icon-dim" />}</div>
                      <div className="coord-info"><span className="coord-label">風脈泉 #{idx + 1}</span><span className="coord-value">{coord}</span></div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aether" element={<AetherTracker />} />
      </Routes>
    </Router>
  );
}

export default App
