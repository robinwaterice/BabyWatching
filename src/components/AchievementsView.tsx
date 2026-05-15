import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BADGE_DEFS, BadgeDef } from '../constants/badges';

interface AchievementsViewProps {
  unlockedBadges: Record<string, number>;
  onUnlockBadge: (badgeId: string) => void;
  babyBirthday: string;
}

function getAgeString(birthday: string, timestamp: number) {
  if (!birthday) return '';
  const birthDate = new Date(birthday);
  const eventDate = new Date(timestamp);
  
  let months = (eventDate.getFullYear() - birthDate.getFullYear()) * 12 + eventDate.getMonth() - birthDate.getMonth();
  let days = eventDate.getDate() - birthDate.getDate();
  
  if (days < 0) {
      months--;
      const prevMonth = new Date(eventDate.getFullYear(), eventDate.getMonth(), 0);
      days += prevMonth.getDate();
  }
  
  if (months < 0) return '尚未出生';
  if (months === 0 && days === 0) return '出生當天';
  
  let res = '';
  if (months >= 12) {
      res += `${Math.floor(months / 12)}歲`;
      months = months % 12;
  }
  if (months > 0) res += `${months}個月`;
  if (days > 0) res += `${days}天`;
  return res;
}

export function AchievementsView({ unlockedBadges, onUnlockBadge, babyBirthday }: AchievementsViewProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeDef | null>(null);

  const classicBadges = BADGE_DEFS.filter(b => b.type === 'classic');
  const hiddenBadges = BADGE_DEFS.filter(b => b.type !== 'classic');

  function getBabyMonths(birthday: string) {
    if (!birthday) return 0;
    const b = new Date(birthday);
    const t = new Date();
    const months = (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth());
    const days = t.getDate() - b.getDate();
    return months + (days / 30);
  }

  const currentMonths = getBabyMonths(babyBirthday);

  const handleBadgeClick = (badge: BadgeDef) => {
    if (badge.type === 'classic' && !unlockedBadges[badge.id]) {
      setSelectedBadge(badge);
    }
  };

  const confirmUnlock = () => {
    if (selectedBadge) {
      onUnlockBadge(selectedBadge.id);
      setSelectedBadge(null);
    }
  };

  return (
    <motion.div
      key="achievements"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto max-w-md mx-auto relative pb-20"
    >
      <h2 className="text-xl font-black text-neutral-700 mb-6 tracking-wider self-center text-shadow-sm mt-2">🏆 成長里程碑與成就</h2>

      {/* 經典主線成就 */}
      <section className="mb-8">
        <h3 className="text-sm font-black text-neutral-600 mb-4 px-2 tracking-widest flex items-center gap-2">
          <span className="text-yellow-500">🌟</span> 經典主線成就
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {classicBadges.map(badge => {
            const isUnlocked = !!unlockedBadges[badge.id];
            const ageStr = isUnlocked ? getAgeString(babyBirthday, unlockedBadges[badge.id]) : '';
            const inRange = !isUnlocked && badge.startMonth !== undefined && currentMonths >= badge.startMonth;
            
            return (
              <motion.button
                key={badge.id}
                whileHover={!isUnlocked ? { scale: 1.05 } : {}}
                whileTap={!isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => handleBadgeClick(badge)}
                className={`p-4 rounded-[1.5rem] border flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 ${
                  isUnlocked 
                    ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-yellow-200' 
                    : inRange ? 'bg-yellow-50/70 border-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.3)] animate-pulse'
                    : 'glass-card border-white/50 bg-white/40 grayscale opacity-70'
                }`}
              >
                {isUnlocked && <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-transparent" />}
                
                <span className={`text-4xl drop-shadow-sm mb-2 relative z-10 ${!isUnlocked && 'opacity-60'}`}>{badge.icon}</span>
                <span className="font-extrabold text-[#555] text-xs relative z-10">{badge.title}</span>
                
                {isUnlocked ? (
                  ageStr ? <span className="text-[9px] font-bold text-yellow-600 mt-1 relative z-10 bg-yellow-100/50 px-2 rounded-full">{ageStr}解鎖</span> : <span className="text-[9px] font-bold text-yellow-600 mt-1 relative z-10">已解鎖</span>
                ) : (
                  <span className="text-[9px] font-extrabold text-neutral-400 mt-1 relative z-10 flex border-t border-neutral-300 mt-2 pt-1 uppercase w-full justify-center">
                    {badge.startMonth !== undefined ? `滿 ${badge.startMonth} 個月起` : '點擊解鎖'}
                  </span>
                )}
                
                {inRange && <div className="absolute top-2 right-2 text-[9px] font-bold text-yellow-600 bg-yellow-100 rounded-full px-1.5 py-0.5 animate-bounce shadow-sm">觀察中</div>}
                {!isUnlocked && !inRange && <div className="absolute top-2 right-2 text-xs opacity-40">🔒</div>}
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* 隱藏版成就 */}
      <section className="mb-4">
         <h3 className="text-sm font-black text-neutral-600 mb-4 px-2 tracking-widest flex items-center gap-2">
          <span className="text-pastel-purple">🎭</span> 隱藏彩蛋成就
          <span className="text-[10px] text-neutral-400 font-bold ml-auto bg-white/60 px-2 py-0.5 rounded-full">自動觸發</span>
         </h3>
         <div className="flex flex-col gap-3">
           {hiddenBadges.map(badge => {
             const isUnlocked = !!unlockedBadges[badge.id];
             const isAngel = badge.type === 'hidden_angel';
             const isNeutral = badge.type === 'hidden_neutral';
             
             if (!isUnlocked) {
               return (
                  <div key={badge.id} className="glass-card p-4 rounded-xl flex items-center gap-4 border border-white/50 shadow-sm bg-white/40 opacity-80">
                    <div className="w-12 h-12 rounded-full bg-neutral-200/50 flex items-center justify-center text-xl text-neutral-400 font-black border border-neutral-300/50 shadow-inner">?</div>
                    <div className="flex flex-col">
                       <span className="font-extrabold text-neutral-500 text-sm">???</span>
                       <span className="text-[10px] text-neutral-400 font-bold mt-0.5">達成隱藏條件自動解鎖</span>
                    </div>
                  </div>
               );
             }

             return (
                <motion.div 
                  initial={{opacity:0, scale:0.95}} 
                  animate={{opacity:1, scale:1}} 
                  key={badge.id} 
                  className={`glass-card p-4 rounded-xl flex items-center gap-4 border shadow-sm relative overflow-hidden bg-white/80 ${
                    isAngel ? 'border-yellow-200' : isNeutral ? 'border-blue-200' : 'border-purple-200'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r transition-colors ${
                    isAngel ? 'from-yellow-300/10 to-transparent' : isNeutral ? 'from-blue-300/10 to-transparent' : 'from-purple-300/10 to-transparent'
                  }`} />
                  <div className="text-3xl relative z-10 drop-shadow-md w-12 text-center">{badge.icon}</div>
                  <div className="flex flex-col relative z-10">
                     <div className={`text-[10px] font-extrabold mb-0.5 tracking-wider ${isAngel ? 'text-yellow-600' : isNeutral ? 'text-blue-600' : 'text-purple-600'}`}>
                       {isAngel ? '👼 天使隱藏成就' : isNeutral ? '🚀 神秘隱藏成就' : '👿 惡魔隱藏成就'}
                     </div>
                     <div className="font-black text-neutral-700 text-[15px] mb-0.5">{badge.title}</div>
                     <div className="font-bold text-neutral-500 text-[11px] leading-tight">{badge.description}</div>
                  </div>
                </motion.div>
             )
           })}
         </div>
      </section>

      {/* 解鎖確認彈窗 */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/20 backdrop-blur-sm"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="glass-card bg-white/90 w-full max-w-xs rounded-[2rem] p-6 text-center shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white"
            >
              <div className="text-5xl drop-shadow-md mb-4">{selectedBadge.icon}</div>
              <h3 className="text-lg font-black text-neutral-800 mb-1">{selectedBadge.title}</h3>
              <p className="text-xs font-bold text-neutral-500 mb-6">{selectedBadge.description}</p>
              
              <div className="bg-yellow-50 text-yellow-600 text-[11px] font-black rounded-lg px-3 py-1.5 mb-6 inline-flex border border-yellow-100">
                獎勵 +{selectedBadge.xpReward} XP
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="flex-1 py-3 rounded-xl font-bold bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmUnlock}
                  className="flex-[1.5] py-3 rounded-xl font-bold bg-pastel-yellow text-white hover:bg-yellow-400 shadow-md shadow-yellow-200/50 transition-colors"
                >
                  確認解鎖徽章
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
