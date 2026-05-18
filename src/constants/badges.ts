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
  // ================= 經典主線成就 (0-1歲) =================
  { id: 'c6', title: '第一次社交微笑', description: '回應大人的笑容', icon: '😊', type: 'classic', xpReward: 0, startMonth: 2 },
  { id: 'c1', title: '第一次翻身', description: '解鎖身體翻滾技能', icon: '🌀', type: 'classic', xpReward: 0, startMonth: 4 },
  { id: 'c2', title: '第一次獨立坐', description: '脊椎力量 UP', icon: '🧘', type: 'classic', xpReward: 0, startMonth: 7 },
  { id: 'c3', title: '第一次爬行', description: '探索世界的第一步', icon: '🐾', type: 'classic', xpReward: 0, startMonth: 8 },
  { id: 'c5', title: '第一次捏取物品', description: '精細動作發展', icon: '🤏', type: 'classic', xpReward: 0, startMonth: 8 },
  { id: 'c8', title: '第一次揮手掰掰', description: '明白離別的意義', icon: '👋', type: 'classic', xpReward: 0, startMonth: 10 },
  { id: 'c4', title: '第一次放手走路', description: '雙腳站立的感動', icon: '🚶', type: 'classic', xpReward: 0, startMonth: 11 },
  { id: 'c7', title: '第一次叫爸爸/媽媽', description: '最動聽的聲音', icon: '🗣️', type: 'classic', xpReward: 0, startMonth: 11 },
  
  // ================= 1-2歲經典主線成就 =================
  { id: 'c_word', title: '說出第一個主動單字', description: '說出爸爸媽媽之外有意義的單字，如「要」、「不要」', icon: '💬', type: 'classic', xpReward: 0, startMonth: 12 },
  { id: 'c_parts', title: '指認身體五官', description: '能聽懂指令正確指認眼睛、鼻子或耳朵等部位', icon: '👃', type: 'classic', xpReward: 0, startMonth: 12 },
  { id: 'c_run', title: '第一次平穩小跑步', description: '小步伐快跑，開始追趕世界', icon: '🏃', type: 'classic', xpReward: 0, startMonth: 15 },
  { id: 'c_blocks', title: '疊起高高積木塔', description: '成功將 4 塊積木重疊堆高而不倒下', icon: '🧱', type: 'classic', xpReward: 0, startMonth: 15 },
  { id: 'c_doodle', title: '小畫家靈魂覺醒', description: '拿起畫筆在紙上隨意塗鴉、畫線條', icon: '🎨', type: 'classic', xpReward: 0, startMonth: 15 },
  { id: 'c_helper', title: '熱心家務小幫手', description: '熱衷模仿大人拿抹布擦桌子或收拾歸位玩具', icon: '🧹', type: 'classic', xpReward: 0, startMonth: 15 },
  { id: 'c_kick', title: '第一次金雞獨立踢球', description: '能抬起一隻腳向前踢球而不失去平衡跌倒', icon: '⚽', type: 'classic', xpReward: 0, startMonth: 18 },

  // ================= 2-5歲經典主線成就 =================
  { id: 'c11', title: '第一次雙腳跳', description: '雙腳離地跳躍的瞬間', icon: '🐰', type: 'classic', xpReward: 0, startMonth: 24 },
  { id: 'c12', title: '第一次戒尿布', description: '告別尿布，自主如廁的里程碑', icon: '🚽', type: 'classic', xpReward: 0, startMonth: 30 },
  { id: 'c_one_foot', title: '扶手單腳站立', description: '能單腳站立保持平衡 3 秒以上，身體協調大躍進', icon: '🦩', type: 'classic', xpReward: 0, startMonth: 36 },
  { id: 'c_draw_circle', title: '成功模仿畫圓圈', description: '手部精細動作精準控制，能閉合線條畫出大圓形', icon: '⭕', type: 'classic', xpReward: 0, startMonth: 36 },
  { id: 'c_wash_hands', title: '第一次自己洗手擦乾', description: '學會打開水龍頭、抹肥皂並把雙手擦乾', icon: '🧼', type: 'classic', xpReward: 0, startMonth: 36 },
  { id: 'c_tell_name', title: '清楚說出自己姓名', description: '自我意識與語言表達更成熟，能向人介紹自己', icon: '📛', type: 'classic', xpReward: 0, startMonth: 36 },
  { id: 'c_stairs', title: '不扶欄杆上下樓梯', description: '不需要扶持欄杆，能雙腳交替流暢地上下樓梯', icon: '🪜', type: 'classic', xpReward: 0, startMonth: 48 },
  { id: 'c_draw_cross', title: '成功模仿畫十字線', description: '空間與運筆控制能力大突破，畫出橫豎交叉的十字', icon: '➕', type: 'classic', xpReward: 0, startMonth: 48 },
  { id: 'c_colors', title: '正確辨識四種顏色', description: '認知概念大躍進，能精確指認紅、黃、藍、綠四色', icon: '🌈', type: 'classic', xpReward: 0, startMonth: 48 },
  { id: 'c_draw_triangle', title: '成功模仿畫三角形', description: '精細動作與視覺空間認知高度發展，畫出有斜角的三角形', icon: '🔺', type: 'classic', xpReward: 0, startMonth: 60 },

  // ================= 0-1歲 隱藏版成就 =================
  // 隱藏版成就 (天使)
  { id: 'h_sleep', title: '睡神附體', description: '單次連續睡眠 > 8 小時', icon: '😴', type: 'hidden_angel', xpReward: 100, startMonth: 0 },
  { id: 'h_heal', title: '治癒魔法', description: '連續 3 天正向情緒', icon: '✨', type: 'hidden_angel', xpReward: 150, startMonth: 0 },
  { id: 'h_vaccine', title: '無痛晉級', description: '疫苗接種當日沒有暴哭', icon: '💉', type: 'hidden_angel', xpReward: 120, startMonth: 0 },
  // 隱藏版成就 (惡魔)
  { id: 'h_poop', title: '生化武器', description: '遭遇炸屎大魔王', icon: '☢️', type: 'hidden_demon', xpReward: 50, startMonth: 0 },
  { id: 'h_scissor', title: '理智線剪刀手', description: '記錄到抓扯等物理攻擊', icon: '✂️', type: 'hidden_demon', xpReward: 50, startMonth: 0 },
  { id: 'h_dj', title: '午夜 DJ', description: '連續凌晨 2-4 點驚啼', icon: '🎧', type: 'hidden_demon', xpReward: 80, startMonth: 0 },
  // 隱藏版成就 (中立)
  { id: 'h_speedrun', title: '新手村速通大師', description: '提早解鎖 3 個以上主線成就', icon: '🚀', type: 'hidden_neutral', xpReward: 300, startMonth: 0 },

  // ================= 1-2歲 隱藏版成就 =================
  // 隱藏版成就 (天使)
  { id: 'h_plates_cleaner', title: '乾淨空盤大師', description: '食物全部吃光，連續 3 次飲食無拒食紀錄', icon: '🍽️', type: 'hidden_angel', xpReward: 120, startMonth: 12 },
  { id: 'h_polite', title: '禮貌模範生', description: '每天拜拜/飛吻/分享玩具，連續記錄 3 次主動示好動作', icon: '🥰', type: 'hidden_angel', xpReward: 150, startMonth: 12 },
  { id: 'h_explorer', title: '勇敢小小探險家', description: '主動探索新事物或打針時非常勇敢', icon: '🧭', type: 'hidden_angel', xpReward: 120, startMonth: 12 },
  // 隱藏版成就 (惡魔)
  { id: 'h_tantrum', title: '尖叫尖叫再尖叫', description: '遭遇地上打滾耍賴或高強度不要不要期情緒爆發', icon: '😫', type: 'hidden_demon', xpReward: 60, startMonth: 12 },
  { id: 'h_gravity', title: '重力實驗科學家', description: '連續丟扔食物或玩具超過 3 次以上', icon: '🍎', type: 'hidden_demon', xpReward: 60, startMonth: 12 },
  { id: 'h_stroller_run', title: '安全帶逃脫魔術師', description: '換尿布或坐嬰兒車時上演金蟬脫殼/逃跑', icon: '🏃‍♂️', type: 'hidden_demon', xpReward: 80, startMonth: 12 },
  // 隱藏版成就 (中立)
  { id: 'h_curious', title: '好奇心殺死貓', description: '探索並成功解鎖 2 個以上的 1-2 歲經典主線成就', icon: '🐈', type: 'hidden_neutral', xpReward: 250, startMonth: 12 },

  // ================= 2-5歲 隱藏版成就 =================
  // 隱藏版成就 (天使)
  { id: 'h_potty_hero', title: '馬桶小勇士', description: '成功自主如廁或完成戒尿布的偉大進化', icon: '🚽', type: 'hidden_angel', xpReward: 200, startMonth: 24 },
  { id: 'h_sharing', title: '分享大天使', description: '主動將玩具或點心分享給身邊的小朋友', icon: '🎁', type: 'hidden_angel', xpReward: 150, startMonth: 24 },
  { id: 'h_story_master', title: '說故事大師', description: '用完整的句子表達一個天馬行空的小故事', icon: '📖', type: 'hidden_angel', xpReward: 150, startMonth: 24 },
  // 隱藏版成就 (惡魔)
  { id: 'h_why', title: '十萬個為什麼轟炸', description: '連續問「為什麼」到爸媽理智線斷裂', icon: '❓', type: 'hidden_demon', xpReward: 60, startMonth: 24 },
  { id: 'h_picasso', title: '牆面畢卡索', description: '用畫筆在客廳牆壁或床單沙發上留下驚世神作', icon: '🖌️', type: 'hidden_demon', xpReward: 80, startMonth: 24 },
  { id: 'h_bossy', title: '我是這裡的國王', description: '連續大喊「我的、我的」展現超級霸道掌控慾', icon: '👑', type: 'hidden_demon', xpReward: 60, startMonth: 24 },
  // 隱藏版成就 (中立)
  { id: 'h_grow_up', title: '吾家幼苗初長成', description: '順利達到 Level 10 以上並解鎖 2-5 歲主線成就', icon: '🌱', type: 'hidden_neutral', xpReward: 300, startMonth: 24 },

  // ================= 疫苗常規常識 =================
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

  // 高齡主線成就 (保留原版中與新版不重複的部分)
  { id: 'c9', title: '第一次說句子', description: '能說出 3 個字以上的短句', icon: '💬', type: 'classic', xpReward: 0, startMonth: 18 },
  { id: 'c10', title: '第一次自己吃飯', description: '成功使用湯匙將食物送入口', icon: '🥄', type: 'classic', xpReward: 0, startMonth: 15 },
];
