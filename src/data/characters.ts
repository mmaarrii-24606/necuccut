export interface Character {
  id: number;
  name: string;
  emoji: string;
  title: string;
  quote: string;
  unlockLevel: number;
  bgGradient: string;
  speedMultiplier: number;
  specialTrait: string;
}

export const CHARACTERS: Character[] = [
  { id: 1, name: "Cún Shibe", emoji: "🐶", title: "Tân binh", quote: "Gâu gâu! Chạy thôi!", unlockLevel: 1, bgGradient: "from-amber-400 to-orange-500", speedMultiplier: 1.0, specialTrait: "Nhanh nhẹn" },
  { id: 2, name: "Mèo MiMi", emoji: "🐱", title: "Phản xạ mượt", quote: "Meo meo~ Đừng để bẩn lông!", unlockLevel: 2, bgGradient: "from-pink-400 to-rose-500", speedMultiplier: 1.01, specialTrait: "Mềm dẻo" },
  { id: 3, name: "Vịt Quack", emoji: "🦆", title: "Lạch bạch", quote: "Cạp cạp! Không sợ cứt!", unlockLevel: 3, bgGradient: "from-yellow-300 to-amber-500", speedMultiplier: 1.02, specialTrait: "Lướt gió" },
  { id: 4, name: "Gấu Panda", emoji: "🐼", title: "Gặm trúc", quote: "Ăn trúc rồi né phân!", unlockLevel: 4, bgGradient: "from-emerald-400 to-teal-600", speedMultiplier: 1.03, specialTrait: "Trầm tĩnh" },
  { id: 5, name: "Thỏ Bunny", emoji: "🐰", title: "Siêu âm", quote: "Nhảy cao né phân!", unlockLevel: 5, bgGradient: "from-violet-400 to-purple-600", speedMultiplier: 1.04, specialTrait: "Bật nhảy" },
  { id: 6, name: "Cáo Foxy", emoji: "🦊", title: "Mưu mẹo", quote: "Lêu lêu trượt rồi nha!", unlockLevel: 6, bgGradient: "from-orange-500 to-red-600", speedMultiplier: 1.05, specialTrait: "Láu lỉnh" },
  { id: 7, name: "Khỉ Chuối", emoji: "🐵", title: "Xiếc khỉ", quote: "Đu dây né phân điệu nghệ!", unlockLevel: 7, bgGradient: "from-yellow-400 to-orange-600", speedMultiplier: 1.06, specialTrait: "Linh hoạt" },
  { id: 8, name: "Ếch Cốm", emoji: "🐸", title: "Vua đầm lầy", quote: "Ộp ộp né mau mau!", unlockLevel: 8, bgGradient: "from-green-400 to-emerald-600", speedMultiplier: 1.07, specialTrait: "Phản xạ" },
  { id: 9, name: "Heo Piggy", emoji: "🐷", title: "Bé bự", quote: "Ụt ịt bụng bự lách lẹ!", unlockLevel: 9, bgGradient: "from-pink-300 to-rose-400", speedMultiplier: 1.08, specialTrait: "Đàn hồi" },
  { id: 10, name: "Cánh Cụt Pingu", emoji: "🐧", title: "Trượt băng", quote: "Noot noot trượt trên sàn!", unlockLevel: 10, bgGradient: "from-cyan-400 to-blue-600", speedMultiplier: 1.09, specialTrait: "Lướt băng" },
  { id: 11, name: "Nhím Sonic", emoji: "🦔", title: "Cuộn tròn", quote: "Gai nhọn tự tin!", unlockLevel: 11, bgGradient: "from-indigo-400 to-blue-700", speedMultiplier: 1.1, specialTrait: "Tăng tốc" },
  { id: 12, name: "Hamster Hammy", emoji: "🐹", title: "Má phúng phính", quote: "Chít chít vừa nhai vừa né!", unlockLevel: 12, bgGradient: "from-amber-300 to-orange-400", speedMultiplier: 1.11, specialTrait: "Tí hon" },
  { id: 13, name: "Cú Hoot", emoji: "🦉", title: "Mắt 360", quote: "Nhìn thấu quỹ đạo cứt!", unlockLevel: 13, bgGradient: "from-stone-500 to-neutral-700", speedMultiplier: 1.12, specialTrait: "Mắt thần" },
  { id: 14, name: "Rùa Turbo", emoji: "🐢", title: "Rùa nhanh", quote: "Ai bảo rùa chậm chạp?", unlockLevel: 14, bgGradient: "from-teal-400 to-green-600", speedMultiplier: 1.13, specialTrait: "Mai giáp" },
  { id: 15, name: "Bạch Tuộc Tako", emoji: "🐙", title: "Tám chân", quote: "8 xúc tu né không trượt!", unlockLevel: 15, bgGradient: "from-red-400 to-rose-600", speedMultiplier: 1.14, specialTrait: "Thân mềm" },
  { id: 16, name: "Ong Buzzy", emoji: "🐝", title: "Zic-zac", quote: "Vo ve bay lượn sóng!", unlockLevel: 16, bgGradient: "from-yellow-400 to-lime-500", speedMultiplier: 1.15, specialTrait: "Bay lượn" },
  { id: 17, name: "Sư Tử Simba", emoji: "🦁", title: "Chúa sơn lâm", quote: "Gầm vang dũng cảm!", unlockLevel: 17, bgGradient: "from-amber-500 to-yellow-600", speedMultiplier: 1.16, specialTrait: "Oai phong" },
  { id: 18, name: "Kỳ Lân Uni", emoji: "🦄", title: "Cầu vồng", quote: "Phép thuật xua tan mùi!", unlockLevel: 18, bgGradient: "from-fuchsia-400 to-pink-600", speedMultiplier: 1.17, specialTrait: "May mắn" },
  { id: 19, name: "Khủng Long T-Rex", emoji: "🦖", title: "Tiền sử", quote: "Bước chân rung chuyển!", unlockLevel: 19, bgGradient: "from-lime-500 to-emerald-700", speedMultiplier: 1.18, specialTrait: "Mạnh mẽ" },
  { id: 20, name: "Cua Krabby", emoji: "🦀", title: "Bò ngang", quote: "Kẹp kẹp bò ngang né bén!", unlockLevel: 20, bgGradient: "from-orange-500 to-red-500", speedMultiplier: 1.19, specialTrait: "Bò ngang" },
  { id: 21, name: "Rồng Lửa Baby", emoji: "🐲", title: "Thần thú", quote: "Thổi bay mùi hôi thối!", unlockLevel: 21, bgGradient: "from-red-500 to-amber-600", speedMultiplier: 1.2, specialTrait: "Nhiệt huyết" },
  { id: 22, name: "Robot BitBot", emoji: "🤖", title: "Điện toán", quote: "Tính toán quỹ đạo 99%!", unlockLevel: 22, bgGradient: "from-sky-400 to-indigo-600", speedMultiplier: 1.21, specialTrait: "Toán học" },
  { id: 23, name: "Người Ngoài Hành Tinh", emoji: "👽", title: "Vũ trụ", quote: "Trái Đất mưa phân thật lạ!", unlockLevel: 23, bgGradient: "from-emerald-400 to-cyan-600", speedMultiplier: 1.22, specialTrait: "Không gian" },
  { id: 24, name: "Ma Spooky", emoji: "👻", title: "Xuyên không", quote: "Hùuu xuyên thấu né phân!", unlockLevel: 24, bgGradient: "from-slate-400 to-purple-600", speedMultiplier: 1.23, specialTrait: "Vô hình" },
  { id: 25, name: "Phù Thủy Wizard", emoji: "🧙", title: "Phép thuật", quote: "Úm ba la cứt biến đi!", unlockLevel: 25, bgGradient: "from-purple-500 to-indigo-700", speedMultiplier: 1.24, specialTrait: "Khiên phép" },
  { id: 26, name: "Siêu Nhân Hero", emoji: "🦸", title: "Áo choàng", quote: "Công lý luôn chiến thắng!", unlockLevel: 26, bgGradient: "from-blue-600 to-red-600", speedMultiplier: 1.25, specialTrait: "Siêu năng" },
  { id: 27, name: "Ninja Shadow", emoji: "🥷", title: "Nhẫn giả", quote: "Ẩn thân né không dấu vết!", unlockLevel: 27, bgGradient: "from-zinc-700 to-black", speedMultiplier: 1.26, specialTrait: "Tàng hình" },
  { id: 28, name: "Vua Mèo Hoàng Gia", emoji: "👑", title: "Hoàng tộc", quote: "Né cứt theo phong cách quý phái!", unlockLevel: 28, bgGradient: "from-amber-400 to-yellow-600", speedMultiplier: 1.27, specialTrait: "Vương quyền" },
  { id: 29, name: "Phi Hành Gia Astro", emoji: "🧑‍🚀", title: "Trọng lực 0G", quote: "Không trọng lực né siêu êm!", unlockLevel: 29, bgGradient: "from-blue-500 to-violet-800", speedMultiplier: 1.28, specialTrait: "Trôi bồng" },
  { id: 30, name: "Thần Tài Vàng", emoji: "🌟", title: "Tài lộc", quote: "Phúc lộc tràn ngập!", unlockLevel: 30, bgGradient: "from-yellow-400 to-amber-600", speedMultiplier: 1.29, specialTrait: "Phúc tinh" },
  { id: 31, name: "Cá Heo Dolphin", emoji: "🐬", title: "Lướt sóng", quote: "Nhào lộn trên sóng biển!", unlockLevel: 31, bgGradient: "from-cyan-400 to-blue-500", speedMultiplier: 1.3, specialTrait: "Lướt sóng" },
  { id: 32, name: "Koala Ngái Ngủ", emoji: "🐨", title: "Chậm mà chắc", quote: "Bu cây né phân cực chuẩn!", unlockLevel: 32, bgGradient: "from-stone-400 to-zinc-600", speedMultiplier: 1.3, specialTrait: "Bám dính" },
  { id: 33, name: "Hổ Dũng Mãnh", emoji: "🐯", title: "Móng vuốt", quote: "Gầm vang chúa tể rừng!", unlockLevel: 33, bgGradient: "from-amber-500 to-orange-600", speedMultiplier: 1.31, specialTrait: "Chớp nhoáng" },
  { id: 34, name: "Ngựa Vằn Vui Nhộn", emoji: "🦓", title: "Sọc thần tốc", quote: "Chạy đua trên thảo nguyên!", unlockLevel: 34, bgGradient: "from-slate-600 to-zinc-800", speedMultiplier: 1.31, specialTrait: "Bứt tốc" },
  { id: 35, name: "Hươu Cao Cổ", emoji: "🦒", title: "Tầm nhìn xa", quote: "Cổ cao thấy trước cứt rơi!", unlockLevel: 35, bgGradient: "from-yellow-500 to-amber-700", speedMultiplier: 1.32, specialTrait: "Nhìn xa" },
  { id: 36, name: "Voi Con Bự", emoji: "🐘", title: "Vòi thần kỳ", quote: "Thổi gió hất văng cứt!", unlockLevel: 36, bgGradient: "from-slate-400 to-blue-600", speedMultiplier: 1.32, specialTrait: "Vững vàng" },
  { id: 37, name: "Cừu Bông Trắng", emoji: "🐑", title: "Lông êm ái", quote: "Bồng bềnh nhún nhảy!", unlockLevel: 37, bgGradient: "from-emerald-300 to-teal-500", speedMultiplier: 1.33, specialTrait: "Độ nảy" },
  { id: 38, name: "Chuột Túi Kangaroo", emoji: "🦘", title: "Cú nhảy xa", quote: "Nhảy tưng tưng qua mọi cục cứt!", unlockLevel: 38, bgGradient: "from-amber-600 to-orange-700", speedMultiplier: 1.33, specialTrait: "Nhảy xa" },
  { id: 39, name: "Gấu Bắc Cực", emoji: "🐻‍❄️", title: "Băng giá", quote: "Lạnh lùng né sạch phân!", unlockLevel: 39, bgGradient: "from-cyan-300 to-sky-500", speedMultiplier: 1.34, specialTrait: "Băng giá" },
  { id: 40, name: "Hải Cẩu Đáng Yêu", emoji: "🦭", title: "Vỗ tay vui nhộn", quote: "Trượt bụng né phân điêu luyện!", unlockLevel: 40, bgGradient: "from-blue-300 to-indigo-500", speedMultiplier: 1.34, specialTrait: "Trơn trượt" },
  { id: 41, name: "Hồng Hạc Flamingo", emoji: "🦩", title: "Đứng một chân", quote: "Thăng bằng đỉnh cao!", unlockLevel: 41, bgGradient: "from-rose-400 to-pink-600", speedMultiplier: 1.35, specialTrait: "Thăng bằng" },
  { id: 42, name: "Thiên Nga Trắng", emoji: "🦢", title: "Kiêu sa", quote: "Lướt trên hồ nước biếc!", unlockLevel: 42, bgGradient: "from-sky-300 to-indigo-400", speedMultiplier: 1.35, specialTrait: "Lướt gió" },
  { id: 43, name: "Vẹt Sặc Sỡ", emoji: "🦜", title: "Nói nhiều", quote: "Cứt rơi kìa chạy điii!", unlockLevel: 43, bgGradient: "from-red-500 via-green-500 to-blue-500", speedMultiplier: 1.36, specialTrait: "Cảnh báo" },
  { id: 44, name: "Công Xòe Đuôi", emoji: "🦚", title: "Múa quạt", quote: "Đuôi xòe cản gió né cứt!", unlockLevel: 44, bgGradient: "from-teal-500 to-emerald-700", speedMultiplier: 1.36, specialTrait: "Mê hoặc" },
  { id: 45, name: "Dơi Đêm Batman", emoji: "🦇", title: "Sóng âm", quote: "Định vị sóng âm trong tối!", unlockLevel: 45, bgGradient: "from-purple-900 to-black", speedMultiplier: 1.37, specialTrait: "Sóng âm" },
  { id: 46, name: "Cá Mập Kute", emoji: "🦈", title: "Vây cá lướt", quote: "Rẽ sóng thần tốc!", unlockLevel: 46, bgGradient: "from-blue-600 to-cyan-700", speedMultiplier: 1.37, specialTrait: "Cắt gió" },
  { id: 47, name: "Cá Voi Khổng Lồ", emoji: "🐳", title: "Phun nước", quote: "Phun nước đẩy bay cứt!", unlockLevel: 47, bgGradient: "from-sky-500 to-blue-800", speedMultiplier: 1.38, specialTrait: "Lực đẩy" },
  { id: 48, name: "Cây Xương Rồng", emoji: "🌵", title: "Bền bỉ sa mạc", quote: "Gai nhọn đâm thủng phân!", unlockLevel: 48, bgGradient: "from-lime-600 to-emerald-800", speedMultiplier: 1.38, specialTrait: "Bền bỉ" },
  { id: 49, name: "Mặt Trời Tươi Cười", emoji: "🌞", title: "Thái dương", quote: "Chiếu sáng xua tan bóng tối!", unlockLevel: 49, bgGradient: "from-yellow-400 to-amber-600", speedMultiplier: 1.39, specialTrait: "Hào quang" },
  { id: 50, name: "Chiến Thần Tối Thượng", emoji: "👑", title: "Đỉnh cao bất bại", quote: "Vua né phân huyền thoại của vũ trụ!", unlockLevel: 50, bgGradient: "from-amber-400 via-yellow-300 to-amber-500", speedMultiplier: 1.4, specialTrait: "Bất tử" }
];
