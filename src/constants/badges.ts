export type BadgeType = 'classic' | 'hidden_angel' | 'hidden_demon' | 'hidden_neutral';

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: BadgeType;
  xpReward: number;
  startMonth?: number; // 開始發展的月齡
}

export const BADGE_DEFS: BadgeDef[] = [
  // 經典主線成就
  { id: 'c6', title: '第一次社交微笑', description: '回應大人的笑容', icon: '😊', type: 'classic', xpReward: 50, startMonth: 2 },
  { id: 'c1', title: '第一次翻身', description: '解鎖身體翻滾技能', icon: '🌀', type: 'classic', xpReward: 100, startMonth: 4 },
  { id: 'c2', title: '第一次獨立坐', description: '脊椎力量 UP', icon: '🧘', type: 'classic', xpReward: 100, startMonth: 7 },
  { id: 'c3', title: '第一次爬行', description: '探索世界的第一步', icon: '🐾', type: 'classic', xpReward: 100, startMonth: 8 },
  { id: 'c5', title: '第一次捏取物品', description: '精細動作發展', icon: '🤏', type: 'classic', xpReward: 100, startMonth: 8 },
  { id: 'c8', title: '第一次揮手掰掰', description: '明白離別的意義', icon: '👋', type: 'classic', xpReward: 100, startMonth: 10 },
  { id: 'c4', title: '第一次放手走路', description: '雙腳站立的感動', icon: '🚶', type: 'classic', xpReward: 150, startMonth: 11 },
  { id: 'c7', title: '第一次叫爸爸/媽媽', description: '最動聽的聲音', icon: '🗣️', type: 'classic', xpReward: 150, startMonth: 11 },
  
  // 隱藏版成就 (天使)
  { id: 'h_sleep', title: '睡神附體', description: '單次連續睡眠 > 8 小時', icon: '😴', type: 'hidden_angel', xpReward: 100 },
  { id: 'h_heal', title: '治癒魔法', description: '連續 3 天正向情緒', icon: '✨', type: 'hidden_angel', xpReward: 150 },
  { id: 'h_vaccine', title: '無痛晉級', description: '疫苗接種當日沒有暴哭', icon: '💉', type: 'hidden_angel', xpReward: 120 },
  
  // 隱藏版成就 (惡魔)
  { id: 'h_poop', title: '生化武器', description: '遭遇炸屎大魔王', icon: '☢️', type: 'hidden_demon', xpReward: 50 },
  { id: 'h_scissor', title: '理智線剪刀手', description: '記錄到抓扯等物理攻擊', icon: '✂️', type: 'hidden_demon', xpReward: 50 },
  { id: 'h_dj', title: '午夜 DJ', description: '連續凌晨 2-4 點驚啼', icon: '🎧', type: 'hidden_demon', xpReward: 80 },

  // 隱藏版成就 (中立)
  { id: 'h_speedrun', title: '新手村速通大師', description: '提早解鎖 3 個以上主線成就', icon: '🚀', type: 'hidden_neutral', xpReward: 300 },
];
