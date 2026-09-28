export interface PresetAvatar {
  id: number;
  name: string;
  url: string;
}

interface AvatarRecipe {
  id: number;
  name: string;
  bg: string;
  faceColor: string;
  earType: 'dog' | 'cat' | 'bear' | 'bunny' | 'chick' | 'panda' | 'fox' | 'pig' | 'frog' | 'hamster';
  earColor: string;
  blushColor: string;
  eyeStyle: 'sparkle' | 'happy' | 'wink' | 'cool' | 'cute';
  mouthStyle: 'smile' | 'cat' | 'tongue' | 'beak' | 'open';
  accessory: 'none' | 'leaf' | 'bow' | 'crown' | 'sprout' | 'star' | 'beret' | 'halo' | 'flower' | 'bandana';
}

const AVATAR_RECIPES: AvatarRecipe[] = [
  { id: 1, name: 'Cún Shiba Kem Sữa', bg: '#FFE8CC', faceColor: '#F7B267', earType: 'dog', earColor: '#E08E45', blushColor: '#FF8FA3', eyeStyle: 'sparkle', mouthStyle: 'tongue', accessory: 'leaf' },
  { id: 2, name: 'Mèo Sữa Dâu Tây', bg: '#FFD6E0', faceColor: '#FFF5F7', earType: 'cat', earColor: '#FF9EBB', blushColor: '#FF758F', eyeStyle: 'cute', mouthStyle: 'cat', accessory: 'bow' },
  { id: 3, name: 'Gấu Pudding Caramel', bg: '#FDE4CF', faceColor: '#C68B59', earType: 'bear', earColor: '#8C583A', blushColor: '#F28482', eyeStyle: 'happy', mouthStyle: 'smile', accessory: 'sprout' },
  { id: 4, name: 'Thỏ Bông Tuyết Trắng', bg: '#E2F0CB', faceColor: '#FFFFFF', earType: 'bunny', earColor: '#FFB7B2', blushColor: '#FF9AA2', eyeStyle: 'sparkle', mouthStyle: 'cat', accessory: 'flower' },
  { id: 5, name: 'Vịt Vàng Mũm Mĩm', bg: '#FFF3B0', faceColor: '#FFD166', earType: 'chick', earColor: '#FFB703', blushColor: '#FB8500', eyeStyle: 'cute', mouthStyle: 'beak', accessory: 'sprout' },
  { id: 6, name: 'Gấu Trúc Bánh Bao', bg: '#D8F3DC', faceColor: '#FFFFFF', earType: 'panda', earColor: '#2B2D42', blushColor: '#FF8FA3', eyeStyle: 'sparkle', mouthStyle: 'smile', accessory: 'leaf' },
  { id: 7, name: 'Cáo Nhỏ Mật Ong', bg: '#FFEDD8', faceColor: '#F48C06', earType: 'fox', earColor: '#9D0208', blushColor: '#FF758F', eyeStyle: 'wink', mouthStyle: 'cat', accessory: 'star' },
  { id: 8, name: 'Heo Hồng Trân Châu', bg: '#FCE1E4', faceColor: '#FFC2D1', earType: 'pig', earColor: '#FF8FA3', blushColor: '#FB6F92', eyeStyle: 'happy', mouthStyle: 'tongue', accessory: 'bow' },
  { id: 9, name: 'Ếch Xanh Lá Mạ', bg: '#E9F5DB', faceColor: '#95D5B2', earType: 'frog', earColor: '#52B788', blushColor: '#FF9EBB', eyeStyle: 'cute', mouthStyle: 'smile', accessory: 'crown' },
  { id: 10, name: 'Hamster Hạt Dẻ', bg: '#F9EAE1', faceColor: '#E6B89C', earType: 'hamster', earColor: '#B5838D', blushColor: '#E5989B', eyeStyle: 'sparkle', mouthStyle: 'open', accessory: 'flower' },
  { id: 11, name: 'Cún Corgi Socola', bg: '#F4E1D2', faceColor: '#B07D62', earType: 'dog', earColor: '#7F5539', blushColor: '#FF8FA3', eyeStyle: 'wink', mouthStyle: 'tongue', accessory: 'bandana' },
  { id: 12, name: 'Mèo Tam Thể Vàng', bg: '#FFF1E6', faceColor: '#FFE5D9', earType: 'cat', earColor: '#F4A261', blushColor: '#E76F51', eyeStyle: 'sparkle', mouthStyle: 'cat', accessory: 'halo' },
  { id: 13, name: 'Gấu Bắc Cực Kem', bg: '#E0FBFC', faceColor: '#FFFFFF', earType: 'bear', earColor: '#BDE0FE', blushColor: '#FFAFCC', eyeStyle: 'cute', mouthStyle: 'smile', accessory: 'beret' },
  { id: 14, name: 'Thỏ Đào Tiên', bg: '#FFE5EC', faceColor: '#FFDAB9', earType: 'bunny', earColor: '#F4978E', blushColor: '#F08080', eyeStyle: 'happy', mouthStyle: 'tongue', accessory: 'bow' },
  { id: 15, name: 'Gà Con Năng Lượng', bg: '#FDFFB6', faceColor: '#FFEA00', earType: 'chick', earColor: '#FFAA00', blushColor: '#FF7B00', eyeStyle: 'wink', mouthStyle: 'beak', accessory: 'crown' },
  { id: 16, name: 'Panda Trà Sữa', bg: '#EDE0D4', faceColor: '#FAF0CA', earType: 'panda', earColor: '#5C3A21', blushColor: '#F28482', eyeStyle: 'cute', mouthStyle: 'open', accessory: 'sprout' },
  { id: 17, name: 'Cáo Tuyết Ngân Hà', bg: '#E2EAFC', faceColor: '#F8F9FA', earType: 'fox', earColor: '#A2D2FF', blushColor: '#FFAFCC', eyeStyle: 'sparkle', mouthStyle: 'smile', accessory: 'star' },
  { id: 18, name: 'Heo Sữa Bánh Quy', bg: '#FAE1DD', faceColor: '#FCD5CE', earType: 'pig', earColor: '#F8EDEB', blushColor: '#FEC5BB', eyeStyle: 'cool', mouthStyle: 'smile', accessory: 'beret' },
  { id: 19, name: 'Ếch Cốm Dừa', bg: '#D8F3DC', faceColor: '#74C69D', earType: 'frog', earColor: '#40916C', blushColor: '#FF8FA3', eyeStyle: 'wink', mouthStyle: 'tongue', accessory: 'leaf' },
  { id: 20, name: 'Hamster Phô Mai', bg: '#FFF3B0', faceColor: '#F9C74F', earType: 'hamster', earColor: '#F8961E', blushColor: '#F94144', eyeStyle: 'happy', mouthStyle: 'cat', accessory: 'star' },
  { id: 21, name: 'Cún Poodle Xốp Mềm', bg: '#F3D5B5', faceColor: '#D4A373', earType: 'dog', earColor: '#A98467', blushColor: '#FF758F', eyeStyle: 'cute', mouthStyle: 'smile', accessory: 'flower' },
  { id: 22, name: 'Mèo Đen Huyền Bí', bg: '#E5E5E5', faceColor: '#4A4E69', earType: 'cat', earColor: '#22223B', blushColor: '#FF8FA3', eyeStyle: 'cool', mouthStyle: 'cat', accessory: 'crown' },
  { id: 23, name: 'Gấu Nâu Mật Ngọt', bg: '#FDE2E4', faceColor: '#9C6644', earType: 'bear', earColor: '#7F4F24', blushColor: '#FF8FA3', eyeStyle: 'sparkle', mouthStyle: 'tongue', accessory: 'halo' },
  { id: 24, name: 'Thỏ Khoai Môn', bg: '#E8DFF5', faceColor: '#F3E8EE', earType: 'bunny', earColor: '#CDB4DB', blushColor: '#FFAFCC', eyeStyle: 'wink', mouthStyle: 'smile', accessory: 'flower' },
  { id: 25, name: 'Vịt Trắng Đáng Yêu', bg: '#CAF0F8', faceColor: '#FFFFFF', earType: 'chick', earColor: '#ADE8F4', blushColor: '#FF8FA3', eyeStyle: 'sparkle', mouthStyle: 'beak', accessory: 'beret' },
  { id: 26, name: 'Panda Hồng Đào', bg: '#FFE5D9', faceColor: '#FFF0F3', earType: 'panda', earColor: '#C9184A', blushColor: '#FF758F', eyeStyle: 'happy', mouthStyle: 'cat', accessory: 'bow' },
  { id: 27, name: 'Cáo Cam Rực Rỡ', bg: '#FFE8D6', faceColor: '#FB8500', earType: 'fox', earColor: '#D62828', blushColor: '#FFB703', eyeStyle: 'cool', mouthStyle: 'tongue', accessory: 'bandana' },
  { id: 28, name: 'Heo Vàng Phú Quý', bg: '#FFF8D6', faceColor: '#FFE169', earType: 'pig', earColor: '#FAD643', blushColor: '#FF758F', eyeStyle: 'sparkle', mouthStyle: 'open', accessory: 'crown' },
  { id: 29, name: 'Ếch Lá Sen', bg: '#E2F0CB', faceColor: '#80ED99', earType: 'frog', earColor: '#57CC99', blushColor: '#FF8FA3', eyeStyle: 'happy', mouthStyle: 'open', accessory: 'flower' },
  { id: 30, name: 'Hamster Kem Bơ', bg: '#F1FAEE', faceColor: '#FEFAE0', earType: 'hamster', earColor: '#DDA15E', blushColor: '#FF8FA3', eyeStyle: 'sparkle', mouthStyle: 'tongue', accessory: 'crown' },
];

function buildAvatarSvgDataUrl(r: AvatarRecipe): string {
  let earsSvg = '';
  if (r.earType === 'dog' || r.earType === 'fox') {
    earsSvg = `
      <polygon points="24,48 16,16 50,30" fill="${r.earColor}" stroke="#4A2511" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="96,48 104,16 70,30" fill="${r.earColor}" stroke="#4A2511" stroke-width="4" stroke-linejoin="round"/>
    `;
  } else if (r.earType === 'cat') {
    earsSvg = `
      <polygon points="22,52 22,18 52,32" fill="${r.faceColor}" stroke="#4A2511" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="27,44 27,25 45,34" fill="${r.earColor}"/>
      <polygon points="98,52 98,18 68,32" fill="${r.faceColor}" stroke="#4A2511" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="93,44 93,25 75,34" fill="${r.earColor}"/>
    `;
  } else if (r.earType === 'bunny') {
    earsSvg = `
      <ellipse cx="40" cy="24" rx="10" ry="22" fill="${r.faceColor}" stroke="#4A2511" stroke-width="4"/>
      <ellipse cx="40" cy="24" rx="5" ry="14" fill="${r.earColor}"/>
      <ellipse cx="80" cy="24" rx="10" ry="22" fill="${r.faceColor}" stroke="#4A2511" stroke-width="4"/>
      <ellipse cx="80" cy="24" rx="5" ry="14" fill="${r.earColor}"/>
    `;
  } else if (r.earType === 'frog') {
    earsSvg = `
      <circle cx="36" cy="36" r="14" fill="${r.faceColor}" stroke="#4A2511" stroke-width="4"/>
      <circle cx="84" cy="36" r="14" fill="${r.faceColor}" stroke="#4A2511" stroke-width="4"/>
    `;
  } else {
    // bear, panda, hamster, pig, chick
    earsSvg = `
      <circle cx="28" cy="34" r="14" fill="${r.earColor}" stroke="#4A2511" stroke-width="4"/>
      <circle cx="92" cy="34" r="14" fill="${r.earColor}" stroke="#4A2511" stroke-width="4"/>
    `;
  }

  let pandaPatches = '';
  if (r.earType === 'panda') {
    pandaPatches = `
      <ellipse cx="43" cy="64" rx="11" ry="9" transform="rotate(-15 43 64)" fill="${r.earColor}"/>
      <ellipse cx="77" cy="64" rx="11" ry="9" transform="rotate(15 77 64)" fill="${r.earColor}"/>
    `;
  }

  let eyesSvg = '';
  const eyeFill = r.earType === 'panda' ? '#FFFFFF' : '#3B1D0E';
  if (r.eyeStyle === 'happy') {
    eyesSvg = `
      <path d="M35 64 Q43 54 51 64" fill="none" stroke="${eyeFill}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M69 64 Q77 54 85 64" fill="none" stroke="${eyeFill}" stroke-width="4.5" stroke-linecap="round"/>
    `;
  } else if (r.eyeStyle === 'wink') {
    eyesSvg = `
      <circle cx="43" cy="63" r="6" fill="${eyeFill}"/>
      <circle cx="41" cy="61" r="2.2" fill="#FFFFFF"/>
      <path d="M69 63 Q77 55 85 63" fill="none" stroke="${eyeFill}" stroke-width="4.5" stroke-linecap="round"/>
    `;
  } else if (r.eyeStyle === 'cool') {
    eyesSvg = `
      <rect x="28" y="55" width="28" height="14" rx="4" fill="#22223B" stroke="#4A2511" stroke-width="3"/>
      <rect x="64" y="55" width="28" height="14" rx="4" fill="#22223B" stroke="#4A2511" stroke-width="3"/>
      <line x1="56" y1="61" x2="64" y2="61" stroke="#4A2511" stroke-width="3"/>
    `;
  } else {
    eyesSvg = `
      <circle cx="43" cy="63" r="6.5" fill="${eyeFill}"/>
      <circle cx="41" cy="60.5" r="2.5" fill="#FFFFFF"/>
      <circle cx="77" cy="63" r="6.5" fill="${eyeFill}"/>
      <circle cx="75" cy="60.5" r="2.5" fill="#FFFFFF"/>
    `;
  }

  let mouthSvg = '';
  if (r.mouthStyle === 'beak') {
    mouthSvg = `<polygon points="52,70 68,70 60,81" fill="#FB8500" stroke="#4A2511" stroke-width="3" stroke-linejoin="round"/>`;
  } else if (r.mouthStyle === 'tongue') {
    mouthSvg = `
      <path d="M52 74 Q60 80 68 74" fill="none" stroke="#4A2511" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M56 76 Q60 88 65 76 Z" fill="#FF758F" stroke="#4A2511" stroke-width="2.5"/>
    `;
  } else if (r.mouthStyle === 'cat') {
    mouthSvg = `
      <path d="M50 75 Q55 81 60 75 Q65 81 70 75" fill="none" stroke="#4A2511" stroke-width="3.5" stroke-linecap="round"/>
    `;
  } else if (r.mouthStyle === 'open') {
    mouthSvg = `
      <ellipse cx="60" cy="77" rx="7" ry="5.5" fill="#FF758F" stroke="#4A2511" stroke-width="3"/>
    `;
  } else {
    mouthSvg = `
      <path d="M51 74 Q60 83 69 74" fill="none" stroke="#4A2511" stroke-width="3.5" stroke-linecap="round"/>
    `;
  }

  let noseSvg = '';
  if (r.earType === 'pig') {
    noseSvg = `
      <ellipse cx="60" cy="69" rx="9" ry="6.5" fill="#FF8FA3" stroke="#4A2511" stroke-width="3"/>
      <circle cx="57" cy="69" r="1.8" fill="#4A2511"/>
      <circle cx="63" cy="69" r="1.8" fill="#4A2511"/>
    `;
  } else if (r.mouthStyle !== 'beak') {
    noseSvg = `<ellipse cx="60" cy="69" rx="4" ry="3" fill="#4A2511"/>`;
  }

  let accSvg = '';
  if (r.accessory === 'crown') {
    accSvg = `<polygon points="44,30 50,14 60,24 70,14 76,30" fill="#FFD166" stroke="#4A2511" stroke-width="3" stroke-linejoin="round"/>`;
  } else if (r.accessory === 'sprout' || r.accessory === 'leaf') {
    accSvg = `
      <path d="M60 30 Q60 16 70 14 Q68 24 60 24" fill="#52B788" stroke="#4A2511" stroke-width="2.5"/>
      <path d="M60 30 Q60 18 50 16 Q52 25 60 25" fill="#74C69D" stroke="#4A2511" stroke-width="2.5"/>
    `;
  } else if (r.accessory === 'bow') {
    accSvg = `
      <polygon points="60,28 46,20 46,36" fill="#FF4D6D" stroke="#4A2511" stroke-width="2.5" stroke-linejoin="round"/>
      <polygon points="60,28 74,20 74,36" fill="#FF4D6D" stroke="#4A2511" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="60" cy="28" r="4" fill="#FFB3C1" stroke="#4A2511" stroke-width="2.5"/>
    `;
  } else if (r.accessory === 'halo') {
    accSvg = `<ellipse cx="60" cy="17" rx="18" ry="5" fill="none" stroke="#FFD166" stroke-width="4"/>`;
  } else if (r.accessory === 'star') {
    accSvg = `<circle cx="60" cy="22" r="6" fill="#FFD166" stroke="#4A2511" stroke-width="2.5"/>`;
  } else if (r.accessory === 'flower') {
    accSvg = `
      <circle cx="76" cy="34" r="7" fill="#FF8FA3" stroke="#4A2511" stroke-width="2.5"/>
      <circle cx="76" cy="34" r="3" fill="#FFD166"/>
    `;
  } else if (r.accessory === 'beret') {
    accSvg = `<ellipse cx="60" cy="27" rx="22" ry="8" fill="#E63946" stroke="#4A2511" stroke-width="3"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <rect width="120" height="120" rx="28" fill="${r.bg}"/>
    <circle cx="60" cy="60" r="52" fill="rgba(255,255,255,0.45)"/>
    ${earsSvg}
    <circle cx="60" cy="66" r="36" fill="${r.faceColor}" stroke="#4A2511" stroke-width="4"/>
    ${pandaPatches}
    <ellipse cx="33" cy="72" rx="6.5" ry="4" fill="${r.blushColor}" opacity="0.75"/>
    <ellipse cx="87" cy="72" rx="6.5" ry="4" fill="${r.blushColor}" opacity="0.75"/>
    ${eyesSvg}
    ${noseSvg}
    ${mouthSvg}
    ${accSvg}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_AVATARS: PresetAvatar[] = AVATAR_RECIPES.map(recipe => ({
  id: recipe.id,
  name: recipe.name,
  url: buildAvatarSvgDataUrl(recipe),
}));
