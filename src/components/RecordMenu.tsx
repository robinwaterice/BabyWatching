import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type ActivityModule = 'feeding' | 'diaper' | 'sleep' | 'mood';

interface RecordMenuProps {
  module: ActivityModule;
  onClose: () => void;
  onSubmit: (data: { id?: string, action: string, detail: string, alphaGain: number, xpGain: number, targetTimestamp?: number }) => void;
  initialData?: any;
  ageGroup?: string;
}

const renderLabelText = (label: string) => {
  // 1. 如果包含括號，分拆為括號前後
  if (label.includes(' (')) {
    const idx = label.indexOf(' (');
    return (
      <div className="flex flex-col items-center leading-none">
        <span className="text-neutral-700 font-bold text-center text-[11px]">{label.substring(0, idx)}</span>
        <span className="text-neutral-500 font-bold text-[9px] text-center mt-1">{label.substring(idx).trim()}</span>
      </div>
    );
  }
  if (label.includes('(') && label.endsWith(')')) {
    const idx = label.indexOf('(');
    return (
      <div className="flex flex-col items-center leading-none">
        <span className="text-neutral-700 font-bold text-center text-[11px]">{label.substring(0, idx)}</span>
        <span className="text-neutral-500 font-bold text-[9px] text-center mt-1">{label.substring(idx)}</span>
      </div>
    );
  }
  // 2. 如果包含斜線，分拆為斜線前後
  if (label.includes('/')) {
    const parts = label.split('/');
    return (
      <div className="flex flex-col items-center leading-none">
        <span className="text-neutral-700 font-bold text-center text-[11px]">{parts[0]}</span>
        <span className="text-neutral-500 font-bold text-[9px] text-center mt-1">/{parts[1]}</span>
      </div>
    );
  }
  // 3. 如果包含空格且不帶括號，分拆為空格前後
  if (label.includes(' ')) {
    const parts = label.split(' ');
    return (
      <div className="flex flex-col items-center leading-none">
        <span className="text-neutral-700 font-bold text-center text-[11px]">{parts[0]}</span>
        <span className="text-neutral-500 font-bold text-[9px] text-center mt-1">{parts.slice(1).join(' ')}</span>
      </div>
    );
  }
  // 4. 其他字數長度大於 6，則對半折行
  if (label.length > 6) {
    const mid = Math.ceil(label.length / 2);
    return (
      <div className="flex flex-col items-center leading-none">
        <span className="text-neutral-700 font-bold text-center text-[11px]">{label.substring(0, mid)}</span>
        <span className="text-neutral-700 font-bold text-center text-[11px] mt-1">{label.substring(mid)}</span>
      </div>
    );
  }
  
  return <span className="text-neutral-700 font-bold text-center text-[11px]">{label}</span>;
};

export function RecordMenu({ module, onClose, onSubmit, initialData, ageGroup }: RecordMenuProps) {
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
    const is1to2 = ageGroup === '1to2';
    const is2to5 = ageGroup === '2to5';
    switch (module) {
      case 'feeding':
        return {
          title: '🍼 飲食紀錄',
          placeholder: '輸入 ml 數或內容 (例如: 120ml)',
          angels: is2to5 ? [
            { label: '自己把飯吃光光', alpha: 10, xp: 20 },
            { label: '乖乖坐在餐椅上', alpha: 15, xp: 25 },
            { label: '嘗試不喜歡的蔬菜', alpha: 20, xp: 30 },
            { label: '主動收拾碗筷餐具', alpha: 15, xp: 25 },
          ] : is1to2 ? [
            { label: '順利完食', alpha: 10, xp: 20 },
            { label: '練習用湯匙/叉子吃飯', alpha: 15, xp: 25 },
            { label: '用吸管杯自己喝水', alpha: 15, xp: 25 },
            { label: '嚼嚼吃完副食品', alpha: 10, xp: 20 },
          ] : [
            { label: '順利完食', alpha: 10, xp: 20 },
            { label: '完美拍嗝', alpha: 15, xp: 25 },
            { label: '自主捧奶瓶喝奶', alpha: 15, xp: 25 },
            { label: '嚼嚼吃完副食品', alpha: 10, xp: 20 },
          ],
          demons: is2to5 ? [
            { label: '邊吃邊玩/走來走去', alpha: -15, xp: 20 },
            { label: '大喊我不吃這個拒食', alpha: -10, xp: 15 },
            { label: '挑食只吃零食餅乾', alpha: -15, xp: 20 },
            { label: '打翻湯碗/吐出食物', alpha: -20, xp: 25 },
          ] : is1to2 ? [
            { label: '故意把食物扔到地上 (玩食物)', alpha: -15, xp: 20 },
            { label: '瘋狂搖頭拒食 (緊閉雙唇)', alpha: -10, xp: 15 },
            { label: '搶湯匙把食物當玩具亂抹', alpha: -15, xp: 20 },
            { label: '含著食物不吞大哭大鬧', alpha: -20, xp: 25 },
          ] : [
            { label: '溢奶/吐奶', alpha: -10, xp: 15 },
            { label: '狂躁拒食', alpha: -15, xp: 20 },
            { label: '喝奶睡著拍不醒', alpha: -10, xp: 15 },
            { label: '吃副食品噴得到處都是', alpha: -15, xp: 20 },
          ]
        };
      case 'diaper':
        return {
          title: '💩 嗯嗯紀錄',
          placeholder: '輸入狀況 (例如: 尿尿 / 便便)',
          angels: is2to5 ? [
            { label: '自己穿脫褲子如廁', alpha: 15, xp: 25 },
            { label: '小馬桶上成功便便', alpha: 20, xp: 30 },
            { label: '自己擦屁股跟洗手', alpha: 15, xp: 25 },
            { label: '成功戒掉白天尿布', alpha: 20, xp: 30 },
          ] : is1to2 ? [
            { label: '主動指著尿布示意濕了', alpha: 15, xp: 25 },
            { label: '小馬桶上成功便便 (如廁訓練)', alpha: 20, xp: 30 },
            { label: '換尿布時乖乖躺好配合', alpha: 15, xp: 25 },
            { label: '便便後會說「臭臭」求換', alpha: 20, xp: 30 },
          ] : [
            { label: '黃金軟便', alpha: 15, xp: 25 },
            { label: '順暢無比', alpha: 10, xp: 20 },
            { label: '換乾淨尿布咯咯笑', alpha: 10, xp: 20 },
            { label: '嗯嗯時間規律不折騰', alpha: 15, xp: 25 },
          ],
          demons: is2to5 ? [
            { label: '玩得太開心尿濕褲子', alpha: -15, xp: 20 },
            { label: '大便在內褲上不敢說', alpha: -20, xp: 25 },
            { label: '憋尿憋大便抗拒馬桶', alpha: -15, xp: 20 },
            { label: '洗手玩水浴室全弄濕', alpha: -10, xp: 15 },
          ] : is1to2 ? [
            { label: '換尿布時翻滾逃跑 (泥鰍寶寶)', alpha: -15, xp: 20 },
            { label: '故意伸手摸髒尿布', alpha: -20, xp: 25 },
            { label: '拒絕坐在小馬桶上大哭', alpha: -15, xp: 20 },
            { label: '邊爬邊尿尿/便便在地上', alpha: -25, xp: 30 },
          ] : [
            { label: '炸屎大魔王', alpha: -20, xp: 30 },
            { label: '羊便便/便秘', alpha: -10, xp: 15 },
            { label: '紅屁屁', alpha: -15, xp: 20 },
            { label: '洗屁屁時瘋狂蹬腿反抗', alpha: -10, xp: 15 },
          ]
        };
      case 'sleep':
        return {
          title: '💤 睡眠紀錄',
          placeholder: '輸入睡眠時長 (例如: 2.5小時)',
          angels: is2to5 ? [
            { label: '準時自主上床睡覺', alpha: 15, xp: 25 },
            { label: '自己蓋被子乖乖閉眼', alpha: 20, xp: 30 },
            { label: '一覺到天亮無夜驚', alpha: 25, xp: 40 },
            { label: '醒來自己穿好衣服', alpha: 15, xp: 25 },
          ] : is1to2 ? [
            { label: '抱著玩偶自己入睡 (獨立安撫)', alpha: 20, xp: 30 },
            { label: '一覺到天亮 (超長安穩睡眠)', alpha: 25, xp: 40 },
            { label: '時間到主動走到床邊', alpha: 20, xp: 30 },
            { label: '睡醒自己乖乖下床找爸媽', alpha: 15, xp: 25 },
          ] : [
            { label: '天使秒睡', alpha: 20, xp: 30 },
            { label: '安穩長睡', alpha: 25, xp: 40 },
            { label: '聽搖籃曲安靜入睡', alpha: 15, xp: 25 },
            { label: '醒來不哭鬧自己吃手手', alpha: 20, xp: 30 },
          ],
          demons: is2to5 ? [
            { label: '找各種藉口不睡討抱', alpha: -15, xp: 20 },
            { label: '噩夢驚醒大哭難安撫', alpha: -20, xp: 30 },
            { label: '半夜爬到爸媽床上擠人', alpha: -15, xp: 20 },
            { label: '抗拒午睡搞得傍晚崩潰', alpha: -20, xp: 25 },
          ] : is1to2 ? [
            { label: '精力旺盛床上彈跳/拒絕躺下', alpha: -15, xp: 20 },
            { label: '半夜醒來要求抱抱 (午夜DJ)', alpha: -20, xp: 30 },
            { label: '睡前半小時瘋狂揉眼崩潰', alpha: -15, xp: 20 },
            { label: '只要爸媽哄/換人就尖叫', alpha: -20, xp: 25 },
          ] : [
            { label: '落地醒', alpha: -15, xp: 20 },
            { label: '半夜驚啼', alpha: -20, xp: 30 },
            { label: '哄睡地獄', alpha: -25, xp: 35 },
            { label: '抱睡一放就哭 (樹懶寶寶)', alpha: -20, xp: 25 },
          ]
        };
      case 'mood':
        return {
          title: '💖 日常狀態',
          placeholder: '輸入溫度或備註 (例如: 36.5度)',
          angels: is2to5 ? [
            { label: '跟朋友手牽手分享玩具', alpha: 15, xp: 25 },
            { label: '跌倒自己拍拍站起來', alpha: 20, xp: 30 },
            { label: '完整句子表達心情/說故事', alpha: 20, xp: 30 },
            { label: '乖乖排隊輪流玩溜滑梯', alpha: 15, xp: 25 },
          ] : is1to2 ? [
            { label: '揮手拜拜/飛吻送愛心', alpha: 15, xp: 25 },
            { label: '模仿大人拿抹布掃把 (小幫手)', alpha: 20, xp: 30 },
            { label: '聽懂指令幫忙拿取東西', alpha: 15, xp: 25 },
            { label: '分享玩具/拍拍肩膀安慰人', alpha: 20, xp: 30 },
          ] : [
            { label: '咯咯大笑', alpha: 15, xp: 25 },
            { label: '自主玩耍', alpha: 20, xp: 30 },
            { label: '趴著抬頭練習順暢', alpha: 15, xp: 25 },
            { label: '逗弄時展現大大的微笑', alpha: 10, xp: 20 },
          ],
          demons: is2to5 ? [
            { label: '狂喊我的搶走所有玩具', alpha: -20, xp: 25 },
            { label: '生氣摔東西/不順心發脾氣', alpha: -15, xp: 20 },
            { label: '大聲尖叫抗拒大人指令', alpha: -20, xp: 30 },
            { label: '哭鬧踢人/用頭撞地板自殘', alpha: -20, xp: 25 },
          ] : is1to2 ? [
            { label: '地上打滾耍賴 (不要不要期)', alpha: -20, xp: 25 },
            { label: '生氣時摔玩具/丟東西', alpha: -15, xp: 20 },
            { label: '搶玩具/動手打人咬人', alpha: -20, xp: 30 },
            { label: '遇到挫折 (積木倒) 尖叫大哭', alpha: -15, xp: 20 },
          ] : [
            { label: '不明哭鬧', alpha: -15, xp: 20 },
            { label: '酷熱發燒', alpha: -25, xp: 30 },
            { label: '打針暴哭', alpha: -10, xp: 15 },
            { label: '猛長期整天掛奶吸吮', alpha: -15, xp: 20 },
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
          <label className="text-[11px] font-black text-yellow-600 dark:text-yellow-400 px-1 flex items-center gap-1 leading-normal tracking-wide">
            <span>💡 溫馨提醒：多加記錄寶貝的日常，更有機會觸發神秘的隱藏成就喔！</span>
          </label>
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
                  {renderLabelText(item.label)}
                  <div className="flex gap-1 text-[9px] text-[#888] mt-0.5">
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
                  {renderLabelText(item.label)}
                  <div className="flex gap-1 text-[9px] text-[#888] mt-0.5">
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
