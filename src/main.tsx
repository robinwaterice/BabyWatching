import React, { useState } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { 
  NeutralBaby, Angel, PlayfulAngel, PlayfulImp, Demon, Archdemon, Archangel, ChaosHybrid 
} from './components/EvolutionCharacters';
import { BADGE_DEFS } from './constants/badges';
import { AnimatePresence } from 'motion/react';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const DeviceSimulator = ({ children }: { children: React.ReactNode }) => {
  const [device, setDevice] = useState<DeviceType>('mobile'); // 預設使用手機版
  const [scale, setScale] = React.useState(1);
  const [devHUD, setDevHUD] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      let targetH = 812;
      let targetW = 375;
      if (device === 'tablet') {
        targetH = 1024;
        targetW = 768;
      }
      if (device === 'desktop') {
        setScale(1);
      } else {
        const scaleY = (vh - 60) / targetH;
        const scaleX = (vw - 40) / targetW;
        setScale(Math.min(1, scaleY, scaleX));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [device]);

  if (import.meta.env.PROD) {
    return <>{children}</>;
  }

  const handleDevReset = () => {
    if (window.confirm("確定要將角色等級與狀態重置為 1 級嗎？ (保留其他紀錄)")) {
      localStorage.setItem('babyGameState', JSON.stringify({ level: 1, xp: 0, alignmentScore: 0, currentEvolution: '中立' }));
      window.location.reload();
    }
  };

  const getDeviceStyle = (): React.CSSProperties => {
    switch (device) {
      case 'mobile':
        return { width: '375px', height: '812px', borderRadius: '36px', border: '14px solid #1a1a1a', overflow: 'hidden', transform: `scale(${scale})`, position: 'relative', transformOrigin: 'center center' };
      case 'tablet':
        return { width: '768px', height: '1024px', borderRadius: '24px', border: '14px solid #1a1a1a', overflow: 'hidden', transform: `scale(${scale})`, position: 'relative', transformOrigin: 'center center' };
      case 'desktop':
        return { width: '100%', height: '100%', transform: 'scale(1)', position: 'relative' };
    }
  };

  let babyGender = 'boy';
  let birthday = '';
  try {
    babyGender = localStorage.getItem('babyGender') || 'boy';
    birthday = localStorage.getItem('babyBirthday') || '';
  } catch (e) {
    console.warn("localStorage access is restricted:", e);
  }
  
  const getAgeGroup = () => {
    if (!birthday) return '0to1';
    const bDate = new Date(birthday);
    const now = new Date();
    if (isNaN(bDate.getTime())) return '0to1';
    const months = (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth());
    if (months >= 12 && months < 24) return '1to2';
    if (months >= 24) return '2to5';
    return '0to1';
  };
  const ageGroup = getAgeGroup();

  return (
    <div className={`w-screen h-[100dvh] flex items-center justify-center bg-neutral-900 overflow-hidden relative`}>
      {/* 裝置切換開關 */}
      <div className="fixed top-4 right-4 z-[9999] flex gap-2 bg-black/50 p-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
        <button 
          onClick={() => setDevice('mobile')} 
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${device === 'mobile' ? 'bg-blue-500 text-white shadow-sm' : 'text-neutral-300 hover:bg-white/20'}`}
        >
          📱 手機
        </button>
        <button 
          onClick={() => setDevice('tablet')} 
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${device === 'tablet' ? 'bg-blue-500 text-white shadow-sm' : 'text-neutral-300 hover:bg-white/20'}`}
        >
          💊 平板
        </button>
        <button 
          onClick={() => setDevice('desktop')} 
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${device === 'desktop' ? 'bg-blue-500 text-white shadow-sm' : 'text-neutral-300 hover:bg-white/20'}`}
        >
          💻 電腦
        </button>
        <div className="w-[1px] h-6 bg-white/20 mx-1 self-center" />
        <button 
          onClick={handleDevReset} 
          className="px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-red-500/80 hover:bg-red-500 text-white shadow-sm flex items-center gap-1"
        >
          ↻ 重置資料
        </button>
        <div className="w-[1px] h-6 bg-white/20 mx-1 self-center" />
        <button 
          onClick={() => setDevHUD(!devHUD)} 
          className="px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-neutral-700/80 hover:bg-neutral-600 text-white shadow-sm flex items-center gap-1"
        >
          🛠️ 開發工具
        </button>
      </div>

      <AnimatePresence>
        {devHUD && (
          <div className="fixed inset-0 z-[150] pointer-events-none flex justify-between p-4">
            {/* 左側：所有陣營角色预览 */}
            <div className="w-48 h-full overflow-y-auto pointer-events-auto bg-black/60 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex flex-col gap-6 no-scrollbar shadow-2xl">
              <h3 className="text-white text-xs font-black mb-2 border-b border-white/20 pb-2 uppercase tracking-widest">🎭 形態预览</h3>
              {[
                { name: 'Neutral', Comp: NeutralBaby },
                { name: 'P.Angel', Comp: PlayfulAngel },
                { name: 'Angel', Comp: Angel },
                { name: 'Archangel', Comp: Archangel },
                { name: 'P.Imp', Comp: PlayfulImp },
                { name: 'Demon', Comp: Demon },
                { name: 'Archdemon', Comp: Archdemon },
                { name: 'Hybrid', Comp: ChaosHybrid }
              ].map(({ name, Comp }) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 relative">
                    <Comp gender={babyGender as any} ageGroup={ageGroup} />
                  </div>
                  <span className="text-[10px] text-white/60 font-bold">{name}</span>
                  <div className="w-24 h-24 relative">
                    <Comp isSick={true} gender={babyGender as any} ageGroup={ageGroup} />
                  </div>
                  <span className="text-[9px] text-red-400 font-bold">{name} (生病)</span>
                </div>
              ))}
            </div>

            {/* 右側：隱藏成就條件 */}
            <div className="w-72 h-full overflow-y-auto pointer-events-auto bg-black/75 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex flex-col gap-4 no-scrollbar shadow-2xl">
              <h3 className="text-white text-xs font-black mb-2 border-b border-white/20 pb-2 uppercase tracking-widest text-center">🚀 隱藏成就解鎖條件</h3>
              {(() => {
                const unlocked = JSON.parse(localStorage.getItem('unlockedBadges') || '{}');
                const sections = [
                  {
                    title: "👶 0-1歲 隱藏彩蛋",
                    items: [
                      { id: 'h_poop', title: '生化武器 ☢️', cond: '紀錄文字含「炸屎大魔王」' },
                      { id: 'h_scissor', title: '理智線剪刀手 ✂️', cond: '備註含「扯、抓、打、咬」' },
                      { id: 'h_sleep', title: '睡神附體 😴', cond: '記錄安穩長睡且時數 >= 8' },
                      { id: 'h_vaccine', title: '無痛晉級 💉', cond: '打針/疫苗當天心情無負向' },
                      { id: 'h_heal', title: '治癒魔法 ✨', cond: '連續3天正向心情且有心情紀錄' },
                      { id: 'h_dj', title: '午夜 DJ 🎧', cond: '連續3天凌晨 2-4 點半夜驚啼' },
                      { id: 'h_speedrun', title: '速通大師 🚀', cond: '提早解鎖 3 個以上主線里程碑' }
                    ]
                  },
                  {
                    title: "👦 1-2歲 隱藏彩蛋",
                    items: [
                      { id: 'h_plates_cleaner', title: '乾淨空盤大師 🍽️', cond: '累計3次無拒食的正向飲食紀錄' },
                      { id: 'h_polite', title: '禮貌模範生 🥰', cond: '累計3次飛吻/揮手/分享玩具' },
                      { id: 'h_explorer', title: '勇敢探險家 🧭', cond: '用學習杯，或備註含「勇敢、不怕」' },
                      { id: 'h_tantrum', title: '尖叫爆發期 😫', cond: '地上打滾耍賴，或內容含「尖叫、大哭」' },
                      { id: 'h_gravity', title: '重力科學家 🍎', cond: '累計 3 次丟、扔食物或玩具' },
                      { id: 'h_stroller_run', title: '逃逃魔術師 🏃‍♂️', cond: '換尿布翻滾逃跑，或備註含「逃跑、掙脫」' },
                      { id: 'h_curious', title: '好奇心貓咪 🐈', cond: '累計解鎖 2 個以上的 1-2 歲主線成就' }
                    ]
                  },
                  {
                    title: "🦖 2-5歲 隱藏彩蛋",
                    items: [
                      { id: 'h_potty_hero', title: '馬桶小勇士 🚽', cond: '備註含「戒尿布、坐馬桶、如廁」' },
                      { id: 'h_sharing', title: '分享大天使 🎁', cond: '備註含「分享、給別的、分給」' },
                      { id: 'h_story_master', title: '說故事大師 📖', cond: '備註含「故事、長句、說話」' },
                      { id: 'h_why', title: '為什麼轟炸 ❓', cond: '備註含「為什麼」' },
                      { id: 'h_picasso', title: '牆面畢卡索 🖌️', cond: '備註含「畫牆、畫沙發、畫床」且心情負向' },
                      { id: 'h_bossy', title: '這裡是國王 👑', cond: '備註含「我的、不給、搶玩具」' },
                      { id: 'h_grow_up', title: '幼苗初長成 🌱', cond: '寶寶達到 Level 10 以上並解鎖 2-5 歲主線' }
                    ]
                  }
                ];

                return sections.map(sec => (
                  <div key={sec.title} className="flex flex-col gap-2 mb-2">
                    <h4 className="text-white/90 text-[10px] font-black tracking-wider bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/5">{sec.title}</h4>
                    <div className="flex flex-col gap-1.5 pl-1">
                      {sec.items.map(h => (
                        <div key={h.id} className="bg-white/5 p-2.5 rounded-xl border border-white/5 transition-colors hover:bg-white/10 font-sans">
                          <div className="text-[10px] font-black text-yellow-400 mb-0.5">{h.title}</div>
                          <div className="text-[9px] text-white/60 font-bold leading-tight">{h.cond}</div>
                          {unlocked[h.id] && <div className="text-[8px] text-emerald-400 font-black mt-1 flex items-center gap-1">已達成 <span className="text-[8px]">✅</span></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 畫面容器 */}
      <div className="transition-all duration-300 ease-in-out bg-white shrink-0 shadow-2xl" style={getDeviceStyle()}>
        {children}
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DeviceSimulator>
      <App />
    </DeviceSimulator>
  </StrictMode>,
);
