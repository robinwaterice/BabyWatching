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

  const babyGender = localStorage.getItem('babyGender') || 'boy';
  const birthday = localStorage.getItem('babyBirthday') || '';
  
  const getAgeGroup = () => {
    if (!birthday) return '0to1';
    const bDate = new Date(birthday);
    const now = new Date();
    if (isNaN(bDate.getTime())) return '0to1';
    const months = (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth());
    if (months >= 12 && months < 24) return '1to2';
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
            <div className="w-64 h-full overflow-y-auto pointer-events-auto bg-black/60 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex flex-col gap-4 no-scrollbar shadow-2xl">
              <h3 className="text-white text-xs font-black mb-2 border-b border-white/20 pb-2 uppercase tracking-widest">🚀 隱藏條件</h3>
              {(() => {
                const unlocked = JSON.parse(localStorage.getItem('unlockedBadges') || '{}');
                return [
                  { id: 'h_poop', title: '生化武器', cond: '紀錄文字含「炸屎大魔王」' },
                  { id: 'h_scissor', title: '理智線剪刀手', cond: '內容含「扯、抓、打、咬」' },
                  { id: 'h_sleep', title: '睡神附體', cond: '安穩長睡且時數 >= 8' },
                  { id: 'h_vaccine', title: '無痛晉級', cond: '打針/疫苗當天心情 >= 0' },
                  { id: 'h_heal', title: '治癒魔法', cond: '連續3天無負向心情且有心情紀錄' },
                  { id: 'h_dj', title: '午夜 DJ', cond: '連續3天凌晨 2-4 點半夜驚啼' },
                  { id: 'h_speedrun', title: '速通大師', cond: '提早解鎖 3 個以上主線里程碑' }
                ].map(h => (
                  <div key={h.id} className="bg-white/5 p-3 rounded-xl border border-white/5 transition-colors hover:bg-white/10">
                    <div className="text-[11px] font-black text-yellow-400 mb-1">{h.title}</div>
                    <div className="text-[10px] text-white/60 font-bold leading-tight">{h.cond}</div>
                    {unlocked[h.id] && <div className="text-[9px] text-emerald-400 font-black mt-1 flex items-center gap-1">已達成 <span className="text-[8px]">✅</span></div>}
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
