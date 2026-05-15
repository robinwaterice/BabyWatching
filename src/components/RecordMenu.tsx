import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type ActivityModule = 'feeding' | 'diaper' | 'sleep' | 'mood';

interface RecordMenuProps {
  module: ActivityModule;
  onClose: () => void;
  onSubmit: (data: { id?: string, action: string, detail: string, alphaGain: number, xpGain: number, targetTimestamp?: number }) => void;
  initialData?: any;
}

export function RecordMenu({ module, onClose, onSubmit, initialData }: RecordMenuProps) {
  const [value, setValue] = useState(initialData?.detail || '');
  const [logTime, setLogTime] = useState(() => {
    if (initialData?.timestamp) {
       const d = new Date(initialData.timestamp);
       return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
  
  const getModuleConfig = () => {
    switch (module) {
      case 'feeding':
        return {
          title: '🍼 飲食紀錄',
          placeholder: '輸入 ml 數或內容 (例如: 120ml)',
          angels: [
            { label: '順利完食', alpha: 10, xp: 20 },
            { label: '完美拍嗝', alpha: 15, xp: 25 },
          ],
          demons: [
            { label: '溢奶/吐奶', alpha: -10, xp: 15 },
            { label: '狂躁拒食', alpha: -15, xp: 20 },
          ]
        };
      case 'diaper':
        return {
          title: '💩 嗯嗯紀錄',
          placeholder: '輸入狀況 (例如: 尿尿 / 便便)',
          angels: [
            { label: '黃金軟便', alpha: 15, xp: 25 },
            { label: '順暢無比', alpha: 10, xp: 20 },
          ],
          demons: [
            { label: '炸屎大魔王', alpha: -20, xp: 30 },
            { label: '羊便便/便秘', alpha: -10, xp: 15 },
            { label: '紅屁屁', alpha: -15, xp: 20 },
          ]
        };
      case 'sleep':
        return {
          title: '💤 睡眠紀錄',
          placeholder: '輸入睡眠時長 (例如: 2.5小時)',
          angels: [
            { label: '天使秒睡', alpha: 20, xp: 30 },
            { label: '安穩長睡', alpha: 25, xp: 40 },
          ],
          demons: [
            { label: '落地醒', alpha: -15, xp: 20 },
            { label: '半夜驚啼', alpha: -20, xp: 30 },
            { label: '哄睡地獄', alpha: -25, xp: 35 },
          ]
        };
      case 'mood':
        return {
          title: '💖 日常狀態',
          placeholder: '輸入溫度或備註 (例如: 36.5度)',
          angels: [
            { label: '咯咯大笑', alpha: 15, xp: 25 },
            { label: '自主玩耍', alpha: 20, xp: 30 },
          ],
          demons: [
            { label: '不明哭鬧', alpha: -15, xp: 20 },
            { label: '酷熱發燒', alpha: -25, xp: 30 },
            { label: '打針暴哭', alpha: -10, xp: 15 },
          ]
        };
    }
  };

  const config = getModuleConfig();

  const getTargetTimestamp = () => {
     const now = new Date();
     const [h, m] = logTime.split(':').map(Number);
     if (!isNaN(h) && !isNaN(m)) {
        now.setHours(h, m, 0, 0);
     }
     return now.getTime();
  };

  const handleSelect = (action: string, alphaGain: number, xpGain: number) => {
    onSubmit({ 
      id: initialData?.id,
      action: initialData ? action : action, // keep simple
      detail: value, 
      alphaGain: initialData?.alphaGain || alphaGain, 
      xpGain: initialData?.xpGain || xpGain,
      targetTimestamp: getTargetTimestamp()
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm glass-card bg-white/70 p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-xl font-black text-neutral-700 tracking-wider">
             {config.title}
           </h3>
           <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white/50 rounded-full text-neutral-500 font-bold hover:bg-white/80 transition-colors">✕</button>
        </div>

        {/* 時間 */}
        <div className="flex flex-col gap-1.5 -mt-2">
          <label className="text-xs font-bold text-neutral-500 px-1">精準時間</label>
          <input
            type="time"
            value={logTime}
            onChange={(e) => setLogTime(e.target.value)}
            className="w-full bg-white/90 rounded-2xl px-4 py-3 font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-pastel-pink/50 transition-all border border-white shadow-inner text-sm mb-1"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-500 px-1">{config.title.split(' ')[1]}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={config.placeholder}
            className="w-full bg-white/90 rounded-2xl px-4 py-3 font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-pastel-pink/50 transition-all border border-white shadow-inner text-sm mb-2"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-yellow-50/50 p-3 rounded-2xl border border-yellow-100/50">
            <h4 className="text-xs font-black text-yellow-600 mb-2 px-1">👼 天使行為 (+α)</h4>
            <div className="grid grid-cols-2 gap-2">
              {config.angels.map(item => (
                <button
                  key={item.label}
                  onClick={() => handleSelect(item.label, item.alpha, item.xp)}
                  className="bg-white hover:bg-yellow-50 text-neutral-600 text-[11px] font-bold py-2 px-2 rounded-xl border border-yellow-200 transition-colors shadow-sm flex flex-col justify-center items-center gap-0.5"
                >
                  <span className="text-neutral-700">{item.label}</span>
                  <div className="flex gap-1 text-[9px] text-[#888]">
                    <span className="text-yellow-600">+{item.alpha}α</span>
                    <span>+{item.xp}XP</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100/50">
            <h4 className="text-xs font-black text-purple-600 mb-2 px-1">👿 惡魔行為 (-α)</h4>
            <div className="grid grid-cols-2 gap-2">
              {config.demons.map(item => (
                <button
                  key={item.label}
                  onClick={() => handleSelect(item.label, item.alpha, item.xp)}
                  className="bg-white hover:bg-purple-50 text-neutral-600 text-[11px] font-bold py-2 px-2 rounded-xl border border-purple-200 transition-colors shadow-sm flex flex-col justify-center items-center gap-0.5"
                >
                  <span className="text-neutral-700">{item.label}</span>
                  <div className="flex gap-1 text-[9px] text-[#888]">
                    <span className="text-purple-600">{item.alpha}α</span>
                    <span>+{item.xp}XP</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
