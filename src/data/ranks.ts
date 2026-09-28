export interface GameRank {
  id: string;
  name: string;
  tier: number; // 1 to 10
  icon: string;
  color: string;
  badgeBg: string;
  borderCol: string;
  stagesRequired: number; // Every 5 stages
  description: string;
}

export const GAME_RANKS: GameRank[] = [
  {
    id: 'bronze',
    name: 'Đồng (Bronze)',
    tier: 1,
    icon: '🥉',
    color: '#cd7f32',
    badgeBg: 'from-amber-700 to-amber-900',
    borderCol: 'border-amber-700',
    stagesRequired: 0,
    description: 'Hạng khởi đầu cho tân binh tập né cứt'
  },
  {
    id: 'silver',
    name: 'Bạc (Silver)',
    tier: 2,
    icon: '🥈',
    color: '#94a3b8',
    badgeBg: 'from-slate-300 to-slate-500',
    borderCol: 'border-slate-400',
    stagesRequired: 5,
    description: 'Vượt qua 5 màn - Phản xạ nhanh nhẹn'
  },
  {
    id: 'gold',
    name: 'Vàng (Gold)',
    tier: 3,
    icon: '🥇',
    color: '#eab308',
    badgeBg: 'from-yellow-400 to-amber-600',
    borderCol: 'border-yellow-500',
    stagesRequired: 10,
    description: 'Vượt qua 10 màn - Lướt gió điêu luyện'
  },
  {
    id: 'platinum',
    name: 'Bạch Kim (Platinum)',
    tier: 4,
    icon: '🔘',
    color: '#06b6d4',
    badgeBg: 'from-cyan-400 to-teal-600',
    borderCol: 'border-cyan-400',
    stagesRequired: 15,
    description: 'Vượt qua 15 màn - Tay lái lụa né phân'
  },
  {
    id: 'diamond',
    name: 'Kim Cương (Diamond)',
    tier: 5,
    icon: '💎',
    color: '#3b82f6',
    badgeBg: 'from-blue-400 to-indigo-600',
    borderCol: 'border-blue-500',
    stagesRequired: 20,
    description: 'Vượt qua 20 màn - Bản lĩnh kiên cường'
  },
  {
    id: 'master',
    name: 'Cao Thủ (Master)',
    tier: 6,
    icon: '👑',
    color: '#a855f7',
    badgeBg: 'from-purple-500 to-fuchsia-700',
    borderCol: 'border-purple-500',
    stagesRequired: 25,
    description: 'Vượt qua 25 màn - Đẳng cấp bậc thầy'
  },
  {
    id: 'grandmaster',
    name: 'Đại Cao Thủ (Grandmaster)',
    tier: 7,
    icon: '🔮',
    color: '#ec4899',
    badgeBg: 'from-pink-500 to-rose-700',
    borderCol: 'border-pink-500',
    stagesRequired: 30,
    description: 'Vượt qua 30 màn - Phản xạ thần tốc'
  },
  {
    id: 'elite',
    name: 'Tinh Anh (Elite)',
    tier: 8,
    icon: '⚡',
    color: '#f97316',
    badgeBg: 'from-orange-500 to-red-600',
    borderCol: 'border-orange-500',
    stagesRequired: 35,
    description: 'Vượt qua 35 màn - Siêu phàm thoát hiểm'
  },
  {
    id: 'challenger',
    name: 'Chiến Thần (Challenger)',
    tier: 9,
    icon: '🔥',
    color: '#ef4444',
    badgeBg: 'from-red-600 to-amber-700',
    borderCol: 'border-red-600',
    stagesRequired: 40,
    description: 'Vượt qua 40 màn - Thách thức mọi giới hạn'
  },
  {
    id: 'immortal',
    name: 'Huyền Thoại Bất Tử (Immortal)',
    tier: 10,
    icon: '🌟',
    color: '#fbbf24',
    badgeBg: 'from-amber-300 via-yellow-400 to-orange-500',
    borderCol: 'border-amber-400',
    stagesRequired: 45,
    description: 'Vượt qua 45-50 màn - Đỉnh cao tối thượng né cứt bất bại!'
  }
];
