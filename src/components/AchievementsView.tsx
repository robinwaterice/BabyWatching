import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BADGE_DEFS, BadgeDef } from '../constants/badges';

interface AchievementsViewProps {
  unlockedBadges: Record<string, number>;
  onUnlockBadge: (badgeId: string) => void;
  babyBirthday: string;
  vaccineAppointments?: Record<string, number>;
  setVaccineAppointments?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
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

export function AchievementsView({ unlockedBadges, onUnlockBadge, babyBirthday, vaccineAppointments, setVaccineAppointments }: AchievementsViewProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeDef | null>(null);
  const [activeTab, setActiveTab] = useState<'milestone' | 'vaccine'>('milestone');
  const [ageRange, setAgeRange] = useState<'0-1' | '1-2' | '2-5'>('0-1');

  const filterByAge = (badges: BadgeDef[]) => {
    return badges.filter(badge => {
      const startMonth = badge.startMonth || 0;
      if (ageRange === '0-1') return startMonth < 12;
      if (ageRange === '1-2') return startMonth >= 12 && startMonth < 24;
      if (ageRange === '2-5') return startMonth >= 24;
      return true;
    });
  };

  const filteredClassicBadges = filterByAge(BADGE_DEFS.filter(b => b.type === 'classic'));
  const hiddenBadges = BADGE_DEFS.filter(b => b.type.startsWith('hidden_'));
  const filteredVaccineRequiredBadges = filterByAge(BADGE_DEFS.filter(b => b.type === 'vaccine_required'));
  const filteredVaccineOptionalBadges = filterByAge(BADGE_DEFS.filter(b => b.type === 'vaccine_optional'));

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
    if (!badge.type.startsWith('hidden_') && !unlockedBadges[badge.id]) {
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
      <h2 className="text-xl font-black text-neutral-700 mb-4 tracking-wider self-center text-shadow-sm mt-2">🏆 成就與紀錄</h2>

      {/* 標籤切換 */}
      <div className="flex w-full bg-neutral-100/80 p-1 rounded-2xl mb-4 shadow-inner border border-neutral-200/50">
        <button
          onClick={() => setActiveTab('milestone')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${activeTab === 'milestone' ? 'bg-white text-yellow-600 shadow-sm border border-yellow-100' : 'text-neutral-400 hover:text-neutral-600'}`}
        >
          成長里程碑
        </button>
        <button
          onClick={() => setActiveTab('vaccine')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${activeTab === 'vaccine' ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100' : 'text-neutral-400 hover:text-neutral-600'}`}
        >
          疫苗接種
        </button>
      </div>

      {/* 年齡範圍切換 - 完全同步主分頁樣式 */}
      <div className="flex w-full bg-neutral-100/80 p-1 rounded-2xl mb-6 shadow-inner border border-neutral-200/50">
        {[
          { id: '0-1', label: '0-1歲' },
          { id: '1-2', label: '1-2歲' },
          { id: '2-5', label: '2-5歲' }
        ].map(range => (
          <button
            key={range.id}
            onClick={() => setAgeRange(range.id as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
              ageRange === range.id 
                ? 'bg-white text-neutral-800 shadow-sm border border-neutral-100' 
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'milestone' && (
          <motion.div
            key={`tab-milestone-${ageRange}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 經典主線成就 */}
            <section className="mb-8">
              <h3 className="text-sm font-black text-neutral-600 mb-4 px-2 tracking-widest flex items-center gap-2">
                <span className="text-yellow-500">🌟</span> 經典主線成就 ({ageRange}歲)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {filteredClassicBadges.length > 0 ? filteredClassicBadges.map(badge => {
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
                }) : (
                  <div className="col-span-2 py-10 text-center bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
                    <span className="text-4xl mb-3 block opacity-20">🏗️</span>
                    <p className="text-xs font-bold text-neutral-400">此年齡區段尚無預設成就<br/>開發者正在努力新增中...</p>
                  </div>
                )}
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
          </motion.div>
        )}

        {activeTab === 'vaccine' && (
          <motion.div
            key={`tab-vaccine-${ageRange}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6 text-xs font-bold text-emerald-800 bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <p className="leading-relaxed">
                  以下參照**台灣衛生福利部** {ageRange} 歲幼兒常規疫苗接種時程。請攜帶「兒童健康手冊」與健保卡按時接種，部分項目可能因個人狀況不同，請依醫師評估為主。
                </p>
              </div>
            </div>

            {/* 公費必打疫苗 */}
            <section className="mb-8">
              <h3 className="text-sm font-black text-emerald-600 mb-4 px-2 tracking-widest flex items-center gap-2">
                <span className="text-emerald-500">🛡️</span> 公費常規疫苗 (必打)
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {filteredVaccineRequiredBadges.length > 0 ? filteredVaccineRequiredBadges.map(badge => {
                  const isUnlocked = !!unlockedBadges[badge.id];
                  const targetMonth = badge.startMonth !== undefined ? badge.startMonth - (14 / 30) : undefined;
                  const inRange = !isUnlocked && targetMonth !== undefined && currentMonths >= targetMonth;
                  
                  return (
                    <motion.button
                      key={badge.id}
                      whileHover={!isUnlocked ? { scale: 1.02 } : {}}
                      whileTap={!isUnlocked ? { scale: 0.98 } : {}}
                      onClick={() => handleBadgeClick(badge)}
                      className={`p-4 rounded-2xl border flex items-center text-left relative overflow-hidden transition-all duration-300 ${
                        isUnlocked 
                          ? 'bg-white shadow-sm border-emerald-200' 
                          : inRange ? 'bg-emerald-50/70 border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.2)] animate-pulse'
                          : 'glass-card border-neutral-200 bg-neutral-50/50 opacity-80'
                      }`}
                    >
                      {isUnlocked && <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-transparent pointer-events-none" />}
                      
                      <div className={`text-3xl drop-shadow-sm mr-4 relative z-10 w-12 text-center ${!isUnlocked && 'grayscale opacity-60'}`}>{badge.icon}</div>
                      
                      <div className="flex-1 relative z-10">
                        <div className="flex justify-between items-start mb-1 flex-wrap gap-y-1">
                          <span className={`font-black text-sm ${isUnlocked ? 'text-emerald-800' : 'text-neutral-600'}`}>{badge.title}</span>
                          <div className="flex gap-1 ml-auto shrink-0">
                            {!isUnlocked && vaccineAppointments?.[badge.id] && (
                              <span className="text-[10px] font-bold text-neutral-600 bg-neutral-200 rounded-full px-2 py-0.5 shadow-sm">
                                📅 預約: {new Date(vaccineAppointments[badge.id]).toLocaleDateString()}
                              </span>
                            )}
                            {inRange && <span className="text-[10px] font-bold text-white bg-red-400 rounded-full px-2 py-0.5 animate-bounce shadow-sm">建議接種</span>}
                            {isUnlocked && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 rounded-full px-2 py-0.5">已完成</span>}
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${isUnlocked ? 'text-emerald-600' : 'text-neutral-500'}`}>{badge.description}</span>
                      </div>
                    </motion.button>
                  )
                }) : (
                  <div className="py-8 text-center bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
                    <p className="text-xs font-bold text-neutral-400">此年齡區段尚無必打疫苗資訊</p>
                  </div>
                )}
              </div>
            </section>

            {/* 自費建議疫苗 */}
            <section className="mb-4">
              <h3 className="text-sm font-black text-blue-600 mb-4 px-2 tracking-widest flex items-center gap-2">
                <span className="text-blue-500">💰</span> 自費建議疫苗 (選打)
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {filteredVaccineOptionalBadges.length > 0 ? filteredVaccineOptionalBadges.map(badge => {
                  const isUnlocked = !!unlockedBadges[badge.id];
                  const targetMonth = badge.startMonth !== undefined ? badge.startMonth - (14 / 30) : undefined;
                  const inRange = !isUnlocked && targetMonth !== undefined && currentMonths >= targetMonth;
                  
                  return (
                    <motion.button
                      key={badge.id}
                      whileHover={!isUnlocked ? { scale: 1.02 } : {}}
                      whileTap={!isUnlocked ? { scale: 0.98 } : {}}
                      onClick={() => handleBadgeClick(badge)}
                      className={`p-4 rounded-2xl border flex items-center text-left relative overflow-hidden transition-all duration-300 ${
                        isUnlocked 
                          ? 'bg-white shadow-sm border-blue-200' 
                          : inRange ? 'bg-blue-50/70 border-blue-300 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                          : 'glass-card border-neutral-200 bg-neutral-50/50 opacity-80'
                      }`}
                    >
                      {isUnlocked && <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent pointer-events-none" />}
                      
                      <div className={`text-3xl drop-shadow-sm mr-4 relative z-10 w-12 text-center ${!isUnlocked && 'grayscale opacity-60'}`}>{badge.icon}</div>
                      
                      <div className="flex-1 relative z-10">
                        <div className="flex justify-between items-start mb-1 flex-wrap gap-y-1">
                          <span className={`font-black text-sm ${isUnlocked ? 'text-blue-800' : 'text-neutral-600'}`}>{badge.title}</span>
                          <div className="flex gap-1 ml-auto shrink-0">
                            {!isUnlocked && vaccineAppointments?.[badge.id] && (
                              <span className="text-[10px] font-bold text-neutral-600 bg-neutral-200 rounded-full px-2 py-0.5 shadow-sm">
                                📅 預約: {new Date(vaccineAppointments[badge.id]).toLocaleDateString()}
                              </span>
                            )}
                            {inRange && <span className="text-[10px] font-bold text-blue-500 bg-blue-100 border border-blue-200 rounded-full px-2 py-0.5">可評估</span>}
                            {isUnlocked && <span className="text-[10px] font-bold text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">已接種</span>}
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${isUnlocked ? 'text-blue-600' : 'text-neutral-500'}`}>{badge.description}</span>
                      </div>
                    </motion.button>
                  )
                }) : (
                  <div className="py-8 text-center bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
                    <p className="text-xs font-bold text-neutral-400">此年齡區段尚無自費疫苗建議</p>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

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
              <p className="text-xs font-bold text-neutral-500 mb-4">{selectedBadge.description}</p>
              
              {selectedBadge.type.startsWith('vaccine_') && (
                <div className="mb-4 text-left bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <label className="text-[11px] font-extrabold text-neutral-500 mb-1.5 block">編輯預約日期：</label>
                  <input
                    type="date"
                    className="w-full bg-white rounded-lg px-3 py-2 font-bold text-neutral-700 outline-none border border-neutral-200 text-sm uppercase shadow-sm focus:border-blue-300"
                    value={
                      vaccineAppointments?.[selectedBadge.id] 
                        ? new Date(vaccineAppointments[selectedBadge.id] - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0] 
                        : ""
                    }
                    onChange={(e) => {
                      if (setVaccineAppointments) {
                        const newDate = e.target.value;
                        setVaccineAppointments(prev => {
                          const next = { ...prev };
                          if (newDate) {
                            next[selectedBadge.id] = new Date(newDate).getTime();
                          } else {
                            delete next[selectedBadge.id]; // 允許清除預約
                          }
                          return next;
                        });
                      }
                    }}
                  />
                  <p className="text-[9px] text-neutral-400 mt-1.5 font-bold">預約後，首頁提醒氣泡將會暫時隱藏直到當天</p>
                </div>
              )}
              
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
                  className="flex-[1.5] py-3 rounded-xl font-black bg-pastel-yellow text-yellow-900 hover:bg-yellow-300 shadow-md shadow-yellow-200/50 transition-colors"
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
