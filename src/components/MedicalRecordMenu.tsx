import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MedicalRecordMenuProps {
  onClose: () => void;
  onSubmit: (data: { id?: string, action: string, detail: string, alphaGain: number, xpGain: number, targetTimestamp?: number, temperature?: number, treatments?: string[], symptoms?: string[], note?: string }) => void;
  initialData?: any; // any to avoid Activity cyclic import or we can define it inline
}

const SYMPTOMS = ['咳嗽', '流鼻水', '鼻塞', '有痰', '嘔吐', '腹瀉', '出疹子', '活動力下降'];
const TREATMENTS = ['一般感冒藥', '退燒藥水', '退燒塞劑', '抗生素', '物理處置 (吸鼻涕/拍痰)'];

export function MedicalRecordMenu({ onClose, onSubmit, initialData }: MedicalRecordMenuProps) {
  const [errorMsg, setErrorMsg] = useState('');
  const [logTime, setLogTime] = useState(() => {
    if (initialData?.timestamp) {
       const d = new Date(initialData.timestamp);
       return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
  const [temperature, setTemperature] = useState(initialData?.temperature?.toString() || '');
  const [symptoms, setSymptoms] = useState<string[]>(initialData?.symptoms || []);
  const [treatments, setTreatments] = useState<string[]>(initialData?.treatments || []);
  const [note, setNote] = useState(initialData?.note || '');

  const toggleSelection = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
       setList(list.filter(i => i !== item));
    } else {
       setList([...list, item]);
    }
  };

  const getTargetTimestamp = () => {
     const now = new Date();
     const [h, m] = logTime.split(':').map(Number);
     if (!isNaN(h) && !isNaN(m)) {
        now.setHours(h, m, 0, 0);
     }
     return now.getTime();
  };

  const handleSelectBehavior = (action: string, alphaGain: number, xpGain: number) => {
    if (!temperature) {
      setErrorMsg('紀錄醫療時，強制要填寫體溫才能送出');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    let baseDetails = [];
    if (temperature) {
      const tempNum = parseFloat(temperature);
      baseDetails.push(tempNum > 38 ? `🔥體溫: ${temperature}°C` : `體溫: ${temperature}°C`);
    }
    if (symptoms.length > 0) baseDetails.push(`症狀: ${symptoms.join(', ')}`);
    if (treatments.length > 0) baseDetails.push(`處置: ${treatments.join(', ')}`);
    if (note) baseDetails.push(`備註: ${note}`);

    onSubmit({
      id: initialData?.id,
      action: `[醫療] ${action}`,
      detail: baseDetails.join(' | '),
      alphaGain: initialData?.alphaGain || alphaGain, // optionally retain old alphaGain or let user pick a new one, but for edit maybe we just use the new action
      xpGain: initialData?.xpGain || xpGain,
      targetTimestamp: getTargetTimestamp(),
      temperature: temperature ? parseFloat(temperature) : undefined,
      treatments: treatments.length > 0 ? treatments : undefined,
      symptoms: symptoms.length > 0 ? symptoms : undefined,
      note: note || undefined
    });
    onClose();
  };

  const isFever = parseFloat(temperature) > 38;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm max-h-[90vh] overflow-y-auto glass-card bg-white/90 p-5 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-1 sticky top-0 bg-white/90 pb-2 z-10 backdrop-blur-sm -mt-1 pt-1">
           <h3 className="text-xl font-black text-rose-500 tracking-wider flex items-center gap-2">
             🏥 生病與用藥紀錄
           </h3>
           <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-full text-neutral-500 font-bold hover:bg-neutral-200 transition-colors">✕</button>
        </div>

        {/* 時間 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-500 px-1">精準時間</label>
          <input
            type="time"
            value={logTime}
            onChange={(e) => setLogTime(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-2.5 font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-rose-200 transition-all border border-neutral-200 shadow-sm text-sm"
          />
        </div>

        {/* 體溫 */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-bold text-neutral-500 px-1">體溫 (°C)</label>
          <input
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="例: 36.5"
            className={`w-full bg-white rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-2 transition-all border shadow-sm text-sm ${isFever ? 'text-red-600 border-red-300 focus:ring-red-200 bg-red-50' : 'text-neutral-700 border-neutral-200 focus:ring-rose-200'}`}
          />
        </div>

        {/* 症狀 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-neutral-500 px-1">症狀 (多選)</label>
          <div className="flex flex-wrap gap-1.5">
            {SYMPTOMS.map(s => (
              <button
                key={s}
                onClick={() => toggleSelection(symptoms, setSymptoms, s)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors border shadow-sm ${symptoms.includes(s) ? 'bg-rose-500 text-white border-rose-600' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-rose-50'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 處置/用藥 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-neutral-500 px-1">處置與用藥 (多選)</label>
          <div className="flex flex-col gap-1.5">
            {TREATMENTS.map(t => {
              const isSelected = treatments.includes(t);
              const isAntibiotic = t.includes('抗生素');
              return (
                <button
                  key={t}
                  onClick={() => toggleSelection(treatments, setTreatments, t)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors border shadow-sm flex items-center justify-between ${isSelected ? (isAntibiotic ? 'bg-orange-500 text-white border-orange-600' : 'bg-blue-500 text-white border-blue-600') : 'bg-white text-neutral-600 border-neutral-200 hover:bg-blue-50'}`}
                >
                  <span>{t}</span>
                  {isSelected && <span>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 備註 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-500 px-1">備註紀錄</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="補充說明..."
            className="w-full bg-white rounded-xl px-4 py-2.5 font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-rose-200 transition-all border border-neutral-200 shadow-sm text-sm"
          />
        </div>

        {/* 行為判定 (提交) */}
        <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-neutral-100">
          <label className="text-xs font-black text-neutral-500 px-1 text-center mb-1">寶寶配合度 (點擊完成紀錄)</label>
          
          <button
            onClick={() => handleSelectBehavior('單純紀錄 (無用藥/無掙扎)', 0, 5)}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-2.5 rounded-xl border border-slate-200 transition-colors shadow-sm flex justify-between items-center mb-1"
          >
            <span className="font-bold text-sm">📝 快速單純紀錄</span>
            <div className="flex gap-1 text-[10px] opacity-80 font-black">
               <span>+0α</span><span>+5XP</span>
            </div>
          </button>
          
          <button
            onClick={() => handleSelectBehavior('勇敢小戰士', 15, 30)}
            className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-3 rounded-xl border border-yellow-200 transition-colors shadow-sm flex justify-between items-center"
          >
            <span className="font-bold text-sm">👼 勇敢小戰士 (乖乖吞藥/配合)</span>
            <div className="flex gap-1 text-[10px] opacity-80 font-black">
              <span>+15α</span>
              <span>+30XP</span>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => handleSelectBehavior('吐藥大魔王', -15, 20)}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-2.5 rounded-xl border border-purple-200 transition-colors shadow-sm flex flex-col justify-center items-center gap-1"
            >
              <span className="font-bold text-xs text-center leading-tight">👿 吐藥大魔王<br/><span className="text-[10px] font-normal opacity-80">(瘋狂掙扎)</span></span>
              <div className="flex gap-1 text-[10px] opacity-80 font-black">
                <span>-15α</span>
                <span>+20XP</span>
              </div>
            </button>

            <button
              onClick={() => handleSelectBehavior('崩潰不配合', -20, 20)}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-2.5 rounded-xl border border-purple-200 transition-colors shadow-sm flex flex-col justify-center items-center gap-1"
            >
              <span className="font-bold text-xs text-center leading-tight">👿 崩潰不配合<br/><span className="text-[10px] font-normal opacity-80">(完全拒絕)</span></span>
              <div className="flex gap-1 text-[10px] opacity-80 font-black">
                <span>-20α</span>
                <span>+20XP</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(244,63,94,0.4)] flex items-center justify-center pointer-events-none w-max max-w-[80vw]"
          >
            <span className="font-extrabold text-[15px]">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
