import React from 'react';

export function NeutralBaby({ isSick }: { isSick?: boolean }) {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img 
        src={`${import.meta.env.BASE_URL}neutral-baby${isSick ? '-sick' : ''}.png`} 
        alt="Neutral Baby" 
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full pointer-events-none select-none ${isSick ? 'filter grayscale-[30%] sepia-[40%] hue-rotate-[60deg]' : ''}`}>
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF0E6" />
        </radialGradient>
        <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      {/* 身體: 圓潤寶寶 */}
      <path d="M 65 140 C 65 140, 45 160, 50 180 C 70 185, 130 185, 150 180 C 155 160, 135 140, 135 140 C 120 160, 80 160, 65 140 Z" fill="#FFFFFF" stroke="#8C6F63" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 65 140 C 55 125, 60 100, 75 90 C 85 95, 115 95, 125 90 C 140 100, 145 125, 135 140 C 120 160, 80 160, 65 140 Z" fill="#FFFFFF" stroke="#8C6F63" strokeWidth="2.5" strokeLinejoin="round" />

      {/* 頭部曲線 */}
      <path d="M 56 60 C 56 30, 144 30, 144 60 C 144 95, 120 108, 100 108 C 80 108, 56 95, 56 60 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />
      
      {/* 耳朵 */}
      <path d="M 56 65 C 46 65, 46 55, 56 55 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />
      <path d="M 144 65 C 154 65, 154 55, 144 55 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />

      {/* 腮紅 */}
      <ellipse cx="68" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      <ellipse cx="132" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      
      {/* 眼睛: 無辜大眼 */}
      <ellipse cx="78" cy="70" rx="6" ry="8" fill="#4A3B32" />
      <circle cx="76" cy="67" r="2.5" fill="#FFFFFF" />
      <circle cx="80" cy="72" r="1.5" fill="#FFFFFF" opacity="0.8" />
      
      <ellipse cx="122" cy="70" rx="6" ry="8" fill="#4A3B32" />
      <circle cx="120" cy="67" r="2.5" fill="#FFFFFF" />
      <circle cx="124" cy="72" r="1.5" fill="#FFFFFF" opacity="0.8" />

      {/* 嘴巴 (單純微笑) */}
      <path d="M 96 86 C 98 89, 102 89, 104 86" fill="none" stroke="#8C6F63" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* 頭上一根胎毛 */}
      <path d="M 100 30 C 95 20, 105 10, 102 5" fill="none" stroke="#8C6F63" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PlayfulAngel({ isSick }: { isSick?: boolean }) {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img 
        src={`${import.meta.env.BASE_URL}playful-angel${isSick ? '-sick' : ''}.png`} 
        alt="Playful Angel" 
        className={`w-full h-full object-contain drop-shadow-md pointer-events-none select-none`}
        draggable={false}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full pointer-events-none select-none ${isSick ? 'filter grayscale-[30%] sepia-[40%] hue-rotate-[60deg]' : ''}`}>
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF0E6" />
        </radialGradient>
        <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="smallWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF7D6" />
        </linearGradient>
      </defs>
      
      {/* 小羽翼 (動畫浮動) */}
      <path d="M 60 110 C 40 100, 20 80, 20 60 C 40 70, 50 80, 55 90 C 40 105, 50 120, 60 110 Z" fill="url(#smallWingGrad)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" className="origin-[60px_110px] animate-[bounce_3s_ease-in-out_infinite]" />
      <path d="M 140 110 C 160 100, 180 80, 180 60 C 160 70, 150 80, 145 90 C 160 105, 150 120, 140 110 Z" fill="url(#smallWingGrad)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" className="origin-[140px_110px] animate-[bounce_3s_ease-in-out_infinite]" />

      {/* 身體/長袍 */}
      <path d="M 65 140 C 65 140, 45 160, 50 180 C 70 185, 130 185, 150 180 C 155 160, 135 140, 135 140 C 120 160, 80 160, 65 140 Z" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 65 140 C 55 125, 60 100, 75 90 C 85 95, 115 95, 125 90 C 140 100, 145 125, 135 140 C 120 160, 80 160, 65 140 Z" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2.5" strokeLinejoin="round" />

      {/* 頭部曲線 */}
      <path d="M 56 60 C 56 30, 144 30, 144 60 C 144 95, 120 108, 100 108 C 80 108, 56 95, 56 60 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />
      
      {/* 耳朵 */}
      <path d="M 56 65 C 46 65, 46 55, 56 55 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />
      <path d="M 144 65 C 154 65, 154 55, 144 55 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />

      {/* 腮紅 */}
      <ellipse cx="68" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      <ellipse cx="132" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      
      {/* 眼睛: 眨眼調皮 */}
      <path d="M 70 70 C 75 65, 81 65, 86 70" fill="none" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />
      
      <ellipse cx="122" cy="70" rx="6" ry="8" fill="#4A3B32" />
      <circle cx="120" cy="67" r="2.5" fill="#FFFFFF" />
      <circle cx="124" cy="72" r="1.5" fill="#FFFFFF" opacity="0.8" />

      {/* 嘴巴 (吐舌) */}
      <path d="M 96 86 C 98 89, 102 89, 104 86" fill="none" stroke="#8C6F63" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 98 88 C 98 94, 102 94, 102 88 Z" fill="#FFB6C1" stroke="#8C6F63" strokeWidth="1.5" strokeLinejoin="round" />

      {/* 頭髮 */}
      <path d="M 100 30 C 110 20, 115 10, 105 10 C 95 10, 85 20, 100 30 Z" fill="#FFD700" stroke="#D4AF37" strokeWidth="1.5" />
      
      {/* 小光環 */}
      <ellipse cx="100" cy="18" rx="20" ry="6" fill="none" stroke="#FFD700" strokeWidth="2.5" className="animate-[pulse_2s_ease-in-out_infinite]" />
    </svg>
  );
}

export function Angel({ isSick }: { isSick?: boolean }) {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img 
        src={`${import.meta.env.BASE_URL}angel${isSick ? '-sick' : ''}.png`} 
        alt="Angel" 
        className={`w-full h-full object-contain drop-shadow-md pointer-events-none select-none`}
        draggable={false}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full pointer-events-none select-none ${isSick ? 'filter grayscale-[30%] sepia-[40%] hue-rotate-[60deg]' : ''}`}>
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF0E6" />
        </radialGradient>
        <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="mediumWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF2B2" />
        </linearGradient>
      </defs>
      
      {/* 標準羽翼 (動畫浮動) */}
      <path d="M 65 105 C 15 90, 0 35, 10 30 C 30 50, 45 40, 60 50 C 35 70, 30 85, 45 95 C 40 85, 45 70, 60 65 C 50 85, 55 100, 65 105 Z" fill="url(#mediumWingGrad)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" className="origin-[65px_105px] animate-[bounce_3.5s_ease-in-out_infinite]" />
      <path d="M 135 105 C 185 90, 200 35, 190 30 C 170 50, 155 40, 140 50 C 165 70, 170 85, 155 95 C 160 85, 155 70, 140 65 C 150 85, 145 100, 135 105 Z" fill="url(#mediumWingGrad)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" className="origin-[135px_105px] animate-[bounce_3.5s_ease-in-out_infinite]" />

      {/* 身體/長袍 */}
      <path d="M 65 140 C 65 140, 45 160, 50 180 C 70 185, 130 185, 150 180 C 155 160, 135 140, 135 140 C 120 160, 80 160, 65 140 Z" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 65 140 C 55 125, 60 100, 75 90 C 85 95, 115 95, 125 90 C 140 100, 145 125, 135 140 C 120 160, 80 160, 65 140 Z" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2.5" strokeLinejoin="round" />

      {/* 頭部曲線 */}
      <path d="M 56 60 C 56 30, 144 30, 144 60 C 144 95, 120 108, 100 108 C 80 108, 56 95, 56 60 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />
      
      {/* 耳朵 */}
      <path d="M 56 65 C 46 65, 46 55, 56 55 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />
      <path d="M 144 65 C 154 65, 154 55, 144 55 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />

      {/* 腮紅 */}
      <ellipse cx="68" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      <ellipse cx="132" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      
      {/* 眼睛: 溫柔眼 */}
      <path d="M 68 68 C 73 64, 80 64, 85 68" fill="none" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="76.5" cy="72" rx="4" ry="5" fill="#4A3B32" />
      <circle cx="75" cy="70" r="1.5" fill="#FFFFFF" />

      <path d="M 132 68 C 127 64, 120 64, 115 68" fill="none" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="123.5" cy="72" rx="4" ry="5" fill="#4A3B32" />
      <circle cx="122" cy="70" r="1.5" fill="#FFFFFF" />

      {/* 嘴巴 (單純微笑) */}
      <path d="M 96 86 C 98 89, 102 89, 104 86" fill="none" stroke="#8C6F63" strokeWidth="1.5" strokeLinecap="round" />

      {/* 頭髮 */}
      <path d="M 100 28 C 115 15, 130 25, 125 40 C 115 35, 105 32, 100 35 C 95 32, 85 35, 75 40 C 70 25, 85 15, 100 28 Z" fill="#FFD700" stroke="#D4AF37" strokeWidth="1.5" />
      
      {/* 中型光環 */}
      <ellipse cx="100" cy="18" rx="26" ry="8" fill="none" stroke="#FFD700" strokeWidth="3" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
    </svg>
  );
}

export function Archangel({ isSick }: { isSick?: boolean }) {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img 
        src={`${import.meta.env.BASE_URL}archangel${isSick ? '-sick' : ''}.png`} 
        alt="Archangel" 
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full pointer-events-none select-none ${isSick ? 'filter grayscale-[30%] sepia-[40%] hue-rotate-[60deg]' : ''}`}>
      <defs>
        {/* [Layer 1] 背景微光 */}
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF7D6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFF7D6" stopOpacity="0" />
        </radialGradient>
        
        {/* Skin Gradient */}
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF0E6" />
        </radialGradient>
        
        {/* [Layer 4] 腮紅透紅感 */}
        <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0"/>
        </radialGradient>
        
        {/* 羽翼漸層 */}
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF2B2" />
        </linearGradient>

        <linearGradient id="wingGradInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFE4A0" />
        </linearGradient>

        {/* 光環漸層 */}
        <linearGradient id="haloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFB067" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Layer 1: Background Glow */}
      <circle cx="100" cy="100" r="90" fill="url(#bgGlow)" />

      {/* [Layer 2] 羽翼系統: 對稱的雙層羽翼 */}
      {/* Left Outer Wing (Animated) */}
      <path d="M 80 110 C 20 100, 5 40, 5 30 C 25 45, 45 45, 60 40 C 35 65, 25 80, 45 95 C 40 85, 45 65, 65 60 C 55 80, 55 100, 80 110 Z" fill="url(#wingGrad)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" className="origin-[80px_110px] animate-[bounce_4s_ease-in-out_infinite]" />
      
      {/* Right Outer Wing (Animated) */}
      <path d="M 120 110 C 180 100, 195 40, 195 30 C 175 45, 155 45, 140 40 C 165 65, 175 80, 155 95 C 160 85, 155 65, 135 60 C 145 80, 145 100, 120 110 Z" fill="url(#wingGrad)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" className="origin-[120px_110px] animate-[bounce_4s_ease-in-out_infinite]" />

      {/* Left Inner Wing (Animated slightly faster) */}
      <path d="M 85 120 C 40 115, 20 70, 15 60 C 35 70, 50 75, 65 70 C 45 90, 40 100, 55 110 C 50 95, 55 85, 70 80 C 60 100, 65 115, 85 120 Z" fill="url(#wingGradInner)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" className="origin-[85px_120px] animate-[bounce_3s_ease-in-out_infinite]" />

      {/* Right Inner Wing (Animated slightly faster) */}
      <path d="M 115 120 C 160 115, 180 70, 185 60 C 165 70, 150 75, 135 70 C 155 90, 160 100, 145 110 C 150 95, 145 85, 130 80 C 140 100, 135 115, 115 120 Z" fill="url(#wingGradInner)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" className="origin-[115px_120px] animate-[bounce_3s_ease-in-out_infinite]" />

      {/* [Layer 5] 混合冠冕 (Halo Backend Part) */}
      <ellipse cx="100" cy="25" rx="36" ry="12" fill="none" stroke="url(#haloGrad)" strokeWidth="5" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
      
      {/* [Layer 3] 身體與頭部 */}
      {/* Cloud Base/Robe */}
      <path d="M 65 140 C 65 140, 45 160, 50 180 C 70 185, 130 185, 150 180 C 155 160, 135 140, 135 140 C 120 160, 80 160, 65 140 Z" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 80 160 C 90 175, 110 175, 120 160" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />

      {/* Body / Main Robe */}
      <path d="M 65 140 C 55 125, 60 100, 75 90 C 85 95, 115 95, 125 90 C 140 100, 145 125, 135 140 C 120 160, 80 160, 65 140 Z" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2.5" strokeLinejoin="round" />
      
      {/* Golden Details on Robe */}
      <path d="M 75 90 C 85 105, 115 105, 125 90" fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
      <path d="M 100 102 L 100 135" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 3"/>

      {/* Head Outline (Organic curve) */}
      <path d="M 56 60 C 56 30, 144 30, 144 60 C 144 95, 120 108, 100 108 C 80 108, 56 95, 56 60 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />
      
      {/* Ears */}
      <path d="M 56 65 C 46 65, 46 55, 56 55 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />
      <path d="M 144 65 C 154 65, 154 55, 144 55 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />

      {/* [Layer 4] 臉部細節 */}
      {/* Cheeks */}
      <ellipse cx="68" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      <ellipse cx="132" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      
      {/* Eyes: large, bright dark eyes with highlights */}
      {/* Left Eye */}
      <ellipse cx="78" cy="70" rx="6" ry="8" fill="#4A3B32" />
      <circle cx="76" cy="67" r="2.5" fill="#FFFFFF" />
      <circle cx="80" cy="72" r="1.5" fill="#FFFFFF" opacity="0.8" />
      <path d="M 70 62 C 75 57, 81 57, 86 62" fill="none" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />
      <path d="M 68 68 C 71 65, 75 66, 75 66" fill="none" stroke="#4A3B32" strokeWidth="1.5" strokeLinecap="round" />

      {/* Right Eye */}
      <ellipse cx="122" cy="70" rx="6" ry="8" fill="#4A3B32" />
      <circle cx="120" cy="67" r="2.5" fill="#FFFFFF" />
      <circle cx="124" cy="72" r="1.5" fill="#FFFFFF" opacity="0.8" />
      <path d="M 130 62 C 125 57, 119 57, 114 62" fill="none" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />
      <path d="M 132 68 C 129 65, 125 66, 125 66" fill="none" stroke="#4A3B32" strokeWidth="1.5" strokeLinecap="round" />

      {/* Tiny smile */}
      <path d="M 96 86 C 98 89, 102 89, 104 86" fill="none" stroke="#8C6F63" strokeWidth="1.5" strokeLinecap="round" />

      {/* Hair Details */}
      <path d="M 100 28 C 120 28, 135 38, 140 50 C 130 35, 110 32, 100 38 C 90 32, 70 35, 60 50 C 65 38, 80 28, 100 28 Z" fill="#FFD700" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" />

      {/* [Layer 5] 混合冠冕 (Front Glowing dots and stars) */}
      <circle cx="100" cy="15" r="3" fill="#FFFFFF" className="animate-ping" />
      <circle cx="80" cy="20" r="2" fill="#FFD700" className="animate-[pulse_1.5s_ease-in-out_infinite]" />
      <circle cx="120" cy="20" r="2" fill="#FFD700" className="animate-[pulse_2s_ease-in-out_infinite]" />
      <path d="M 100 8 L 100 22 M 93 15 L 107 15" stroke="#FFF7D6" strokeWidth="1.5" strokeLinecap="round" />

    </svg>
  );
}

export function PlayfulImp({ isSick }: { isSick?: boolean }) {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img 
        src={`${import.meta.env.BASE_URL}playful-imp${isSick ? '-sick' : ''}.png`} 
        alt="Playful Imp" 
        className={`w-full h-full object-contain drop-shadow-md pointer-events-none select-none`}
        draggable={false}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full pointer-events-none select-none ${isSick ? 'filter grayscale-[30%] sepia-[40%] hue-rotate-[60deg]' : ''}`}>
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF0E6" />
        </radialGradient>
        <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="smallBatWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8A2BE2" />
          <stop offset="100%" stopColor="#4B0082" />
        </linearGradient>
      </defs>
      
      {/* 小蝠翼 (動畫浮動) */}
      <path d="M 60 110 C 50 100, 30 90, 20 70 C 35 75, 45 80, 50 90 C 45 100, 50 105, 60 110 Z" fill="url(#smallBatWingGrad)" stroke="#191970" strokeWidth="1.5" strokeLinejoin="round" className="origin-[60px_110px] animate-[bounce_3s_ease-in-out_infinite]" />
      <path d="M 140 110 C 150 100, 170 90, 180 70 C 165 75, 155 80, 150 90 C 155 100, 150 105, 140 110 Z" fill="url(#smallBatWingGrad)" stroke="#191970" strokeWidth="1.5" strokeLinejoin="round" className="origin-[140px_110px] animate-[bounce_3s_ease-in-out_infinite]" />

      {/* 身體/惡魔裝 */}
      <path d="M 65 140 C 65 140, 45 160, 50 180 C 70 185, 130 185, 150 180 C 155 160, 135 140, 135 140 C 120 160, 80 160, 65 140 Z" fill="#2F4F4F" stroke="#191970" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 65 140 C 55 125, 60 100, 75 90 C 85 95, 115 95, 125 90 C 140 100, 145 125, 135 140 C 120 160, 80 160, 65 140 Z" fill="#2F4F4F" stroke="#191970" strokeWidth="2.5" strokeLinejoin="round" />
      
      {/* 肚子淺色區域 */}
      <path d="M 75 130 C 85 170, 115 170, 125 130 C 120 110, 80 110, 75 130 Z" fill="#708090" stroke="#191970" strokeWidth="1.5" />

      {/* 頭部曲線 */}
      <path d="M 56 60 C 56 30, 144 30, 144 60 C 144 95, 120 108, 100 108 C 80 108, 56 95, 56 60 Z" fill="url(#skinGrad)" stroke="#191970" strokeWidth="2.5" />
      
      {/* 尖耳 */}
      <path d="M 58 65 C 40 50, 35 45, 50 40 C 55 45, 56 55, 58 65 Z" fill="url(#skinGrad)" stroke="#191970" strokeWidth="2.5" />
      <path d="M 142 65 C 160 50, 165 45, 150 40 C 145 45, 144 55, 142 65 Z" fill="url(#skinGrad)" stroke="#191970" strokeWidth="2.5" />

      {/* 小尖角 */}
      <path d="M 75 35 C 70 20, 65 15, 80 30" fill="#8B0000" stroke="#191970" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 125 35 C 130 20, 135 15, 120 30" fill="#8B0000" stroke="#191970" strokeWidth="2" strokeLinejoin="round" />

      {/* 腮紅 */}
      <ellipse cx="68" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      <ellipse cx="132" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      
      {/* 眼睛: 貓眼調皮 */}
      <path d="M 68 72 C 73 66, 80 66, 86 72 C 80 78, 73 78, 68 72 Z" fill="#FFFFFF" stroke="#191970" strokeWidth="2" />
      <circle cx="76.5" cy="72" r="3.5" fill="#8B0000" />
      <circle cx="77.5" cy="71" r="1" fill="#FFFFFF" />

      <path d="M 132 72 C 127 66, 120 66, 115 72 C 120 78, 127 78, 132 72 Z" fill="#FFFFFF" stroke="#191970" strokeWidth="2" />
      <circle cx="123.5" cy="72" r="3.5" fill="#8B0000" />
      <circle cx="122.5" cy="71" r="1" fill="#FFFFFF" />

      {/* 嘴巴 (尖牙吐舌) */}
      <path d="M 94 86 C 100 89, 106 86, 106 86" fill="none" stroke="#191970" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 96 86 L 98 90 L 100 87" fill="#FFFFFF" stroke="#191970" strokeWidth="1" />
      
      {/* 惡魔尾巴 */}
      <path d="M 145 160 C 170 150, 180 130, 175 115 C 180 120, 185 110, 175 115 L 180 110 L 170 112 Z" fill="none" stroke="#2F4F4F" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 175 115 L 180 110 L 170 112 Z" fill="#8B0000" stroke="#191970" strokeWidth="1" />
    </svg>
  );
}

export function Demon({ isSick }: { isSick?: boolean }) {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img 
        src={`${import.meta.env.BASE_URL}demon${isSick ? '-sick' : ''}.png`} 
        alt="Demon" 
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full pointer-events-none select-none ${isSick ? 'filter grayscale-[30%] sepia-[40%] hue-rotate-[60deg]' : ''}`}>
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF0E6" />
        </radialGradient>
        <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="medBatWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#191970" />
        </linearGradient>
      </defs>
      
      {/* 標準蝠翼 (動畫浮動) */}
      <path d="M 65 105 C 50 85, 20 60, 10 40 C 30 50, 45 60, 50 80 C 40 90, 45 100, 65 105 Z" fill="url(#medBatWingGrad)" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" className="origin-[65px_105px] animate-[bounce_3.5s_ease-in-out_infinite]" />
      <path d="M 40 45 C 10 45, -5 20, 0 10 C 20 20, 35 30, 40 45 Z" fill="url(#medBatWingGrad)" stroke="#000000" strokeWidth="1.5" className="origin-[65px_105px] animate-[bounce_3.5s_ease-in-out_infinite]" />
      
      <path d="M 135 105 C 150 85, 180 60, 190 40 C 170 50, 155 60, 150 80 C 160 90, 155 100, 135 105 Z" fill="url(#medBatWingGrad)" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" className="origin-[135px_105px] animate-[bounce_3.5s_ease-in-out_infinite]" />
      <path d="M 160 45 C 190 45, 205 20, 200 10 C 180 20, 165 30, 160 45 Z" fill="url(#medBatWingGrad)" stroke="#000000" strokeWidth="1.5" className="origin-[135px_105px] animate-[bounce_3.5s_ease-in-out_infinite]" />

      {/* 身體/惡魔長袍 */}
      <path d="M 65 140 C 65 140, 45 160, 50 180 C 70 185, 130 185, 150 180 C 155 160, 135 140, 135 140 C 120 160, 80 160, 65 140 Z" fill="#1C1C1C" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 65 140 C 55 125, 60 100, 75 90 C 85 95, 115 95, 125 90 C 140 100, 145 125, 135 140 C 120 160, 80 160, 65 140 Z" fill="#1C1C1C" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
      
      {/* 肚子紋路 */}
      <path d="M 75 130 C 85 170, 115 170, 125 130 C 120 110, 80 110, 75 130 Z" fill="#2F4F4F" stroke="#000000" strokeWidth="1.5" />

      {/* 頭部曲線 */}
      <path d="M 56 60 C 56 30, 144 30, 144 60 C 144 95, 120 108, 100 108 C 80 108, 56 95, 56 60 Z" fill="url(#skinGrad)" stroke="#191970" strokeWidth="2.5" />
      
      {/* 尖耳 */}
      <path d="M 58 65 C 35 45, 30 40, 45 35 C 50 40, 56 55, 58 65 Z" fill="url(#skinGrad)" stroke="#191970" strokeWidth="2.5" />
      <path d="M 142 65 C 165 45, 170 40, 155 35 C 150 40, 144 55, 142 65 Z" fill="url(#skinGrad)" stroke="#191970" strokeWidth="2.5" />

      {/* 尖角 */}
      <path d="M 70 35 C 65 15, 60 10, 85 25" fill="#4A0000" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 130 35 C 135 15, 140 10, 115 25" fill="#4A0000" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />

      {/* 腮紅 */}
      <ellipse cx="68" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      <ellipse cx="132" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      
      {/* 眼睛: 輕微邪氣且帶點調皮 */}
      <path d="M 68 70 C 73 66, 82 66, 86 70 C 82 76, 73 76, 68 70 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
      <circle cx="76.5" cy="70" r="4" fill="#4A0000" />
      <circle cx="77.5" cy="69" r="1.5" fill="#FFFFFF" />

      <path d="M 132 70 C 127 66, 118 66, 114 70 C 118 76, 127 76, 132 70 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
      <circle cx="123.5" cy="70" r="4" fill="#4A0000" />
      <circle cx="122.5" cy="69" r="1.5" fill="#FFFFFF" />

      {/* 嘴巴 (尖牙冷笑) */}
      <path d="M 94 86 C 100 89, 106 86, 106 86" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 94 86 L 96 90 L 98 87" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
      <path d="M 102 87 L 104 90 L 106 86" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
      
      {/* 較長的惡魔尾巴 */}
      <path d="M 145 160 C 180 150, 190 120, 185 100 C 190 105, 195 95, 185 100 L 190 95 L 180 97 Z" fill="none" stroke="#1C1C1C" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 185 100 L 190 95 L 180 97 Z" fill="#4A0000" stroke="#000000" strokeWidth="1" />
    </svg>
  );
}

export function Archdemon({ isSick }: { isSick?: boolean }) {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img 
        src={`${import.meta.env.BASE_URL}archdemon${isSick ? '-sick' : ''}.png`} 
        alt="Archdemon" 
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full pointer-events-none select-none ${isSick ? 'filter grayscale-[30%] sepia-[40%] hue-rotate-[60deg]' : ''}`}>
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF0E6" />
        </radialGradient>
        <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Dark Aura */}
      <circle cx="100" cy="90" r="85" fill="#4B0082" opacity="0.1" />
      
      {/* Huge Bat Wings */}
      <path d="M 60 100 Q -10 50 5 130 Q 25 100 40 145 Q 60 110 80 150" fill="#2F4F4F" stroke="#4F4F4F" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 140 100 Q 210 50 195 130 Q 175 100 160 145 Q 140 110 120 150" fill="#2F4F4F" stroke="#4F4F4F" strokeWidth="3" strokeLinejoin="round" />
      
      {/* Thick Tail */}
      <path d="M 130 160 Q 190 200 185 130" fill="none" stroke="#4F4F4F" strokeWidth="4" strokeLinecap="round" />
      <polygon points="185,130 170,115 195,115" fill="#4F4F4F" />

      {/* Stormy Cloud Base */}
      <path d="M 40 180 Q 20 180 20 155 Q 20 130 50 135 Q 60 105 100 110 Q 140 105 150 135 Q 180 130 180 155 Q 180 180 160 180 Z" fill="#696969" stroke="#4F4F4F" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 45 180 Q 70 195 100 185 Q 130 195 155 180" fill="#696969" stroke="#4F4F4F" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 70 160 L 65 175 M 100 165 L 95 185 M 130 160 L 125 175" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />

      {/* Gargoyle Onesie Body */}
      <path d="M 60 135 Q 40 150 45 170 Q 55 180 75 165 Q 100 175 125 165 Q 145 180 155 170 Q 160 150 140 135 Q 155 120 145 100 Q 130 85 100 90 Q 70 85 55 100 Q 45 120 60 135 Z" fill="#4B0082" stroke="#4F4F4F" strokeWidth="2.5" strokeLinejoin="round" />
      
      {/* Gargoyle Horns on Onesie */}
      <path d="M 45 90 Q 20 70 15 90 Z" fill="#2F4F4F" stroke="#4F4F4F" strokeWidth="2" />
      <path d="M 155 90 Q 180 70 185 90 Z" fill="#2F4F4F" stroke="#4F4F4F" strokeWidth="2" />
      
      {/* Spikes on back */}
      <polygon points="50,110 40,115 52,120" fill="#2F4F4F" />
      <polygon points="150,110 160,115 148,120" fill="#2F4F4F" />

      {/* Head */}
      <circle cx="100" cy="74" r="44" fill="url(#skinGrad)" stroke="#B38B7D" strokeWidth="2.5" />
      
      {/* Hair */}
      <path d="M 100 30 Q 110 15 105 10 Q 95 5 95 15 Q 85 5 80 15 Q 90 25 100 30 Z" fill="#8B0000" stroke="#4A2311" strokeWidth="1.5" />
      
      {/* Ears */}
      <path d="M 58 75 L 40 55 L 56 86 Z" fill="url(#skinGrad)" stroke="#B38B7D" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 142 75 L 160 55 L 144 86 Z" fill="url(#skinGrad)" stroke="#B38B7D" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Cheeks */}
      <ellipse cx="68" cy="86" rx="9" ry="6" fill="url(#blushGrad)" />
      <ellipse cx="132" cy="86" rx="9" ry="6" fill="url(#blushGrad)" />
      
      {/* Eyes (Fierce but cute) */}
      <path d="M 60 65 L 85 76" fill="none" stroke="#705345" strokeWidth="3" strokeLinecap="round" />
      <path d="M 140 65 L 115 76" fill="none" stroke="#705345" strokeWidth="3" strokeLinecap="round" />
      <path d="M 68 76 L 82 76" stroke="#8B0000" strokeWidth="6" strokeLinecap="round" />
      <path d="M 132 76 L 118 76" stroke="#8B0000" strokeWidth="6" strokeLinecap="round" />
      <circle cx="75" cy="76" r="3" fill="#FFD700" />
      <circle cx="125" cy="76" r="3" fill="#FFD700" />

      {/* Bib */}
      <path d="M 75 110 Q 100 145 125 110 Q 100 105 75 110 Z" fill="#141414" stroke="#8B0000" strokeWidth="2" strokeLinejoin="round" />
      
      {/* Cross/Pentagram Logo on Bib */}
      <polygon points="100,115 103,123 110,123 104,128 106,135 100,131 94,135 96,128 90,123 97,123" fill="#8B0000" />

      {/* Pacifier (Fanged) */}
      <path d="M 82 96 C 82 84, 118 84, 118 96 C 118 108, 82 108, 82 96 Z" fill="#141414" stroke="#8B0000" strokeWidth="2.5" />
      <circle cx="100" cy="96" r="8" fill="#8B0000" stroke="#141414" strokeWidth="2.5" />
      <polygon points="98,92 100,98 102,92" fill="#FFFFFF" />
    </svg>
  );
}

export function ChaosHybrid({ isSick }: { isSick?: boolean }) {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img 
        src={`${import.meta.env.BASE_URL}chaos-hybrid${isSick ? '-sick' : ''}.png`} 
        alt="Chaos Hybrid" 
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full pointer-events-none select-none ${isSick ? 'filter grayscale-[30%] sepia-[40%] hue-rotate-[60deg]' : ''}`}>
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF0E6" />
        </radialGradient>
        <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="smallWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF7D6" />
        </linearGradient>
        <linearGradient id="smallBatWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8A2BE2" />
          <stop offset="100%" stopColor="#4B0082" />
        </linearGradient>
      </defs>
      
      {/* 左邊：小羽翼 */}
      <path d="M 60 110 C 40 100, 20 80, 20 60 C 40 70, 50 80, 55 90 C 40 105, 50 120, 60 110 Z" fill="url(#smallWingGrad)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" className="origin-[60px_110px] animate-[bounce_3s_ease-in-out_infinite]" />
      
      {/* 右邊：小蝠翼 */}
      <path d="M 140 110 C 150 100, 170 90, 180 70 C 165 75, 155 80, 150 90 C 155 100, 150 105, 140 110 Z" fill="url(#smallBatWingGrad)" stroke="#191970" strokeWidth="1.5" strokeLinejoin="round" className="origin-[140px_110px] animate-[bounce_3.5s_ease-in-out_infinite]" />

      {/* 身體: 圓潤寶寶外加陰陽色調 */}
      <path d="M 65 140 C 65 140, 45 160, 50 180 C 70 185, 130 185, 150 180 C 155 160, 135 140, 135 140 C 120 160, 80 160, 65 140 Z" fill="#F0F8FF" stroke="#8C6F63" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 65 140 C 55 125, 60 100, 75 90 C 85 95, 115 95, 125 90 C 140 100, 145 125, 135 140 C 120 160, 80 160, 65 140 Z" fill="#F0F8FF" stroke="#8C6F63" strokeWidth="2.5" strokeLinejoin="round" />

      {/* 頭部曲線 */}
      <path d="M 56 60 C 56 30, 144 30, 144 60 C 144 95, 120 108, 100 108 C 80 108, 56 95, 56 60 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />
      
      {/* 耳朵 */}
      <path d="M 56 65 C 46 65, 46 55, 56 55 Z" fill="url(#skinGrad)" stroke="#8C6F63" strokeWidth="2.5" />
      <path d="M 144 65 C 160 55, 160 45, 144 55 Z" fill="url(#skinGrad)" stroke="#191970" strokeWidth="2" /> {/* 右耳微尖 */}

      {/* 腮紅 */}
      <ellipse cx="68" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      <ellipse cx="132" cy="80" rx="10" ry="7" fill="url(#blushGrad)" />
      
      {/* 眼睛: 一邊圓一邊微揚 */}
      <ellipse cx="78" cy="70" rx="6" ry="8" fill="#4A3B32" />
      <circle cx="76" cy="67" r="2.5" fill="#FFFFFF" />
      <circle cx="80" cy="72" r="1.5" fill="#FFFFFF" opacity="0.8" />
      
      <path d="M 132 72 C 127 66, 120 66, 115 72 C 120 78, 127 78, 132 72 Z" fill="#FFFFFF" stroke="#191970" strokeWidth="1.5" />
      <circle cx="123.5" cy="72" r="3.5" fill="#8B0000" />
      <circle cx="122.5" cy="71" r="1" fill="#FFFFFF" />

      {/* 嘴巴 (稍微邪笑) */}
      <path d="M 94 86 C 96 89, 102 90, 106 85" fill="none" stroke="#8C6F63" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* 左邊小光環 */}
      <ellipse cx="70" cy="20" rx="12" ry="3" fill="none" stroke="#FFD700" strokeWidth="2" className="animate-[pulse_2s_ease-in-out_infinite] origin-[70px_20px] rotate-[-15deg]" />
      
      {/* 右邊小尖角 */}
      <path d="M 115 30 C 120 15, 125 10, 110 25" fill="#8B0000" stroke="#191970" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function BackgroundStars() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDE7" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFDE7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="10%" cy="15%" r="6" fill="url(#starGlow)" className="animate-[pulse_3s_ease-in-out_infinite]" />
        <circle cx="85%" cy="25%" r="8" fill="url(#starGlow)" className="animate-[pulse_4s_ease-in-out_infinite_1s]" />
        <circle cx="20%" cy="80%" r="5" fill="url(#starGlow)" className="animate-[pulse_3.5s_ease-in-out_infinite_0.5s]" />
        <circle cx="75%" cy="75%" r="7" fill="url(#starGlow)" className="animate-[pulse_4.5s_ease-in-out_infinite_1.5s]" />
        <circle cx="50%" cy="10%" r="5" fill="url(#starGlow)" className="animate-[pulse_3s_ease-in-out_infinite_0.8s]" />
        <circle cx="90%" cy="60%" r="6" fill="url(#starGlow)" className="animate-[pulse_4s_ease-in-out_infinite_2s]" />
        <circle cx="30%" cy="40%" r="9" fill="url(#starGlow)" opacity="0.5" className="animate-[pulse_5s_ease-in-out_infinite_2s]" />
        <circle cx="60%" cy="50%" r="5" fill="url(#starGlow)" opacity="0.3" className="animate-[pulse_3s_ease-in-out_infinite_1s]" />
        
        {/* Minimalist Moon */}
        <g className="animate-[pulse_6s_ease-in-out_infinite]">
          <circle cx="85%" cy="15%" r="40" fill="url(#moonGlow)" opacity="0.4" />
          <path d="M 85 10 A 30 30 0 1 0 115 40 A 25 25 0 1 1 85 10 Z" fill="#FFFDE7" opacity="0.9" transform="translate(-20, -10)" />
        </g>
      </svg>
    </div>
  );
}
