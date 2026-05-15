import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Home, Clock, Trophy, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer } from 'recharts';
import { BackgroundStars, NeutralBaby, ChaosHybrid, PlayfulAngel, Angel, Archangel, PlayfulImp, Demon, Archdemon } from './components/EvolutionCharacters';
import { RecordMenu, ActivityModule } from './components/RecordMenu';
import { MedicalRecordMenu } from './components/MedicalRecordMenu';
import { AchievementsView } from './components/AchievementsView';
import { BADGE_DEFS } from './constants/badges';

// 定義遊戲狀態介面
interface GameState {
  level: number;
  xp: number;
  alignmentScore: number; // 陣營演化值 [-100, 100]
  currentEvolution: string; // 當前演化形態
}

interface Activity {
  id: string;
  timeStr: string;
  dateStr?: string;
  timestamp?: number;
  action: string;
  xpGain: number;
  alphaGain: number;
  detail?: string;
  module?: string;
  _module?: string;
  temperature?: number;
  treatments?: string[];
  symptoms?: string[];
  note?: string;
}

interface Milestone {
  id: string;
  timeStr: string;
  text: string;
  icon: string;
}

const calculateAge = (bday: string) => {
  if (!bday) return "";
  const bdate = new Date(bday);
  const now = new Date();
  if (isNaN(bdate.getTime()) || bdate > now) return "還沒出生唷";
  let years = now.getFullYear() - bdate.getFullYear();
  let months = now.getMonth() - bdate.getMonth();
  let days = now.getDate() - bdate.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return `${years > 0 ? years + '歲 ' : ''}${months > 0 ? months + '個月 ' : ''}${days}天`;
}

function LogTabView({ activityLog, onDelete, onEdit }: { activityLog: Activity[], onDelete: (id: string) => void, onEdit: (log: Activity) => void }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const filterOptions = [
    { label: '飲食', id: 'feeding', icon: '🍼', color: '#fcd34d', classBg: 'bg-yellow-100', classText: 'text-yellow-600', classBorder: 'border-yellow-300' },
    { label: '嗯嗯', id: 'diaper', icon: '💩', color: '#d1d5db', classBg: 'bg-slate-100', classText: 'text-slate-600', classBorder: 'border-slate-300' },
    { label: '睡眠', id: 'sleep', icon: '💤', color: '#6ee7b7', classBg: 'bg-emerald-100', classText: 'text-emerald-600', classBorder: 'border-emerald-300' },
    { label: '日常', id: 'mood', icon: '💖', color: '#fca5a5', classBg: 'bg-red-100', classText: 'text-red-600', classBorder: 'border-red-300' },
    { label: '醫療', id: 'medical', icon: '🏥', color: '#f43f5e', classBg: 'bg-rose-100', classText: 'text-rose-600', classBorder: 'border-rose-300' },
  ];

  const getModuleForLog = (log: Activity) => {
    if (log.module) return log.module;
    if (['餵奶'].includes(log.action)) return 'feeding';
    if (['噴屎'].includes(log.action)) return 'diaper';
    if (['睡覺'].includes(log.action)) return 'sleep';
    return 'mood';
  };

  const handleFilterToggle = (id: string) => {
    setActiveFilters(prev => {
      if (id === 'medical') {
        return prev.includes('medical') ? [] : ['medical'];
      } else {
        if (prev.includes('medical')) return [id];
        return prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id];
      }
    });
    setSelectedDate(null);
  };

  const processedLogs = activityLog.map(log => {
      let ts = log.timestamp;
      if (!ts) {
          const parsedId = parseInt(log.id);
          if (!isNaN(parsedId) && parsedId > 1600000000000) ts = parsedId;
          else ts = Date.now();
      }
      const d = new Date(ts);
      return {
          ...log,
          timestamp: ts,
          dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
          _module: getModuleForLog(log)
      };
  });

  const last7Days = Array.from({length: 7}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return `${d.getMonth()+1}/${d.getDate()}`;
  });

  const chartData = last7Days.map(dateStr => {
    const logsOnDate = processedLogs.filter(l => l.dateStr === dateStr);
    const counts: Record<string, number> = {};
    filterOptions.forEach(f => counts[f.id] = 0);
    
    logsOnDate.forEach(log => {
      if (counts[log._module] !== undefined) {
        counts[log._module]++;
      }
    });

    const totalActive = activeFilters.reduce((sum, f) => sum + counts[f], 0);

    return {
      dateStr,
      counts,
      totalActive,
      logs: logsOnDate
    };
  });

  const maxTotal = Math.max(...chartData.map(d => d.totalActive), 5); // base scale 5
  const todayStr = last7Days[6];
  const todayData = chartData[6];

  const detailsData = selectedDate 
    ? processedLogs.filter(l => l.dateStr === selectedDate && (activeFilters.length === 0 || activeFilters.includes(l._module)))
    : processedLogs.filter(l => activeFilters.length === 0 || activeFilters.includes(l._module));

  const showMedicalChart = activeFilters.includes('medical');

  // Prepare fever chart data
  const feverData = processedLogs
    .filter(l => l.temperature)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(l => {
      let marker = '';
      if (l.treatments) {
        if (l.treatments.some(t => t.includes('抗生素'))) marker = '💊✨';
        else if (l.treatments.some(t => t.includes('塞劑'))) marker = '💉';
        else if (l.treatments.some(t => t.includes('藥水') || t.includes('感冒藥'))) marker = '💊';
      }
      return {
         time: l.timestamp,
         displayTime: `${l.dateStr} ${l.timeStr}`,
         temperature: l.temperature,
         marker
      };
    });

  const CustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.marker) return <circle cx={cx} cy={cy} r={3} fill="#f43f5e" />;
    return (
      <g transform={`translate(${cx},${cy})`}>
        <circle r={3} fill="#f43f5e" />
        <text x={0} y={-8} textAnchor="middle" fontSize="12">{payload.marker}</text>
      </g>
    );
  };

  return (
    <motion.div
      key="log"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full h-full flex flex-col p-4 overflow-hidden max-w-md mx-auto"
    >
      <h2 className="text-xl font-black text-neutral-700 mb-4 tracking-wider self-center text-shadow-sm mt-2">🐣 成長軌跡</h2>

      {/* Top filters */}
      <div className="grid grid-cols-5 gap-2 mb-6 shrink-0 px-2 mt-2">
        {filterOptions.map(opt => {
          const isActive = activeFilters.includes(opt.id);
          const totalCount = chartData.reduce((sum, d) => sum + (d.counts[opt.id] || 0), 0);
          return (
            <div key={opt.id} className="relative aspect-[4/5] flex">
              <button
                onClick={() => handleFilterToggle(opt.id)}
                className={`w-full flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 relative overflow-hidden border-2 ${
                  isActive ? `${opt.classBg} ${opt.classBorder} scale-105 z-10 shadow-sm` : 'bg-neutral-300/50 border-transparent hover:bg-neutral-300/70'
                }`}
              >
                <div className={`w-8 h-10 mb-1.5 rounded flex items-center justify-center shadow-sm ${isActive ? 'bg-white/40' : 'bg-white/50'}`}>
                  <span className={`text-xl md:text-2xl filter drop-shadow-sm ${!isActive ? 'opacity-70 grayscale' : ''}`}>{opt.icon}</span>
                </div>
                <span className={`text-[10px] md:text-[11px] font-black ${isActive ? opt.classText : 'text-neutral-500'}`}>
                  {opt.label}
                </span>
              </button>
              <div className="absolute -top-1.5 -right-1.5 text-[9px] font-extrabold flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-full shadow-sm z-20 bg-white text-neutral-500 border border-neutral-100">
                {totalCount}
              </div>
            </div>
          )
        })}
      </div>

      {showMedicalChart ? (
         <div className="w-full bg-white rounded-[2rem] p-4 shadow-[0_8px_32px_rgba(244,63,94,0.1)] border border-rose-100 mb-6 flex flex-col relative min-h-[200px] shrink-0">
           <h3 className="text-xs font-black text-rose-500 mb-2 flex items-center gap-1"><span className="text-base">🌡️</span> 體溫與用藥關聯圖</h3>
           {feverData.length > 0 ? (
             <div className="w-full h-[160px] -ml-4">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={feverData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                   <XAxis dataKey="displayTime" tick={{ fontSize: 9, fill: '#9CA3AF' }} tickMargin={5} minTickGap={15} />
                   <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9, fill: '#9CA3AF' }} width={30} />
                   <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                     labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
                   />
                   {/* @ts-ignore */}
                   <ReferenceArea y1={38} y2={45} fill="#fef2f2" fillOpacity={1} />
                   <Line type="monotone" dataKey="temperature" stroke="#f43f5e" strokeWidth={2.5} dot={<CustomizedDot />} activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           ) : (
             <div className="flex-1 flex items-center justify-center text-xs font-bold text-neutral-400">目前沒有體溫紀錄</div>
           )}
         </div>
      ) : (
        <div className="w-full bg-neutral-300/60 rounded-[2rem] p-3 shadow-inner border border-black/5 backdrop-blur-sm mb-6 flex flex-col items-center relative min-h-[160px] shrink-0">
          {activeFilters.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <span className="text-neutral-500 font-bold bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[11px] shadow-sm flex gap-1.5 items-center">
                <span>👆</span> 點擊上方卡片顯示動態圖表
              </span>
            </div>
          )}

          <div className="w-full bg-white rounded-xl h-[120px] flex items-end justify-between px-2 gap-2 mt-1 relative z-0 pt-2 pb-1 shadow-sm">
          {chartData.map((d, i) => {
            let currentY = 0;
            const isSelected = selectedDate === d.dateStr;
            const heightMultiplier = 120 / maxTotal;
            const hasData = activeFilters.some(f => (d.counts[f] || 0) > 0);

            return (
              <div 
                key={d.dateStr} 
                className={`flex flex-col items-center flex-1 transition-all h-full relative ${hasData ? 'cursor-pointer hover:bg-white/30 rounded-xl' : ''}`}
                onClick={() => {
                  if (activeFilters.length > 0 && hasData) setSelectedDate(isSelected ? null : d.dateStr);
                }}
              >
                <div className="w-full h-full flex flex-col justify-end relative z-10">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <AnimatePresence>
                      {activeFilters.map(f => {
                        const count = d.counts[f] || 0;
                        if (count === 0) return null;
                        const h = count * heightMultiplier;
                        const y = 120 - currentY - h;
                        currentY += h;
                        const opt = filterOptions.find(o => o.id === f);
                        
                        return (
                          <motion.rect
                            key={f}
                            initial={{ y: 120, height: 0, opacity: 0 }}
                            animate={{ y, height: h, opacity: 1 }}
                            exit={{ y: 120, height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            x="20%"
                            width="60%"
                            fill={opt?.color}
                            className={`${activeFilters.length > 1 ? 'stroke-white stroke-[1.5px]' : ''}`}
                            rx="4"
                          />
                        );
                      })}
                    </AnimatePresence>
                  </svg>
                </div>
                {/* Active day background indicator */}
                {isSelected && (
                  <motion.div layoutId="col-bg" className="absolute inset-0 bg-neutral-100/50 border border-neutral-200/50 shadow-sm rounded-xl -z-0" />
                )}
              </div>
            );
          })}
        </div>
        
        {/* X Axis Labels */}
        <div className="w-full flex justify-between px-2 mt-3 mb-1">
          {chartData.map(d => (
            <div key={d.dateStr} className={`flex-1 text-center text-[9px] md:text-[10px] font-black z-10 transition-colors ${selectedDate === d.dateStr ? 'text-pastel-purple' : 'text-neutral-400'}`}>
              {d.dateStr === todayStr ? '今日' : d.dateStr}
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Details List */}
      <motion.div
        key="details-list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="flex-1 w-full flex flex-col min-h-0"
      >
        <div className="flex items-center justify-between mb-3 px-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedDate ? '🗓️' : '📋'}</span>
            <span className="font-extrabold text-neutral-600 text-[13px]">{selectedDate ? `${selectedDate} 詳細紀錄` : '所有詳細紀錄'}</span>
          </div>
          <span className="text-[10px] font-bold text-white bg-neutral-300/80 px-2.5 py-1 shadow-sm rounded-full">{detailsData.length} 筆</span>
        </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 px-1 pb-10">
              {detailsData.length === 0 ? (
                <div className="text-center text-neutral-400 text-sm font-bold mt-4">無符合的紀錄</div>
              ) : (
                detailsData.map(log => {
                  const opt = filterOptions.find(o => o.id === log._module);
                  return (
                    <motion.div 
                      key={log.id} 
                      layout
                      initial={{opacity: 0, scale: 0.95}}
                      animate={{opacity: 1, scale: 1}}
                      className="p-3 rounded-[1.25rem] flex items-center gap-3 border border-white/80 shadow-sm bg-white/70"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${opt?.classBg || 'bg-neutral-100'}`}>
                        {opt?.icon || '🌟'}
                      </div>
                      <div className="flex flex-col flex-1 pl-1">
                        <span className="font-extrabold text-neutral-700 text-[15px]">{log.action}</span>
                        {log.detail && <span className="text-[11px] font-bold text-neutral-500 mt-0.5">{log.detail}</span>}
                        <span className="text-[10px] text-neutral-400 font-bold mt-1">{log.timeStr}</span>
                          <div className="flex gap-2 mt-2">
                             <button
                               onClick={() => onEdit(log)}
                               className="px-3 py-1 bg-neutral-200 text-neutral-600 rounded-full text-[10px] font-bold hover:bg-neutral-300 transition-colors"
                             >
                               修改 Edit
                             </button>
                             <button
                               onClick={() => onDelete(log.id)}
                               className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-bold hover:bg-red-200 transition-colors"
                             >
                               刪除 Delete
                             </button>
                          </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-black text-neutral-500 bg-neutral-200/60 px-2.5 py-0.5 rounded-full">+{log.xpGain} XP</span>
                        {log.alphaGain !== 0 && (
                          <span className={`text-[10px] font-black ${log.alphaGain > 0 ? 'text-yellow-500' : 'text-purple-500'}`}>
                            {log.alphaGain > 0 ? `+${log.alphaGain} 天使` : `${log.alphaGain} 惡魔`}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>

    </motion.div>
  );
}

export default function App() {
  // 從 LocalStorage 載入初始狀態，若無則使用預設值
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('babyGameState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          level: parsed.level || 1,
          xp: parsed.xp || 0,
          alignmentScore: parsed.alignmentScore || 0,
          currentEvolution: parsed.currentEvolution || '中立'
        };
      } catch (e) {
        console.error("Failed to parse game state:", e);
      }
    }
    return { level: 1, xp: 0, alignmentScore: 0, currentEvolution: '中立' };
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [actionEffects, setActionEffects] = useState<{id: number, text: string, type: 'xp'|'glow'|'dark', x: number, y: number}[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActivityModule | 'medical' | null>(null);
  const [editingRecord, setEditingRecord] = useState<Activity | null>(null);
  const [babyName, setBabyName] = useState(() => localStorage.getItem('babyName') || "小寶寶");
  
  const [unlockedBadges, setUnlockedBadges] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('unlockedBadges');
    return saved ? JSON.parse(saved) : {};
  });

  const [mainTab, setMainTab] = useState<'home'|'log'|'milestones'|'profile'>('home');
  const [activityLog, setActivityLog] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('babyActivityLog');
    return saved ? JSON.parse(saved) : [];
  });
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('babyMilestones');
    return saved ? JSON.parse(saved) : [];
  });
  const [birthday, setBirthday] = useState(() => localStorage.getItem('babyBirthday') || "");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const ageString = calculateAge(birthday);

  // 計算下一級所需 XP 的公式: Level * 100 * 1.2 (向上取整)
  const getNextLevelXp = (level: number) => Math.ceil(level * 100 * 1.2);
  const nextLevelXp = getNextLevelXp(gameState.level);

  // 8 階層陣營形態判定邏輯
  const getEvolutionState = (alpha: number, level: number) => {
    if (alpha > 90) return '大天使';
    if (alpha > 60 && alpha <= 90) return '天使';
    if (alpha > 30 && alpha <= 60) return '淘氣小天使';
    if (alpha >= -30 && alpha <= 30) {
      return level >= 5 ? '中立 (LV5以上)' : '中立 (LV1-LV4)';
    }
    if (alpha >= -60 && alpha < -30) return '頑皮小惡魔';
    if (alpha >= -90 && alpha < -60) return '惡魔';
    return '大惡魔';
  };

  // 狀態改變時同步更新 LocalStorage
  useEffect(() => {
    localStorage.setItem('babyGameState', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('babyName', babyName);
  }, [babyName]);

  useEffect(() => {
    localStorage.setItem('babyActivityLog', JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem('babyMilestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('babyBirthday', birthday);
  }, [birthday]);

  useEffect(() => {
    localStorage.setItem('unlockedBadges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  // 成就解鎖
  const handleUnlockBadge = (badgeId: string) => {
    const badge = BADGE_DEFS.find(b => b.id === badgeId);
    if (!badge || unlockedBadges[badgeId]) return;

    const now = Date.now();
    const newUnlockedBadges = { ...unlockedBadges, [badgeId]: now };
    
    const badgesToUnlock = [badge];
    
    // 檢查新手村速通大師 (Speedrunner)
    if (badge.type === 'classic' && !newUnlockedBadges['h_speedrun'] && birthday) {
      const getMonthsDifference = (bday: string, target: number) => {
        const d1 = new Date(bday);
        const d2 = new Date(target);
        const months = (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth();
        const days = d2.getDate() - d1.getDate();
        return months + (days / 30);
      };
      
      let earlyCount = 0;
      BADGE_DEFS.filter(b => b.type === 'classic').forEach(cb => {
        if (newUnlockedBadges[cb.id] && cb.startMonth !== undefined) {
           const monthsOld = getMonthsDifference(birthday, newUnlockedBadges[cb.id]);
           if (monthsOld < cb.startMonth) {
             earlyCount++;
           }
        }
      });
      
      if (earlyCount >= 3) {
         const speedBadge = BADGE_DEFS.find(b => b.id === 'h_speedrun');
         if (speedBadge) {
           badgesToUnlock.push(speedBadge);
           newUnlockedBadges['h_speedrun'] = now;
         }
      }
    }

    setUnlockedBadges(newUnlockedBadges);

    const d = new Date(now);
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    
    let totalXpAdded = 0;
    const newMilestones = badgesToUnlock.map(b => {
      totalXpAdded += b.xpReward;
      return {
        id: Date.now().toString() + Math.random(),
        timeStr,
        text: `解鎖成就：「${b.title}」`,
        icon: b.icon
      };
    });

    setMilestones(prev => [...newMilestones, ...prev]);

    spawnEffect(`+${totalXpAdded} XP`, 'xp', window.innerWidth / 2, window.innerHeight * 0.7);
    
    setGameState(prevState => {
      let currentXp = prevState.xp + totalXpAdded;
      let currentLevel = prevState.level;
      let leveledUp = false;
      while (currentXp >= getNextLevelXp(currentLevel)) {
        currentXp -= getNextLevelXp(currentLevel);
        currentLevel += 1;
        leveledUp = true;
      }
      let currentEvolution = prevState.currentEvolution;
      if (leveledUp) {
        currentEvolution = getEvolutionState(prevState.alignmentScore, currentLevel);
        triggerLevelUp();
        setMilestones(prev => [{
          id: Date.now().toString() + Math.random(),
          timeStr,
          text: `升級到 Lv.${currentLevel}！形態：${currentEvolution}`,
          icon: '✨'
        }, ...prev]);
      }
      return { ...prevState, level: currentLevel, xp: currentXp, currentEvolution };
    });
  };

  // 產生特效的共用方法
  const spawnEffect = (text: string, type: 'xp'|'glow'|'dark', x: number, y: number) => {
    const id = Date.now() + Math.random();
    setActionEffects(prev => [...prev, { id, text, type, x, y }]);
    setTimeout(() => {
      setActionEffects(prev => prev.filter(e => e.id !== id));
    }, type === 'xp' ? 1000 : 1500);
  };

  const handleDeleteRecord = (id: string) => {
    setActivityLog(prev => prev.filter(log => log.id !== id));
  };

  // 處理紀錄提交
  const handleRecordSubmit = (data: { id?: string, action: string, detail: string, alphaGain: number, xpGain: number, targetTimestamp?: number, temperature?: number, treatments?: string[], symptoms?: string[], note?: string }) => {
    const now = new Date();
    let timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    let dateStr = `${now.getMonth() + 1}/${now.getDate()}`;
    let nowTimestamp = now.getTime();
    
    if (data.targetTimestamp) {
       const d = new Date(data.targetTimestamp);
       timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
       dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
       nowTimestamp = data.targetTimestamp;
    }
    
    // Update existing record
    if (data.id) {
       setActivityLog(prev => prev.map(log => {
         if (log.id === data.id) {
            return {
               ...log,
               timeStr,
               dateStr,
               timestamp: nowTimestamp,
               action: data.action,
               detail: data.detail,
               temperature: data.temperature,
               treatments: data.treatments,
               symptoms: data.symptoms,
               note: data.note,
               xpGain: data.xpGain,
               alphaGain: data.alphaGain,
            }
         }
         return log;
       }));
       
       setActionEffects(prev => [...prev, {
         id: Date.now(),
         text: '✏️ 修改成功',
         type: 'xp',
         x: window.innerWidth / 2,
         y: window.innerHeight / 2
       }]);
       return;
    }

    const newLog = {
      id: Date.now().toString() + Math.random(),
      timeStr,
      dateStr,
      timestamp: nowTimestamp,
      action: data.action,
      detail: data.detail,
      module: activeMenu || 'mood',
      xpGain: data.xpGain,
      alphaGain: data.alphaGain,
      temperature: data.temperature,
      treatments: data.treatments,
      symptoms: data.symptoms,
      note: data.note
    };

    const newActivityLog = [newLog, ...activityLog].slice(0, 50);
    setActivityLog(newActivityLog);

    let newlyUnlockedIds: string[] = [];
    const triggerHidden = (id: string) => {
      if (!unlockedBadges[id] && !newlyUnlockedIds.includes(id)) {
        newlyUnlockedIds.push(id);
      }
    };

    // h_poop: 炸屎大魔王
    if (data.action.includes('炸屎大魔王')) triggerHidden('h_poop');
    
    // h_scissor: 理智線剪刀手
    if (data.detail && (data.detail.includes('扯') || data.detail.includes('抓') || data.detail.includes('打') || data.detail.includes('咬'))) {
      triggerHidden('h_scissor');
    }

    // h_sleep: 睡神附體
    if (data.action.includes('安穩長睡')) {
       const match = data.detail.match(/\d+(\.\d+)?/);
       if (match && parseFloat(match[0]) >= 8) {
           triggerHidden('h_sleep');
       } else if (data.detail.includes('8') || data.detail.includes('9') || data.detail.includes('10') || data.detail.includes('過夜')) {
           triggerHidden('h_sleep');
       }
    }

    // h_vaccine: 無痛晉級
    if ((data.detail.includes('疫苗') || data.detail.includes('打針')) && data.alphaGain >= 0) {
       triggerHidden('h_vaccine');
    }

    // h_heal: 治癒魔法 - 連續 3 天正向情緒 (每天至少一筆心情紀錄，且皆 >= 0)
    const daysWithRecord = Array.from(new Set(newActivityLog.map(l => l.dateStr)));
    if (daysWithRecord.length >= 3) {
      const last3Days = daysWithRecord.slice(0, 3);
      const logsLast3Days = newActivityLog.filter(l => last3Days.includes(l.dateStr));
      const hasNegative = logsLast3Days.some(l => l.alphaGain < 0);
      // Ensure there is at least one mood log across these 3 days
      const hasMood = logsLast3Days.some(l => l.module === 'mood');
      if (!hasNegative && hasMood) {
        triggerHidden('h_heal');
      }
    }

    // h_dj: 午夜 DJ - 連續 3 天在凌晨 2-4 點半夜驚啼
    if (data.action.includes('半夜驚啼')) {
      const h = now.getHours();
      if (h >= 2 && h <= 4) {
        const djLogs = newActivityLog.filter(l => {
          if (!l.action.includes('半夜驚啼')) return false;
          const logDate = new Date(l.timestamp || 0);
          const lh = logDate.getHours();
          return lh >= 2 && lh <= 4;
        });
        const djDates = Array.from(new Set(djLogs.map(l => l.dateStr)));
        if (djDates.length >= 3) {
          triggerHidden('h_dj');
        }
      }
    }

    let totalXpGain = data.xpGain;
    
    if (newlyUnlockedIds.length > 0) {
      setUnlockedBadges(prev => {
        const next = { ...prev };
        newlyUnlockedIds.forEach(id => {
          next[id] = nowTimestamp;
        });
        return next;
      });

      const newMilestones = newlyUnlockedIds.map(id => {
        const badge = BADGE_DEFS.find(b => b.id === id);
        if (badge) {
          totalXpGain += badge.xpReward;
          return {
            id: Date.now().toString() + Math.random(),
            timeStr,
            text: `解鎖隱藏成就：「${badge.title}」`,
            icon: badge.icon
          };
        }
        return null;
      }).filter(Boolean) as Milestone[];
      
      setMilestones(prev => [...newMilestones, ...prev]);
    }

    // 浮動文字回饋 (+XP)，顯示在畫面中央偏下
    const x = window.innerWidth / 2;
    const y = window.innerHeight * 0.7;
    spawnEffect(`+${totalXpGain} XP`, 'xp', x, y);

    setGameState(prevState => {
      let currentXp = prevState.xp + totalXpGain;
      let currentLevel = prevState.level;
      let currentAlpha = Math.max(-100, Math.min(100, prevState.alignmentScore + data.alphaGain));
      let currentEvolution = prevState.currentEvolution;
      let leveledUp = false;

      // 檢查是否升級 (包含連續越級的情況)
      while (currentXp >= getNextLevelXp(currentLevel)) {
        currentXp -= getNextLevelXp(currentLevel);
        currentLevel += 1;
        leveledUp = true;
      }

      if (leveledUp) {
        // 升級瞬間判定陣營並更新演化形態
        currentEvolution = getEvolutionState(currentAlpha, currentLevel);
        triggerLevelUp();
        
        setMilestones(prev => [{
          id: Date.now().toString() + Math.random(),
          timeStr,
          text: `升級到 Lv.${currentLevel}！形態：${currentEvolution}`,
          icon: '✨'
        }, ...prev]);
      }

      return {
        level: currentLevel,
        xp: currentXp,
        alignmentScore: currentAlpha,
        currentEvolution
      };
    });
  };

  const handleCharacterClick = (event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 互動回饋觸發機率 P = 0.5 + (α / 200)
    const p = 0.5 + (gameState.alignmentScore / 200);
    const isPositive = Math.random() < p;
    
    if (isPositive) {
      spawnEffect('✨', 'glow', centerX, centerY);
    } else {
      spawnEffect('💢', 'dark', centerX, centerY);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    }
  };

  const triggerLevelUp = () => {
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 2500);
  };

  const renderCharacter = () => {
    switch(gameState.currentEvolution) {
      case '大天使': return <Archangel />;
      case '天使': return <Angel />;
      case '淘氣小天使': return <PlayfulAngel />;
      case '頑皮小惡魔': return <PlayfulImp />;
      case '惡魔': return <Demon />;
      case '大惡魔': return <Archdemon />;
      case '中立 (LV5以上)': return <ChaosHybrid />;
      case '中立 (LV1-LV4)':
      default: return <NeutralBaby />;
    }
  };

  const handleResetAll = () => {
    setGameState({ level: 1, xp: 0, alignmentScore: 0, currentEvolution: '中立' });
    setBabyName('小寶寶');
    setActivityLog([]);
    setMilestones([]);
    setBirthday('');
    localStorage.clear();
    setMainTab('home');
    setShowResetConfirm(false);
  };

  // 找出目前在觀察範圍內的未解鎖成就
  const observingBadges = BADGE_DEFS.filter(b => {
    if (b.type !== 'classic' || unlockedBadges[b.id] || !birthday || b.startMonth === undefined) return false;
    const bDate = new Date(birthday);
    const now = new Date();
    const months = (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth()) + (now.getDate() - bDate.getDate()) / 30;
    return months >= b.startMonth;
  });

  return (
    <div className={`fixed inset-0 w-full h-[100dvh] bg-[var(--color-pastel-bg)] flex flex-col items-center text-neutral-800 font-sans select-none overflow-hidden ${isShaking ? 'animate-shake' : ''}`}>
      <BackgroundStars />
      
      <div className="relative z-10 w-full h-full flex flex-col pb-16 md:pb-18 overflow-hidden">
        <AnimatePresence mode="wait">
          {mainTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 w-full h-full flex flex-col items-center p-3 md:p-6 overflow-y-auto relative"
            >
              {/* 首頁的觀察中提醒氣泡 */}
              {observingBadges.length > 0 && observingBadges.map((badge, idx) => {
                const isLeft = idx % 2 === 0;
                const row = Math.floor(idx / 2);
                return (
                  <div 
                    key={badge.id}
                    className={`absolute z-20 glass-card bg-yellow-50/90 rounded-2xl p-2 px-3 flex items-center gap-2 shadow-sm border border-yellow-200 animate-bounce cursor-pointer flex-shrink-0 max-w-[150px] ${isLeft ? 'left-2 md:left-4' : 'right-2 md:right-4'}`}
                    style={{ top: `calc(max(130px, 15vh) + ${row * 70}px)`, animationDelay: `${idx * 0.15}s` }}
                    onClick={() => setMainTab('milestones')}
                  >
                    <span className="text-xl md:text-2xl drop-shadow-sm flex-none">{badge.icon}</span>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="text-[10px] font-black text-yellow-600 tracking-wider">寶寶觀察中</span>
                      <span className="text-[11px] font-bold text-neutral-600 truncate">{badge.title}</span>
                    </div>
                  </div>
                );
              })}


              {/* 頂部狀態卡片區塊 */}
              <div className="flex-none w-full max-w-xs md:max-w-md glass-card rounded-2xl p-3 md:p-4 mt-2 transition-all z-10 relative">
                <div className="flex flex-col mb-2">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-neutral-800 tracking-tight text-shadow-glow flex items-center gap-2">
              Lv. {gameState.level}
            </h1>
            <span className="text-[10px] md:text-xs font-bold text-[#888] bg-white/70 px-2 py-0.5 rounded-full tracking-wide shadow-sm border border-white/50">
              {gameState.currentEvolution}
            </span>
                    <input
                      type="text"
                      value={babyName}
                      onChange={(e) => setBabyName(e.target.value)}
                      className="text-sm md:text-base font-bold text-neutral-600 bg-transparent border-none outline-none w-20 md:w-32 focus:ring-0 p-0 shadow-none focus:border-b focus:border-neutral-300 transition-colors ml-1"
                      placeholder="輸入名字"
                    />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-[#888] uppercase tracking-wider">{gameState.xp} / {nextLevelXp} XP</span>
                </div>
                {birthday && (
                  <div className="text-[10px] sm:text-[11px] font-bold text-[#888] mt-1.5 px-0.5">
                    {babyName} 目前：{ageString}
                  </div>
                )}
              </div>
        
        {/* 優雅細長的 XP 進度條 */}
        <div className="w-full h-1 bg-white/60 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-pastel-pink to-pastel-purple rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((gameState.xp / nextLevelXp) * 100, 100)}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
          />
        </div>
      </div>

      {/* 中央角色區域占位符 */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative w-full my-2 z-10">
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: -60, scale: 1 }}
              exit={{ opacity: 0, y: -80, scale: 1.1, filter: "blur(8px)" }}
              className="absolute pointer-events-none z-30 flex items-center justify-center -top-8 md:-top-16"
            >
              <div className="glass-card text-[#888] px-8 py-3 rounded-full font-black text-lg tracking-widest flex items-center gap-2 border-white">
                <span className="text-pastel-pink">✨</span> LEVEL UP <span className="text-pastel-pink">✨</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          onClick={handleCharacterClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full h-full max-w-[170px] max-h-[170px] sm:max-w-[220px] sm:max-h-[220px] md:max-w-[280px] md:max-h-[280px] cursor-pointer transition-all duration-500 relative flex items-center justify-center"
        >
          {/* 加入緩慢呼吸 floating 動畫 */}
          <div className="w-full h-full animate-float flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={gameState.currentEvolution}
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-full absolute inset-0 drop-shadow-2xl"
              >
                {renderCharacter()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* 下方動作區域 */}
      <div className="flex-none w-[92%] max-w-sm md:max-w-md mx-auto z-10 relative mt-auto mb-2 md:mb-6 flex flex-col">
        {/* 陣營計量條 */}
        <div className="w-full bg-white/50 p-1.5 px-3 md:p-2 md:px-4 rounded-xl mb-2 md:mb-3 shadow-sm border border-white/60 backdrop-blur-sm mx-auto">
          <div className="flex justify-between items-center text-[9px] md:text-[11px] font-bold text-neutral-600 mb-1">
            <span>陣營傾向</span>
            <span>{gameState.alignmentScore}</span>
          </div>
          <div className="relative w-full pb-3 md:pb-4">
            <div className="w-full h-1.5 md:h-2 bg-neutral-200 rounded-full relative shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-neutral-200 to-yellow-400 opacity-100" />
              {/* 分隔線 */}
              <div className="absolute inset-y-0 left-[50%] w-[1px] bg-neutral-400/50" /> {/* 0 */}
            </div>

            {/* 標籤 */}
            <div className="absolute top-2.5 md:top-3 left-0 right-0 h-4 text-[8px] md:text-[9px] font-bold whitespace-nowrap">
               <span className="absolute left-0 text-purple-600">大惡魔 (-100)</span>
               <span className="absolute left-[50%] -translate-x-1/2 text-neutral-500">中立 0</span>
               <span className="absolute right-0 text-yellow-600">大天使 (100)</span>
            </div>

            {/* 指標游標 */}
            <motion.div
              className="absolute top-[-3px] md:top-[-2px] w-3 h-3 md:w-4 md:h-4 bg-white border border-neutral-300 rounded-full shadow-sm z-10 flex items-center justify-center transform -translate-x-1/2"
              animate={{ left: `${((gameState.alignmentScore + 100) / 200) * 100}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            >
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${gameState.alignmentScore < 0 ? 'bg-purple-500' : gameState.alignmentScore > 0 ? 'bg-yellow-400' : 'bg-neutral-400'}`} />
            </motion.div>
          </div>
        </div>

        {/* 五大核心紀錄模組 Icon */}
        <div className="w-full grid grid-cols-5 gap-2 pb-1 mb-2">
           <ActionBtn icon="🍼" title="飲食" xpText="記錄" onClick={() => setActiveMenu('feeding')} />
           <ActionBtn icon="💩" title="嗯嗯" xpText="記錄" onClick={() => setActiveMenu('diaper')} />
           <ActionBtn icon="💤" title="睡眠" xpText="記錄" onClick={() => setActiveMenu('sleep')} />
           <ActionBtn icon="💖" title="日常" xpText="記錄" onClick={() => setActiveMenu('mood')} />
           <ActionBtn icon="🏥" title="醫療" xpText="記錄" onClick={() => setActiveMenu('medical')} />
        </div>

        <div className="flex justify-center z-10 relative">
          <button
            onClick={() => setGameState({ level: 1, xp: 0, alignmentScore: 0, currentEvolution: '中立' })}
            className="flex items-center gap-1.5 text-[9px] md:text-xs font-bold text-[#888] bg-white/50 hover:bg-white/80 px-3 md:px-4 py-1 md:py-1.5 rounded-full transition-all border border-white/40"
          >
            <RotateCcw size={12} />
            重置到 1 級
          </button>
        </div>
      </div>
            </motion.div>
          )}

          {mainTab === 'log' && <LogTabView activityLog={activityLog} onDelete={handleDeleteRecord} onEdit={(log) => { setEditingRecord(log); setActiveMenu(log.module || log._module || 'medical'); }} />}

          {mainTab === 'milestones' && (
            <AchievementsView
              unlockedBadges={unlockedBadges}
              onUnlockBadge={handleUnlockBadge}
              babyBirthday={birthday}
            />
          )}

          {mainTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 w-full h-full flex flex-col items-center p-6 md:p-8 overflow-y-auto max-w-md mx-auto"
            >
              <h2 className="text-xl font-black text-neutral-700 mb-6 tracking-wider self-center text-shadow-sm mt-2">⚙️ 個人設定</h2>
              <div className="w-full glass-card p-6 py-8 rounded-3xl flex flex-col gap-6 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white/50">
                
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-[#888] ml-2 tracking-widest uppercase">寶寶暱稱</label>
                  <input
                    type="text"
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                    className="w-full bg-white/80 rounded-xl px-4 py-3 font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-pastel-pink/50 transition-all border border-white shadow-inner text-sm"
                    placeholder="輸入寶寶暱稱"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-[#888] ml-2 tracking-widest uppercase">寶寶生日</label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full bg-white/80 rounded-xl px-4 py-3 font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-pastel-pink/50 transition-all border border-white shadow-inner uppercase text-sm"
                  />
                  {ageString && <div className="text-xs font-extrabold text-pastel-purple text-right pr-2 mt-1">目前：{ageString}</div>}
                </div>
                
                <div className="mt-2 pt-6 border-t border-white/40 flex flex-col items-center">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="text-red-500 font-bold text-sm bg-white/60 hover:bg-white/90 border border-white px-6 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    全部重置
                  </button>
                  <span className="text-[10px] text-neutral-400 mt-2 font-bold tracking-widest">警告：將清除所有紀錄與設定</span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 固定在底部的導覽列 */}
      <div className="fixed bottom-0 left-0 right-0 h-16 md:h-[72px] bg-white/80 backdrop-blur-xl border-t border-white/50 z-50 flex items-center justify-around px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.03)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <NavBtn active={mainTab === 'home'} icon={<Home size={22} strokeWidth={2.5} />} label="主頁" onClick={() => setMainTab('home')} />
        <NavBtn active={mainTab === 'log'} icon={<Clock size={22} strokeWidth={2.5} />} label="軌跡" onClick={() => setMainTab('log')} />
        <NavBtn active={mainTab === 'milestones'} icon={<Trophy size={22} strokeWidth={2.5} />} label="里程碑" onClick={() => setMainTab('milestones')} />
        <NavBtn active={mainTab === 'profile'} icon={<Settings size={22} strokeWidth={2.5} />} label="設定" onClick={() => setMainTab('profile')} />
      </div>

      {/* 點擊浮動回饋特效 */}
      <AnimatePresence>
        {actionEffects.map(effect => {
          if (effect.type === 'xp') {
            return (
              <motion.div
                key={effect.id}
                initial={{ opacity: 1, y: effect.y - 30, x: effect.x - 30, scale: 0.8 }}
                animate={{ opacity: 0, y: effect.y - 100, x: effect.x - 30, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                className="fixed pointer-events-none text-[#888] font-extrabold text-lg md:text-xl z-50 tracking-tight bg-white/70 px-3 py-1 rounded-full shadow-sm"
              >
                {effect.text}
              </motion.div>
            );
          } else {
            // Glow or Dark feedback over character
            return (
              <div key={effect.id} className="fixed pointer-events-none z-0" style={{ left: effect.x, top: effect.y, transform: 'translate(-50%, -50%)' }}>
                <div className={`w-32 h-32 ${effect.type === 'glow' ? 'animate-ripple-gold' : 'animate-ripple-purple'} rounded-full`} />
              </div>
            );
          }
        })}
      </AnimatePresence>

      {/* 錄製紀錄氣泡選單 */}
      <AnimatePresence>
        {activeMenu && activeMenu !== 'medical' && (
          <RecordMenu
            module={activeMenu as ActivityModule}
            onClose={() => { setActiveMenu(null); setEditingRecord(null); }}
            onSubmit={(data) => { handleRecordSubmit(data); setEditingRecord(null); }}
            initialData={editingRecord}
          />
        )}
        {activeMenu === 'medical' && (
          <MedicalRecordMenu
            onClose={() => { setActiveMenu(null); setEditingRecord(null); }}
            onSubmit={(data) => { handleRecordSubmit(data); setEditingRecord(null); }}
            initialData={editingRecord}
          />
        )}
      </AnimatePresence>

      {/* 重置確認彈窗 */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="glass-card bg-white w-full max-w-sm rounded-[2rem] p-6 text-center shadow-xl border border-white/60"
            >
              <h3 className="text-xl font-black text-neutral-800 mb-2">確認重置</h3>
              <p className="text-sm font-bold text-neutral-500 mb-6">確定要清除所有紀錄並重新開始嗎？<br/>這個動作無法復原喔！</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleResetAll}
                  className="flex-1 py-3 rounded-xl font-bold bg-red-400 text-white hover:bg-red-500 shadow-md shadow-red-200 transition-colors"
                >
                  確認重置
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function ActionBtn({ 
  icon, 
  title, 
  xpText, 
  onClick
}: { 
  icon: string; 
  title: string; 
  xpText: string; 
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-card flex flex-col items-center justify-center p-1 py-1 md:py-1.5 rounded-lg transition-all gap-0.5 hover:bg-white/80 border border-white/50 min-h-[48px]"
    >
      <span className="text-xl md:text-2xl drop-shadow-sm">{icon}</span>
      <span className="text-[9px] md:text-[10px] font-black text-[#666] tracking-wide whitespace-nowrap">{title}</span>
      <span className="text-[7px] md:text-[8px] font-bold text-[#888] bg-white/60 px-1 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">{xpText}</span>
    </motion.button>
  );
}

function NavBtn({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-[72px] h-full transition-all duration-300 relative ${active ? 'text-pastel-purple' : 'text-[#a1a1aa] hover:text-[#888]'}`}
    >
      <div className={`relative z-10 flex flex-col items-center gap-1 ${active ? '-translate-y-[2px]' : ''} transition-transform duration-300`}>
        {icon}
        <span className={`text-[9.5px] font-black tracking-widest ${active ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>{label}</span>
      </div>
      {active && (
        <motion.div layoutId="nav-indicator" className="absolute top-1 bottom-1 w-[60px] bg-pastel-purple/15 rounded-xl border border-white/50 backdrop-blur-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
      )}
    </button>
  );
}


