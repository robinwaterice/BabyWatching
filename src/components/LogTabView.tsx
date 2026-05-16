import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer } from 'recharts';

export interface Activity {
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

export function LogTabView({ activityLog, onDelete, onEdit }: { activityLog: Activity[], onDelete: (id: string) => void, onEdit: (log: Activity) => void }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const filterOptions = useMemo(() => [
    { label: '飲食', id: 'feeding', icon: '🍼', color: '#fcd34d', classBg: 'bg-yellow-100', classText: 'text-yellow-600', classBorder: 'border-yellow-300' },
    { label: '嗯嗯', id: 'diaper', icon: '💩', color: '#78350f', classBg: 'bg-amber-100', classText: 'text-amber-900', classBorder: 'border-amber-300' },
    { label: '睡眠', id: 'sleep', icon: '💤', color: '#6ee7b7', classBg: 'bg-emerald-100', classText: 'text-emerald-600', classBorder: 'border-emerald-300' },
    { label: '日常', id: 'mood', icon: '💖', color: '#fca5a5', classBg: 'bg-red-100', classText: 'text-red-600', classBorder: 'border-red-300' },
    { label: '醫療', id: 'medical', icon: '🏥', color: '#f43f5e', classBg: 'bg-rose-100', classText: 'text-rose-600', classBorder: 'border-rose-300' },
  ], []);

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

  // 1. Memoize processed logs
  const processedLogs = useMemo(() => {
    const getModuleForLog = (log: Activity) => {
      if (log.module) return log.module;
      if (['餵奶'].includes(log.action)) return 'feeding';
      if (['噴屎'].includes(log.action)) return 'diaper';
      if (['睡覺'].includes(log.action)) return 'sleep';
      return 'mood';
    };

    return activityLog.map(log => {
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
  }, [activityLog]);

  // 2. Memoize last 7 days strings
  const last7Days = useMemo(() => {
    return Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return `${d.getMonth()+1}/${d.getDate()}`;
    });
  }, []); // Only compute once on mount or when clock changes significantly, but this is fine

  // 3. Memoize chart data calculations
  const { chartData, maxTotal } = useMemo(() => {
    const data = last7Days.map(dateStr => {
      const logsOnDate = processedLogs.filter(l => l.dateStr === dateStr);
      const counts: Record<string, number> = {};
      filterOptions.forEach(f => counts[f.id] = 0);
      
      logsOnDate.forEach(log => {
        if (log._module && counts[log._module] !== undefined) {
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
    const maxVal = Math.max(...data.map(d => d.totalActive), 5);
    return { chartData: data, maxTotal: maxVal };
  }, [last7Days, processedLogs, filterOptions, activeFilters]);

  const todayStr = last7Days[6];

  // 4. Memoize details list
  const detailsData = useMemo(() => {
    return selectedDate 
      ? processedLogs.filter(l => l.dateStr === selectedDate && (activeFilters.length === 0 || l._module && activeFilters.includes(l._module)))
      : processedLogs.filter(l => activeFilters.length === 0 || (l._module && activeFilters.includes(l._module)));
  }, [selectedDate, processedLogs, activeFilters]);

  const showMedicalChart = activeFilters.includes('medical');

  // 5. Memoize fever data chart
  const feverData = useMemo(() => {
    return processedLogs
      .filter(l => l.temperature)
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
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
  }, [processedLogs]);

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
