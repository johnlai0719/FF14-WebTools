import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, ShoppingCart, Swords, Search, ChevronDown, ChevronUp, 
  MapPin, CheckCircle2, Circle, ArrowLeft, BarChart3, 
  ExternalLink, Globe, Library, Database, Box, Map, Clock, 
  Fish, Banknote, Shirt, Gamepad2, Hammer, Sparkles 
} from 'lucide-react';
import './App.css'

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
      { id: "z7-1", zone: "奧羅帕尼山 (Urqopacha)", coords: ["(X: 28.6, Y: 16.7, Z: 1.1)", "(X: 12.2, Y: 11.5, Z: 1.9)", "(X: 17.9, Y: 20.5, Z: 1.2)", "(X: 17.3, Y: 17.4, Z: 1.5)", "(X: 28.8, Y: 7.8, Z: 0.8)", "(X: 18.7, Y: 9.7, Z: 1.2)", "(X: 29.1, Y: 21.3, Z: 2.8)", "(X: 29.4, Y: 26.6, Z: 3)"] },
      { id: "z7-2", zone: "克扎爾烏卡濕地 (Kozama'uka)", coords: ["(X: 27.3, Y: 7.6, Z: 0)", "(X: 9.8, Y: 17.9, Z: 0)", "(X: 15.5, Y: 34.2, Z: 1.1)", "(X: 8.6, Y: 11.7, Z: 0)", "(X: 39.6, Y: 13.6, Z: 0.1)", "(X: 31.8, Y: 14.5, Z: 1.3)", "(X: 24, Y: 31.9, Z: 1.1)", "(X: 31.3, Y: 38, Z: 1.2)"] },
      { id: "z7-3", zone: "亞克特爾樹海 (Yak T'el)", coords: ["(X: 19.1, Y: 11, Z: 3)", "(X: 29.7, Y: 10.6, Z: 3.1)", "(X: 19.2, Y: 33.8, Z: 0.8)", "(X: 10.2, Y: 18.6, Z: 2.9)", "(X: 17.7, Y: 6.3, Z: 3.2)", "(X: 33.9, Y: 26.2, Z: 1.5)", "(X: 25.4, Y: 24.4, Z: 1)", "(X: 36.3, Y: 35.4, Z: 1.2)"] },
      { id: "z7-4", zone: "夏勞尼荒野 (Shaaloani)", coords: ["(X: 27.3, Y: 31.6, Z: 0.7)", "(X: 7.2, Y: 19.8, Z: 1)", "(X: 20.1, Y: 17.7, Z: 0.9)", "(X: 28.1, Y: 14.3, Z: 1.1)", "(X: 17.6, Y: 20.4, Z: 1.1)", "(X: 8.6, Y: 27.9, Z: 0.6)", "(X: 34, Y: 27.9, Z: 0.8)", "(X: 34.3, Y: 22.9, Z: 0.9)"] },
      { id: "z7-5", zone: "遺產之地 (Heritage Found)", coords: ["(X: 29.4, Y: 26, Z: 1.6)", "(X: 25.6, Y: 8.3, Z: 0.7)", "(X: 9.7, Y: 12.1, Z: 0.3)", "(X: 33.6, Y: 17.6, Z: 1.4)", "(X: 35.2, Y: 11.1, Z: 1.5)", "(X: 15.8, Y: 16.1, Z: 0.5)", "(X: 15.8, Y: 16.1, Z: 0.7)", "(X: 12.5, Y: 35.4, Z: 0)"] },
      { id: "z7-6", zone: "活著的記憶 (Living Memory)", coords: ["(X: 7.6, Y: 30.8, Z: 0.2)", "(X: 36.4, Y: 28.3, Z: 0.6)", "(X: 10.8, Y: 8.3, Z: 0.5)", "(X: 25.9, Y: 32.6, Z: 0.2)", "(X: 33.7, Y: 34.3, Z: 0.2)", "(X: 27.6, Y: 10.5, Z: 0.2)", "(X: 27.6, Y: 10.5, Z: 0.5)", "(X: 12.1, Y: 20.5, Z: 0.5)"] }
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

  useEffect(() => {
    const saved = localStorage.getItem('ff14-aether-progress');
    if (saved) setCheckedCoords(new Set(JSON.parse(saved)));
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

  const totalCoords = aetherData.reduce((sum, exp) => sum + exp.zones.reduce((zSum, zone) => zSum + zone.coords.length, 0), 0);
  const progressPercent = Math.round((checkedCoords.size / totalCoords) * 100);

  return (
    <div className="page-container aether-page fade-in">
      <nav className="top-nav">
        <button onClick={() => navigate('/')} className="back-link"><ArrowLeft size={18} /> 返回儀表板</button>
        <div className="exp-tabs">
          {aetherData.map(exp => (
            <button key={exp.id} className={`exp-tab ${activeExpId === exp.id ? 'active' : ''}`} onClick={() => setActiveExpId(exp.id)}>{exp.expansion}</button>
          ))}
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
