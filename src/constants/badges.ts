export type BadgeType = 'classic' | 'hidden_angel' | 'hidden_demon' | 'hidden_neutral' | 'vaccine_required' | 'vaccine_optional';

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

  // 公費必打疫苗 (0-1歲)
  { id: 'v_hepb_1', title: 'B型肝炎疫苗 (第1劑)', description: '出生24小時內接種', icon: '🛡️', type: 'vaccine_required', xpReward: 50, startMonth: 0 },
  { id: 'v_hepb_2', title: 'B型肝炎疫苗 (第2劑)', description: '滿 1 個月接種', icon: '🛡️', type: 'vaccine_required', xpReward: 50, startMonth: 1 },
  { id: 'v_5in1_1', title: '五合一疫苗 (第1劑)', description: '滿 2 個月接種', icon: '💉', type: 'vaccine_required', xpReward: 80, startMonth: 2 },
  { id: 'v_pcv_1', title: '肺炎鏈球菌疫苗 (第1劑)', description: '滿 2 個月接種', icon: '🩺', type: 'vaccine_required', xpReward: 80, startMonth: 2 },
  { id: 'v_5in1_2', title: '五合一疫苗 (第2劑)', description: '滿 4 個月接種', icon: '💉', type: 'vaccine_required', xpReward: 80, startMonth: 4 },
  { id: 'v_pcv_2', title: '肺炎鏈球菌疫苗 (第2劑)', description: '滿 4 個月接種', icon: '🩺', type: 'vaccine_required', xpReward: 80, startMonth: 4 },
  { id: 'v_bcg', title: '卡介苗', description: '滿 5-8 個月接種', icon: '👶', type: 'vaccine_required', xpReward: 100, startMonth: 5 },
  { id: 'v_5in1_3', title: '五合一疫苗 (第3劑)', description: '滿 6 個月接種', icon: '💉', type: 'vaccine_required', xpReward: 80, startMonth: 6 },
  { id: 'v_hepb_3', title: 'B型肝炎疫苗 (第3劑)', description: '滿 6 個月接種', icon: '🛡️', type: 'vaccine_required', xpReward: 50, startMonth: 6 },
  { id: 'v_flu_1', title: '流感疫苗 (第1劑)', description: '滿 6 個月接種 (視季節)', icon: '❄️', type: 'vaccine_required', xpReward: 50, startMonth: 6 },
  { id: 'v_flu_2', title: '流感疫苗 (第2劑)', description: '滿 7 個月接種 (首次需打2劑)', icon: '❄️', type: 'vaccine_required', xpReward: 50, startMonth: 7 },
  { id: 'v_mmr_1', title: 'MMR 混合疫苗 (第1劑)', description: '滿 12 個月接種', icon: '🎯', type: 'vaccine_required', xpReward: 100, startMonth: 12 },
  { id: 'v_varicella', title: '水痘疫苗 (第1劑)', description: '滿 12 個月接種', icon: '💧', type: 'vaccine_required', xpReward: 100, startMonth: 12 },
  { id: 'v_pcv_3', title: '肺炎鏈球菌疫苗 (第3劑)', description: '滿 12 個月接種', icon: '🩺', type: 'vaccine_required', xpReward: 80, startMonth: 12 },
  { id: 'v_hepa_1', title: 'A型肝炎疫苗 (第1劑)', description: '滿 12-15 個月接種', icon: '🛡️', type: 'vaccine_required', xpReward: 80, startMonth: 12 },
  { id: 'v_je_1', title: '日本腦炎疫苗 (第1劑)', description: '滿 15 個月接種', icon: '🦟', type: 'vaccine_required', xpReward: 100, startMonth: 15 },
  { id: 'v_5in1_4', title: '五合一疫苗 (第4劑)', description: '滿 15-18 個月接種', icon: '💉', type: 'vaccine_required', xpReward: 120, startMonth: 15 },
  { id: 'v_hepa_2', title: 'A型肝炎疫苗 (第2劑)', description: '與第1劑至少間隔6個月', icon: '🛡️', type: 'vaccine_required', xpReward: 80, startMonth: 18 },
  { id: 'v_mmr_2', title: 'MMR 混合疫苗 (第2劑)', description: '滿 5 歲至入學前接種', icon: '🎯', type: 'vaccine_required', xpReward: 100, startMonth: 60 },
  { id: 'v_4in1', title: '四合一疫苗 (追加)', description: '滿 5 歲至入學前接種', icon: '💉', type: 'vaccine_required', xpReward: 120, startMonth: 60 },

  // 自費建議疫苗
  { id: 'v_rota', title: '輪狀病毒疫苗', description: '滿 2 個月口服 (預防嚴重腹瀉)', icon: '🦠', type: 'vaccine_optional', xpReward: 100, startMonth: 2 },
  { id: 'v_entero', title: '腸病毒71型疫苗', description: '滿 2 個月可評估接種', icon: '🦠', type: 'vaccine_optional', xpReward: 100, startMonth: 2 },
  { id: 'v_pcv_extra', title: '肺炎鏈球菌疫苗 (追加)', description: '滿 6 個月自費追加劑 (增強保護)', icon: '🛡️', type: 'vaccine_optional', xpReward: 100, startMonth: 6 },
  { id: 'v_meningococcal', title: '腦脊髓膜炎疫苗', description: '滿 2 個月可評估接種', icon: '🧠', type: 'vaccine_optional', xpReward: 150, startMonth: 2 },

  // 高齡主線成就
  { id: 'c9', title: '第一次說句子', description: '能說出 3 個字以上的短句', icon: '💬', type: 'classic', xpReward: 200, startMonth: 18 },
  { id: 'c10', title: '第一次自己吃飯', description: '成功使用湯匙將食物送入口', icon: '🥄', type: 'classic', xpReward: 150, startMonth: 15 },
  { id: 'c11', title: '第一次雙腳跳', description: '離開地面的瞬間', icon: '🐰', type: 'classic', xpReward: 200, startMonth: 24 },
  { id: 'c12', title: '第一次戒尿布', description: '告別尿布的里程碑', icon: '🚽', type: 'classic', xpReward: 300, startMonth: 30 },
];
