import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Home, Clock, Trophy, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer } from 'recharts';
import { 
  NeutralBaby, Angel, PlayfulAngel, PlayfulImp, Demon, Archdemon, Archangel, ChaosHybrid, 
  BackgroundStars 
} from './components/EvolutionCharacters';
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

import { LogTabView, Activity } from './components/LogTabView';
import { playXpSound, playLevelUpSound, playAchievementSound } from './utils/audio';

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

const getBabyAgeGroup = (bday: string) => {
  if (!bday) return '0to1';
  const bDate = new Date(bday);
  const now = new Date();
  if (isNaN(bDate.getTime())) return '0to1';
  const months = (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth());
  if (months >= 12 && months < 24) return '1to2';
  if (months >= 24) return '2to5';
  return '0to1';
};



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
  const characterRef = React.useRef<HTMLDivElement>(null);
  const [activeMenu, setActiveMenu] = useState<ActivityModule | 'medical' | null>(null);
  const [editingRecord, setEditingRecord] = useState<Activity | null>(null);
  const [babyName, setBabyName] = useState(() => localStorage.getItem('babyName') || "小寶寶");
  
  const [babyGender, setBabyGender] = useState<'boy'|'girl'>(() => {
    const saved = localStorage.getItem('babyGender');
    return (saved === 'boy' || saved === 'girl') ? saved : 'boy';
  });

  const [unlockedBadges, setUnlockedBadges] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('unlockedBadges');
    return saved ? JSON.parse(saved) : {};
  });

  const [mainTab, setMainTab] = useState<'home'|'log'|'milestones'|'profile'>('home');
  const [milestoneTab, setMilestoneTab] = useState<'milestone' | 'vaccine'>('milestone');
  const [milestoneAgeRange, setMilestoneAgeRange] = useState<'0-1' | '1-2' | '2-5'>('0-1');
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

  const [vaccineAppointments, setVaccineAppointments] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('babyVaccineAppointments');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedVaccineId, setSelectedVaccineId] = useState<string | null>(null);
  const [vaccineQueue, setVaccineQueue] = useState<string[]>([]);
  const [appointmentDateInput, setAppointmentDateInput] = useState("");
  const [showAppointmentInput, setShowAppointmentInput] = useState(false);
  const [dismissedBubbles, setDismissedBubbles] = useState<string[]>(() => {
    const saved = localStorage.getItem('babyDismissedBubbles');
    return saved ? JSON.parse(saved) : [];
  });
  const [hasViewedMilestones, setHasViewedMilestones] = useState(false);
  const [babyHealthState, setBabyHealthState] = useState<boolean>(() => {
    return localStorage.getItem('babyHealthState') === 'true';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('babyTheme') === 'dark';
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        window.alert(
          "📱 iOS 系統安裝指南：\n\n1. 點擊瀏覽器底部的「分享」按鈕 (具有向上箭頭的圖示)\n2. 向下滑動並選擇「加入主畫面」\n3. 點擊右上角的「新增」即可建立桌面圖示！"
        );
      } else {
        window.alert(
          "🌐 安裝指南：\n\n如果您的手機瀏覽器未自動彈出安裝提示，請點擊瀏覽器右上角選單 (三個點)，然後點選「加到主畫面」或「安裝應用程式」！"
        );
      }
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('babyTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('babyTheme', 'light');
    }
  }, [darkMode]);

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
    localStorage.setItem('babyGender', babyGender);
  }, [babyGender]);

  useEffect(() => {
    localStorage.setItem('babyActivityLog', JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem('babyMilestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('babyHealthState', babyHealthState.toString());
  }, [babyHealthState]);


  useEffect(() => {
    localStorage.setItem('babyBirthday', birthday);
  }, [birthday]);

  useEffect(() => {
    localStorage.setItem('unlockedBadges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('babyVaccineAppointments', JSON.stringify(vaccineAppointments));
  }, [vaccineAppointments]);

  useEffect(() => {
    localStorage.setItem('babyDismissedBubbles', JSON.stringify(dismissedBubbles));
  }, [dismissedBubbles]);

  useEffect(() => {
    if (mainTab === 'milestones') {
      const unlockedHiddenBadgeIds = BADGE_DEFS
        .filter(b => b.type.startsWith('hidden_') && unlockedBadges[b.id])
        .map(b => b.id);
      
      if (unlockedHiddenBadgeIds.length > 0) {
        setDismissedBubbles(prev => {
          const unique = new Set([...prev, ...unlockedHiddenBadgeIds]);
          return Array.from(unique);
        });
      }
    }
  }, [mainTab, unlockedBadges]);

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

    // 檢查好奇心殺死貓 (h_curious)
    if (badge.type === 'classic' && !newUnlockedBadges['h_curious']) {
      const unlocked1to2Count = BADGE_DEFS.filter(cb => cb.type === 'classic' && cb.startMonth !== undefined && cb.startMonth >= 12 && cb.startMonth < 24)
        .filter(cb => newUnlockedBadges[cb.id]).length;
      if (unlocked1to2Count >= 2) {
        const curiousBadge = BADGE_DEFS.find(b => b.id === 'h_curious');
        if (curiousBadge) {
          badgesToUnlock.push(curiousBadge);
          newUnlockedBadges['h_curious'] = now;
        }
      }
    }

    // 檢查吾家幼苗初長成 (h_grow_up)
    if (!newUnlockedBadges['h_grow_up'] && gameState.level >= 10) {
      const unlocked2to5Count = BADGE_DEFS.filter(cb => cb.type === 'classic' && cb.startMonth !== undefined && cb.startMonth >= 24)
        .filter(cb => newUnlockedBadges[cb.id]).length;
      if (unlocked2to5Count >= 1) {
        const growBadge = BADGE_DEFS.find(b => b.id === 'h_grow_up');
        if (growBadge) {
          badgesToUnlock.push(growBadge);
          newUnlockedBadges['h_grow_up'] = now;
        }
      }
    }

    setUnlockedBadges(newUnlockedBadges);
    if (badgesToUnlock.length > 0) {
      playAchievementSound();
    }

    const d = new Date(now);
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    
    let totalXpAdded = 0;
    const newMilestones = badgesToUnlock.map(b => {
      if (b.type.startsWith('hidden_')) {
        totalXpAdded += b.xpReward;
      }
      return {
        id: Date.now().toString() + Math.random(),
        timeStr,
        text: `解鎖成就：「${b.title}」`,
        icon: b.icon
      };
    });

    setMilestones(prev => [...newMilestones, ...prev]);

    if (totalXpAdded > 0) {
      spawnEffect(`+${totalXpAdded} XP`, 'xp', window.innerWidth / 2, window.innerHeight * 0.7);
    }
    
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
    if (type === 'xp') {
      playXpSound();
    }
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

    // 如果是醫療紀錄，自動變成生病狀態
    if (newLog.module === 'medical' || newLog.action === '醫療紀錄') {
      setBabyHealthState(true);
    }

    let newlyUnlockedIds: string[] = [];
    const triggerHidden = (id: string) => {
      if (!unlockedBadges[id] && !newlyUnlockedIds.includes(id)) {
        newlyUnlockedIds.push(id);
      }
    };

    // h_poop: 生化武器 (炸屎大魔王)
    if (data.action.includes('炸屎大魔王') || data.action.includes('邊爬邊尿尿') || data.action.includes('摸髒尿布') || (data.detail && (data.detail.includes('炸屎') || data.detail.includes('拉肚子') || data.detail.includes('拉稀')))) {
      triggerHidden('h_poop');
    }
    
    // h_scissor: 理智線剪刀手
    if (data.action.includes('打人') || data.action.includes('咬人') || data.action.includes('摔玩具') || (data.detail && (data.detail.includes('扯') || data.detail.includes('抓') || data.detail.includes('打') || data.detail.includes('咬') || data.detail.includes('物理攻擊') || data.detail.includes('泥鰍寶寶')))) {
      triggerHidden('h_scissor');
    }

    // h_sleep: 睡神附體
    if (data.action.includes('安穩長睡') || data.action.includes('一覺到天亮') || data.action.includes('獨立安撫') || (data.detail && (data.detail.includes('睡過夜') || data.detail.includes('過夜') || data.detail.includes('連續睡眠')))) {
       const match = data.detail ? data.detail.match(/\d+(\.\d+)?/) : null;
       if (match && parseFloat(match[0]) >= 8) {
           triggerHidden('h_sleep');
       } else if (!data.detail || data.detail.includes('8') || data.detail.includes('9') || data.detail.includes('10') || data.detail.includes('過夜') || data.action.includes('一覺到天亮')) {
           triggerHidden('h_sleep');
       }
    }

    // h_vaccine: 無痛晉級
    if (data.action.includes('勇敢小戰士') || data.action.includes('快速單純紀錄') || (data.detail && (data.detail.includes('疫苗') || data.detail.includes('打針') || data.detail.includes('接種')) && data.alphaGain >= 0)) {
       triggerHidden('h_vaccine');
    }

    // h_heal: 治癒魔法
    const positiveMoodCount = newActivityLog.filter(l => l.module === 'mood' && l.alphaGain > 0).length;
    if (positiveMoodCount >= 3) {
      triggerHidden('h_heal');
    }

    // h_dj: 午夜 DJ - 連續凌晨 2-4 點半夜驚啼
    if (data.action.includes('半夜驚啼') || data.action.includes('午夜DJ') || data.action.includes('半夜醒來')) {
      const djLogs = newActivityLog.filter(l => {
        return l.action.includes('半夜驚啼') || l.action.includes('午夜DJ') || l.action.includes('半夜醒來');
      });
      if (djLogs.length >= 3) {
        triggerHidden('h_dj');
      }
    }

    // 1-2歲隱藏成就 Triggers
    // h_plates_cleaner: 乾淨空盤大師
    if (data.action.includes('順利完食') || data.action.includes('嚼嚼吃完副食品') || (data.detail && (data.detail.includes('空盤') || data.detail.includes('吃光') || data.detail.includes('全部吃完')))) {
      const positiveFeedingCount = newActivityLog.filter(l => l.module === 'feeding' && l.alphaGain > 0).length;
      if (positiveFeedingCount >= 3) {
        triggerHidden('h_plates_cleaner');
      }
    }

    // h_polite: 禮貌模範生
    if (data.action.includes('揮手拜拜') || data.action.includes('分享玩具') || data.action.includes('飛吻') || (data.detail && (data.detail.includes('拜拜') || data.detail.includes('飛吻') || data.detail.includes('分享') || data.detail.includes('禮貌')))) {
      const socialCount = newActivityLog.filter(l => l.action.includes('揮手拜拜') || l.action.includes('分享玩具') || l.action.includes('飛吻') || (l.detail && (l.detail.includes('拜拜') || l.detail.includes('飛吻') || l.detail.includes('分享')))).length;
      if (socialCount >= 3) {
        triggerHidden('h_polite');
      }
    }

    // h_explorer: 勇敢小小探險家
    if (data.action.includes('勇敢小戰士') || data.action.includes('幫忙拿') || (data.detail && (data.detail.includes('勇敢') || data.detail.includes('不怕') || data.detail.includes('探險')))) {
      triggerHidden('h_explorer');
    }

    // h_tantrum: 尖叫尖叫再尖叫
    if (data.action.includes('地上打滾耍賴') || data.action.includes('不要不要') || (data.detail && (data.detail.includes('尖叫') || data.detail.includes('耍賴') || data.detail.includes('大哭') || data.detail.includes('不要不要')))) {
      triggerHidden('h_tantrum');
    }

    // h_gravity: 重力實驗科學家
    if (data.action.includes('扔到地上') || (data.detail && (data.detail.includes('丟') || data.detail.includes('扔') || data.detail.includes('重力')))) {
      const throwCount = newActivityLog.filter(l => (l.detail && (l.detail.includes('丟') || l.detail.includes('扔'))) || l.action.includes('扔到地上')).length;
      if (throwCount >= 3) {
        triggerHidden('h_gravity');
      }
    }

    // h_stroller_run: 安全帶逃脫魔術師
    if (data.action.includes('翻滾逃跑') || (data.detail && (data.detail.includes('逃跑') || data.detail.includes('脫逃') || data.detail.includes('掙脫') || data.detail.includes('泥鰍')))) {
      triggerHidden('h_stroller_run');
    }

    // h_curious: 好奇心殺死貓
    const unlocked1to2Count = BADGE_DEFS.filter(b => b.type === 'classic' && b.startMonth !== undefined && b.startMonth >= 12 && b.startMonth < 24)
      .filter(b => unlockedBadges[b.id]).length;
    if (unlocked1to2Count >= 2) {
      triggerHidden('h_curious');
    }

    // 2-5歲隱藏成就 Triggers
    // h_potty_hero: 馬桶小勇士
    if (data.action.includes('小馬桶') || (data.detail && (data.detail.includes('戒尿布') || data.detail.includes('坐馬桶') || data.detail.includes('如廁') || data.detail.includes('小便成功') || data.detail.includes('尿尿成功') || data.detail.includes('便便成功')))) {
      triggerHidden('h_potty_hero');
    }

    // h_sharing: 分享大天使
    if (data.action.includes('分享玩具') || (data.detail && (data.detail.includes('分享') || data.detail.includes('給別的') || data.detail.includes('分給') || data.detail.includes('送給')))) {
      triggerHidden('h_sharing');
    }

    // h_story_master: 說故事大師
    if (data.detail && (data.detail.includes('故事') || data.detail.includes('長句') || data.detail.includes('說話') || data.detail.includes('句子') || data.detail.includes('說故事'))) {
      triggerHidden('h_story_master');
    }

    // h_why: 十萬個為什麼轟炸
    if (data.detail && (data.detail.includes('為什麼') || data.detail.includes('發問') || data.detail.includes('十萬個'))) {
      triggerHidden('h_why');
    }

    // h_picasso: 牆面畢卡索
    if (data.detail && (data.detail.includes('畫牆') || data.detail.includes('畫沙發') || data.detail.includes('畫床') || data.detail.includes('畢卡索') || data.detail.includes('塗鴉') || data.detail.includes('亂畫')) && data.alphaGain < 0) {
      triggerHidden('h_picasso');
    }

    // h_bossy: 我是這裡的國王
    if (data.detail && (data.detail.includes('我的') || data.detail.includes('不給') || data.detail.includes('搶玩具') || data.detail.includes('霸道') || data.detail.includes('國王'))) {
      triggerHidden('h_bossy');
    }

    // h_grow_up: 吾家有女/子初長成
    if (gameState.level >= 10) {
      const unlocked2to5Count = BADGE_DEFS.filter(cb => cb.type === 'classic' && cb.startMonth !== undefined && cb.startMonth >= 24)
        .filter(cb => unlockedBadges[cb.id]).length;
      if (unlocked2to5Count >= 1) {
        triggerHidden('h_grow_up');
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



  const triggerLevelUp = () => {
    playLevelUpSound();
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 2500);
  };

  const renderCharacter = () => {
    const ageGroup = getBabyAgeGroup(birthday);

    switch(gameState.currentEvolution) {
      case '大天使': return <Archangel isSick={babyHealthState} gender={babyGender} ageGroup={ageGroup} />;
      case '天使': return <Angel isSick={babyHealthState} gender={babyGender} ageGroup={ageGroup} />;
      case '淘氣小天使': return <PlayfulAngel isSick={babyHealthState} gender={babyGender} ageGroup={ageGroup} />;
      case '頑皮小惡魔': return <PlayfulImp isSick={babyHealthState} gender={babyGender} ageGroup={ageGroup} />;
      case '惡魔': return <Demon isSick={babyHealthState} gender={babyGender} ageGroup={ageGroup} />;
      case '大惡魔': return <Archdemon isSick={babyHealthState} gender={babyGender} ageGroup={ageGroup} />;
      case '中立 (LV5以上)': return <ChaosHybrid isSick={babyHealthState} gender={babyGender} ageGroup={ageGroup} />;
      case '中立 (LV1-LV4)':
      default: return <NeutralBaby isSick={babyHealthState} gender={babyGender} ageGroup={ageGroup} />;
    }
  };

  const handleResetAll = () => {
    setGameState({ level: 1, xp: 0, alignmentScore: 0, currentEvolution: '中立' });
    setBabyName('小寶寶');
    setBabyGender('boy');
    setUnlockedBadges({});
    setActivityLog([]);
    setMilestones([]);
    setBirthday('');
    setDismissedBubbles([]);
    setVaccineAppointments({});
    setSelectedVaccineId(null);
    setVaccineQueue([]);
    setHasViewedMilestones(false);
    setBabyHealthState(false);
    setDarkMode(false);
    setMilestoneTab('milestone');
    setMilestoneAgeRange('0-1');
    localStorage.clear();
    setMainTab('home');
    setShowResetConfirm(false);
  };

  // 找出目前在觀察範圍內的未解鎖成就與疫苗
  const observingBadges = BADGE_DEFS.filter(b => {
    // 如果該氣泡在此次連線已被點擊隱藏，則不再顯示
    if (dismissedBubbles.includes(b.id)) return false;

    // 隱藏彩蛋類 (Egg/Hidden)：如果已解鎖，則顯示為提醒氣泡（直到被點擊隱藏）
    if (b.type.startsWith('hidden_')) {
      return !!unlockedBadges[b.id];
    }

    // 一般里程碑與疫苗類：如果已解鎖，就不再顯示氣泡
    if (unlockedBadges[b.id] || !birthday || b.startMonth === undefined) return false;
    
    const isVaccine = b.type.startsWith('vaccine_');
    
    // 如果是疫苗且已預約，檢查預約日期
    if (isVaccine && vaccineAppointments[b.id]) {
       const appointmentDate = new Date(vaccineAppointments[b.id]);
       appointmentDate.setHours(0,0,0,0);
       const today = new Date();
       today.setHours(0,0,0,0);
       if (today.getTime() < appointmentDate.getTime()) {
           return false;
       }
    }

    const bDate = new Date(birthday);
    const now = new Date();
    const months = (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth()) + (now.getDate() - bDate.getDate()) / 30;
    
    // 疫苗類別提前 14 天 (14/30 個月) 提醒
    const targetMonth = isVaccine ? b.startMonth - (14 / 30) : b.startMonth;
    
    return months >= targetMonth;
  }).slice(0, 6);

  const isUltimateEvolution = gameState.currentEvolution === '大天使' || gameState.currentEvolution === '大惡魔';
  const sizeClasses = isUltimateEvolution
    ? "w-[220px] h-[220px] sm:w-[285px] sm:h-[285px] md:w-[350px] md:h-[350px]"
    : "w-[170px] h-[170px] sm:w-[220px] sm:h-[220px] md:w-[270px] md:h-[270px]";

  return (
    <div className={`fixed inset-0 w-full h-full bg-[var(--color-pastel-bg)] flex flex-col items-center text-neutral-800 font-sans select-none overflow-hidden ${isShaking ? 'animate-shake' : ''}`}>
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
              className="flex-1 w-full h-full flex flex-col items-center p-3 md:p-6 overflow-y-auto overflow-x-hidden relative"
            >
              {/* RPG 風格角色狀態卡片 */}
              <div className="flex-none w-full max-w-[340px] md:max-w-md glass-card rounded-[1.25rem] p-2.5 md:p-3 mt-3 transition-all z-10 relative border border-white/60 shadow-sm flex items-center gap-3">
                
                {/* 左側：等級頭像框 */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1rem] bg-gradient-to-br from-pastel-purple/20 to-pastel-pink/20 border-2 border-white shadow-inner flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase leading-none tracking-widest mb-0.5">LV</span>
                  <span className="text-2xl md:text-3xl font-black text-neutral-700 leading-none text-shadow-glow">{gameState.level}</span>
                </div>

                {/* 右側：狀態資訊區 */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  
                  {/* 第一排：姓名 + 形態 */}
                  <div className="flex justify-between items-center w-full mb-1">
                    <input
                      type="text"
                      value={babyName}
                      onChange={(e) => setBabyName(e.target.value)}
                      className="text-base md:text-lg font-black text-neutral-800 bg-transparent border-none outline-none focus:ring-0 p-0 shadow-none focus:border-b-2 focus:border-neutral-300 transition-colors w-24 md:w-32 placeholder-neutral-300 truncate"
                      placeholder="輸入名字"
                    />
                    <span className="text-[9px] md:text-[10px] font-bold text-pastel-purple bg-purple-50 px-2 py-0.5 rounded-lg tracking-wider shadow-sm border border-purple-100/50 shrink-0">
                      {gameState.currentEvolution}
                    </span>
                  </div>

                  {/* 第二排：年紀 + XP 標籤 */}
                  <div className="flex justify-between items-end w-full mb-1">
                    <span className="text-[10px] md:text-[11px] font-extrabold text-neutral-500 truncate">
                      {birthday ? ageString : "(未設定生日)"}
                    </span>
                    <span className="text-[9px] md:text-[10px] font-black text-neutral-400 tracking-widest shrink-0">
                      <span className="text-neutral-700">{gameState.xp}</span> / {nextLevelXp} XP
                    </span>
                  </div>

                  {/* 第三排：XP 進度條 */}
                  <div className="w-full h-1.5 md:h-2 bg-neutral-200/60 rounded-full overflow-hidden relative shadow-inner">
                    <motion.div
                      className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-pastel-pink to-pastel-purple rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((gameState.xp / nextLevelXp) * 100, 100)}%` }}
                      transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    />
                  </div>
                </div>
              </div>



      {/* 中央角色區域占位符 */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative w-full my-2 z-10">
        
        {/* 首頁的觀察中提醒氣泡（放在這個區塊內，保證絕對不會擋住上方的資訊卡片） */}
        {observingBadges.length > 0 && observingBadges.map((badge, idx) => {
          const isLeft = idx % 2 === 0;
          const row = Math.floor(idx / 2);
          
          const isHidden = badge.type.startsWith('hidden_');
          const isVaccine = badge.type.startsWith('vaccine_');
          const isOptional = badge.type === 'vaccine_optional';
          
          let bgColor = 'bg-yellow-50/90';
          let borderColor = 'border-yellow-200';
          let textColor = 'text-yellow-600';
          let labelText = '寶寶觀察中';

          if (isHidden) {
            bgColor = 'bg-purple-50/90';
            borderColor = 'border-purple-200';
            textColor = 'text-purple-600';
            labelText = '發現隱藏彩蛋！';
          } else if (isVaccine) {
            bgColor = isOptional ? 'bg-blue-50/90' : 'bg-emerald-50/90';
            borderColor = isOptional ? 'border-blue-200' : 'border-emerald-200';
            textColor = isOptional ? 'text-blue-600' : 'text-emerald-600';
            labelText = isOptional ? '疫苗評估' : '建議接種';
          }

          return (
            <div 
              key={badge.id}
              className={`absolute z-20 glass-card ${bgColor} rounded-2xl p-2 px-3 flex items-center gap-2 shadow-sm border ${borderColor} animate-bounce cursor-pointer flex-shrink-0 max-w-[140px] md:max-w-[150px] ${isLeft ? 'left-0 md:left-4' : 'right-0 md:right-4'}`}
              style={{ top: `${row * 65}px`, animationDelay: `${idx * 0.15}s` }}
              onClick={() => {
                const startMonth = badge.startMonth || 0;
                let targetAgeRange: '0-1' | '1-2' | '2-5' = '0-1';
                if (startMonth >= 12 && startMonth < 24) {
                  targetAgeRange = '1-2';
                } else if (startMonth >= 24) {
                  targetAgeRange = '2-5';
                }
                setMilestoneAgeRange(targetAgeRange);

                const targetTab: 'milestone' | 'vaccine' = badge.type.startsWith('vaccine') ? 'vaccine' : 'milestone';
                setMilestoneTab(targetTab);

                if (isHidden) {
                  setDismissedBubbles(prev => [...prev, badge.id]);
                  setMainTab('milestones');
                  setHasViewedMilestones(true);
                } else if (isVaccine) {
                  const allVaccineIds = observingBadges.filter(b => b.type.startsWith('vaccine_')).map(b => b.id);
                  const queue = [badge.id, ...allVaccineIds.filter(id => id !== badge.id)];
                  setVaccineQueue(queue);
                  setSelectedVaccineId(queue[0]);
                  setShowAppointmentInput(false);
                } else {
                  // 點擊任何一個一般里程碑氣泡時，將畫面上所有的里程碑氣泡都標記為已隱藏
                  const allMilestoneIds = observingBadges.filter(b => b.type === 'classic').map(b => b.id);
                  setDismissedBubbles(prev => [...prev, ...allMilestoneIds]);
                  setMainTab('milestones');
                  setHasViewedMilestones(true);
                }
              }}
            >
              <span className="text-xl md:text-2xl drop-shadow-sm flex-none">{badge.icon}</span>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className={`text-[10px] font-black ${textColor} tracking-wider`}>{labelText}</span>
                <span className="text-[11px] font-bold text-neutral-600 truncate">{badge.title}</span>
              </div>
            </div>
          );
        })}

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
          ref={characterRef}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.85 }}
          className={`${sizeClasses} aspect-square cursor-pointer relative flex items-center justify-center flex-none`}
        >
          {/* 加入緩慢呼吸 floating 動畫 */}
          <div className="w-full h-full animate-float flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${gameState.currentEvolution}-${babyHealthState}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
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
      </div>
            </motion.div>
          )}

          {mainTab === 'log' && <LogTabView activityLog={activityLog} onDelete={handleDeleteRecord} onEdit={(log) => { setEditingRecord(log); setActiveMenu(log.module || log._module || 'medical'); }} />}

          {mainTab === 'milestones' && (
            <AchievementsView
              unlockedBadges={unlockedBadges}
              onUnlockBadge={handleUnlockBadge}
              babyBirthday={birthday}
              vaccineAppointments={vaccineAppointments}
              setVaccineAppointments={setVaccineAppointments}
              activeTab={milestoneTab}
              setActiveTab={setMilestoneTab}
              ageRange={milestoneAgeRange}
              setAgeRange={setMilestoneAgeRange}
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
              <h2 className="text-xl font-black text-neutral-700 dark:text-neutral-200 mb-6 tracking-wider self-center text-shadow-sm mt-2">⚙️ 個人設定</h2>
              <div className="w-full glass-card p-6 py-8 rounded-3xl flex flex-col gap-6 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white/50 dark:bg-neutral-900/60">
                
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-[#888] dark:text-neutral-300 ml-2 tracking-widest uppercase">寶寶暱稱</label>
                  <input
                    type="text"
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                    className="w-full bg-white/80 dark:bg-neutral-850 rounded-xl px-4 py-3 font-bold text-neutral-700 dark:text-neutral-200 outline-none focus:ring-2 focus:ring-pastel-pink/50 transition-all border border-white dark:border-neutral-700 shadow-inner text-sm"
                    placeholder="輸入寶寶暱稱"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-[#888] dark:text-neutral-300 ml-2 tracking-widest uppercase">寶寶性別</label>
                  <div className="flex gap-2">
                    <button onClick={() => setBabyGender('boy')} className={`flex-1 py-2.5 rounded-xl font-bold border-2 transition-all text-[13px] ${babyGender === 'boy' ? 'border-blue-400 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-400 shadow-sm' : 'border-white/80 bg-white/50 text-neutral-400 dark:text-neutral-400 hover:bg-white/80 dark:hover:bg-neutral-800/80 dark:border-neutral-700/60 dark:bg-neutral-850/50'}`}>👦 男生</button>
                    <button onClick={() => setBabyGender('girl')} className={`flex-1 py-2.5 rounded-xl font-bold border-2 transition-all text-[13px] ${babyGender === 'girl' ? 'border-pink-400 bg-pink-50 text-pink-600 dark:border-pink-500 dark:bg-pink-950/40 dark:text-pink-400 shadow-sm' : 'border-white/80 bg-white/50 text-neutral-400 dark:text-neutral-400 hover:bg-white/80 dark:hover:bg-neutral-800/80 dark:border-neutral-700/60 dark:bg-neutral-850/50'}`}>👧 女生</button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-[#888] dark:text-neutral-300 ml-2 tracking-widest uppercase">寶寶生日</label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full bg-white/80 dark:bg-neutral-850 rounded-xl px-4 py-3 font-bold text-neutral-700 dark:text-neutral-200 outline-none focus:ring-2 focus:ring-pastel-pink/50 transition-all border border-white dark:border-neutral-700 shadow-inner uppercase text-sm"
                  />
                  {ageString && <div className="text-xs font-extrabold text-pastel-purple text-right pr-2 mt-1">目前：{ageString}</div>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-[#888] dark:text-neutral-300 ml-2 tracking-widest uppercase">顯示模式 Theme</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDarkMode(false)} 
                      className={`flex-1 py-2.5 rounded-xl font-bold border-2 transition-all text-[13px] flex items-center justify-center gap-1.5 ${!darkMode ? 'border-amber-400 bg-amber-50 text-amber-600 shadow-sm' : 'border-white/80 bg-white/50 text-neutral-400 dark:text-neutral-400 hover:bg-white/80 dark:hover:bg-neutral-800/80 dark:border-neutral-700/60 dark:bg-neutral-850/50'}`}
                    >
                      ☀️ 淺色 Light
                    </button>
                    <button 
                      onClick={() => setDarkMode(true)} 
                      className={`flex-1 py-2.5 rounded-xl font-bold border-2 transition-all text-[13px] flex items-center justify-center gap-1.5 ${darkMode ? 'border-purple-400 bg-purple-950/40 text-purple-300 shadow-sm' : 'border-white/80 bg-white/50 text-neutral-400 dark:text-neutral-400 hover:bg-white/80 dark:hover:bg-neutral-800/80 dark:border-neutral-700/60 dark:bg-neutral-850/50'}`}
                    >
                      🌙 深色 Dark
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-[#888] dark:text-neutral-300 ml-2 tracking-widest uppercase">手機應用程式 APP</label>
                  <button 
                    onClick={handleInstallApp}
                    className="w-full py-3 bg-gradient-to-r from-pastel-pink to-pastel-purple text-white font-extrabold rounded-2xl text-[13.5px] hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/20 shadow-md cursor-pointer"
                  >
                    📲 安裝至手機桌面 (安裝 APP)
                  </button>
                  <span className="text-[9.5px] text-neutral-400 dark:text-neutral-400 font-bold pl-2 mt-0.5 leading-relaxed">
                    在您的 iPhone/iPad (iOS) 或 Android 手機桌面建立獨立 APP 圖示，快速連結免開瀏覽器！
                  </span>
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
        <NavBtn 
          active={mainTab === 'milestones'} 
          icon={<Trophy size={22} strokeWidth={2.5} />} 
          label="里程碑" 
          onClick={() => { setMainTab('milestones'); setHasViewedMilestones(true); }} 
          hasNotification={observingBadges.length > 0 && !hasViewedMilestones} 
        />
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
              <motion.div
                key={effect.id}
                initial={{ 
                  opacity: 1, 
                  left: effect.x, 
                  top: effect.y, 
                  scale: 0.5, 
                  x: "-50%", 
                  y: "-50%",
                  rotate: (Math.random() - 0.5) * 40 
                }}
                animate={{ 
                  opacity: 0, 
                  top: effect.y - 150, 
                  left: effect.x + (Math.random() - 0.5) * 120, 
                  scale: effect.type === 'dark' ? 2.5 : 2, 
                  rotate: (Math.random() - 0.5) * 180 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                className="fixed pointer-events-none z-0 flex items-center justify-center"
              >
                <div className="relative flex items-center justify-center">
                  {/* 背景漣漪光圈 */}
                  <div className={`absolute w-24 h-24 rounded-full blur-xl opacity-50 ${
                    effect.type === 'glow' ? 'bg-yellow-400 animate-pulse' : 'bg-purple-900/80 animate-pulse'
                  }`} />
                  
                  {/* 第二層漣漪動畫 */}
                  <div className={`absolute w-32 h-32 rounded-full ${
                    effect.type === 'glow' ? 'animate-ripple-gold' : 'animate-ripple-purple'
                  }`} />
                  
                  {/* 漂浮的表情符號 - 惡魔版本加強陰影與大小 */}
                  <span className={`drop-shadow-[0_0_15px_rgba(0,0,0,0.3)] relative z-10 ${
                    effect.type === 'dark' ? 'text-5xl md:text-6xl filter contrast-125' : 'text-4xl md:text-5xl'
                  }`}>
                    {effect.text}
                  </span>
                </div>
              </motion.div>
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
            ageGroup={getBabyAgeGroup(birthday)}
          />
        )}
        {activeMenu === 'medical' && (
          <MedicalRecordMenu
            onClose={() => { setActiveMenu(null); setEditingRecord(null); }}
            onSubmit={(data) => { handleRecordSubmit(data); setEditingRecord(null); }}
            initialData={editingRecord}
            isSick={babyHealthState}
            onRecover={() => {
              setBabyHealthState(false);
              spawnEffect('💖 已經康復！', 'xp', window.innerWidth/2, window.innerHeight/2);
            }}
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

      {/* 疫苗預約/完成彈窗 */}
      <AnimatePresence>
        {selectedVaccineId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-card bg-white/95 w-full max-w-[320px] rounded-[2rem] p-6 text-center shadow-2xl border border-white/60"
            >
              {(() => {
                 const vBadge = BADGE_DEFS.find(b => b.id === selectedVaccineId);
                 if (!vBadge) return null;
                 
                 const handleNextInQueue = () => {
                    const nextQueue = vaccineQueue.slice(1);
                    setVaccineQueue(nextQueue);
                    if (nextQueue.length > 0) {
                      setSelectedVaccineId(nextQueue[0]);
                      setShowAppointmentInput(false);
                    } else {
                      setSelectedVaccineId(null);
                    }
                 };
                 
                 return (
                   <>
                     <div className="text-4xl mb-3">{vBadge.icon}</div>
                     <h3 className="text-lg font-black text-neutral-800 mb-1">{vBadge.title}</h3>
                     {vaccineQueue.length > 1 && (
                       <div className="text-[10px] font-bold text-white bg-blue-500 rounded-full px-2 py-0.5 inline-block mb-2">
                         還有 {vaccineQueue.length - 1} 項待確認
                       </div>
                     )}
                     
                     {!showAppointmentInput ? (
                       <>
                         <p className="text-xs font-bold text-neutral-500 mb-5">請選擇您目前的進度</p>
                         <div className="flex flex-col gap-3">
                           <button
                             onClick={() => {
                               handleUnlockBadge(vBadge.id);
                               handleNextInQueue();
                             }}
                             className="w-full py-3 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200 transition-colors flex justify-center items-center gap-2"
                           >
                             ✅ 已經打完啦！
                           </button>
                           <button
                             onClick={() => setShowAppointmentInput(true)}
                             className="w-full py-3 rounded-xl font-bold bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors flex justify-center items-center gap-2"
                           >
                             📅 已經預約了時間
                           </button>
                           <button
                             onClick={() => {
                               window.alert("已暫時隱藏，我們將在一個禮拜後再次彈出提醒您！");
                               const nextWeek = new Date();
                               nextWeek.setDate(nextWeek.getDate() + 7);
                               setVaccineAppointments(prev => ({
                                 ...prev,
                                 [vBadge.id]: nextWeek.getTime()
                               }));
                               handleNextInQueue();
                             }}
                             className="w-full py-3 rounded-xl font-bold bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors mt-2"
                           >
                             稍後再說
                           </button>
                           {vBadge.type === 'vaccine_optional' && (
                             <button
                               onClick={() => {
                                 if (window.confirm("確定未來都不再提醒這項自費疫苗嗎？\n(您隨時可以去「里程碑 > 疫苗接種」頁面手動確認)")) {
                                   setVaccineAppointments(prev => ({
                                     ...prev,
                                     [vBadge.id]: new Date('2099-12-31').getTime()
                                   }));
                                   handleNextInQueue();
                                 }
                               }}
                               className="w-full py-3 rounded-xl font-bold bg-red-50 text-red-400 hover:bg-red-100 transition-colors mt-2"
                             >
                               🚫 不再提醒
                             </button>
                           )}
                         </div>
                       </>
                     ) : (
                       <>
                         <p className="text-xs font-bold text-neutral-500 mb-4">請選擇您預約施打的日期</p>
                         <input 
                           type="date"
                           className="w-full bg-neutral-100 rounded-xl px-4 py-3 font-bold text-neutral-700 outline-none border border-neutral-200 mb-5 text-sm uppercase"
                           value={appointmentDateInput}
                           onChange={(e) => setAppointmentDateInput(e.target.value)}
                         />
                         <div className="flex gap-2">
                           <button
                             onClick={() => setShowAppointmentInput(false)}
                             className="flex-1 py-3 rounded-xl font-bold bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                           >
                             返回
                           </button>
                           <button
                             onClick={() => {
                               if (!appointmentDateInput) return;
                               setVaccineAppointments(prev => ({
                                 ...prev,
                                 [vBadge.id]: new Date(appointmentDateInput).getTime()
                               }));
                               setAppointmentDateInput("");
                               spawnEffect('📅 已設定提醒', 'xp', window.innerWidth/2, window.innerHeight/2);
                               handleNextInQueue();
                             }}
                             className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors shadow-md ${appointmentDateInput ? 'bg-blue-500 shadow-blue-200 hover:bg-blue-600' : 'bg-blue-300 shadow-none cursor-not-allowed'}`}
                             disabled={!appointmentDateInput}
                           >
                             儲存預約
                           </button>
                         </div>
                       </>
                     )}
                   </>
                 );
              })()}
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
      <span className="text-[9px] md:text-[10px] font-black text-[#666] dark:text-neutral-300 tracking-wide whitespace-nowrap">{title}</span>
      <span className="text-[7px] md:text-[8px] font-bold text-[#888] dark:text-neutral-400 bg-white/60 dark:bg-neutral-800/80 px-1 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">{xpText}</span>
    </motion.button>
  );
}

function NavBtn({ active, icon, label, onClick, hasNotification }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void; hasNotification?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-[72px] h-full transition-all duration-300 relative ${active ? 'text-pastel-purple' : 'text-[#a1a1aa] dark:text-neutral-400 hover:text-[#888] dark:hover:text-neutral-200'}`}
    >
      <div className={`relative z-10 flex flex-col items-center gap-1 ${active ? '-translate-y-[2px]' : ''} transition-transform duration-300`}>
        <div className="relative">
          {icon}
          {hasNotification && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-sm" />
          )}
        </div>
        <span className={`text-[9.5px] font-black tracking-widest ${active ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>{label}</span>
      </div>
      {active && (
        <motion.div layoutId="nav-indicator" className="absolute top-1 bottom-1 w-[60px] bg-pastel-purple/15 rounded-xl border border-white/50 dark:border-neutral-700/50 backdrop-blur-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
      )}
    </button>
  );
}


