export interface PoopStyle {
  id: string;
  name: string;
  emoji: string;
  filterStyle?: string;
  color: string;
  splatColor: string;
  unlockLevel: number;
  description: string;
}

export const POOP_STYLES: PoopStyle[] = [
  { id: "poop1", name: "1. Cứt Nâu Cổ Điển", emoji: "💩", color: "#8B4513", splatColor: "#78350f", unlockLevel: 1, description: "Cục cứt xoắn ốc nguyên bản kinh điển" },
  { id: "poop2", name: "2. Cứt Vàng Ánh Kim", emoji: "💩", filterStyle: "sepia(1) saturate(5) hue-rotate(15deg) brightness(1.15)", color: "#F59E0B", splatColor: "#d97706", unlockLevel: 2, description: "Lấp lánh như vàng ròng may mắn" },
  { id: "poop3", name: "3. Cứt Socola Đen", emoji: "💩", filterStyle: "brightness(0.6) contrast(1.2)", color: "#381e09", splatColor: "#261304", unlockLevel: 3, description: "Màu socola đen đậm đà hảo hạng" },
  { id: "poop4", name: "4. Cứt Caramel Ngọt", emoji: "💩", filterStyle: "hue-rotate(25deg) saturate(1.8)", color: "#D97706", splatColor: "#92400e", unlockLevel: 4, description: "Màu kẹo caramel thơm béo" },
  { id: "poop5", name: "5. Cứt Đất Sét Hoạt Hình", emoji: "💩", filterStyle: "contrast(1.1) brightness(1.05)", color: "#9c5421", splatColor: "#78350f", unlockLevel: 5, description: "Mềm mại như đất sét nặn đồ chơi" },
  { id: "poop6", name: "6. Cứt Xanh Trà Matcha", emoji: "💩", filterStyle: "hue-rotate(85deg) saturate(2)", color: "#4d7c0f", splatColor: "#365314", unlockLevel: 6, description: "Màu xanh trà xanh matcha thanh mát" },
  { id: "poop7", name: "7. Cứt Tím Thạch Anh", emoji: "💩", filterStyle: "hue-rotate(240deg) saturate(2.2)", color: "#7e22ce", splatColor: "#581c87", unlockLevel: 7, description: "Huyền bí ánh tím đá thạch anh" },
  { id: "poop8", name: "8. Cứt Hồng Dâu Tây", emoji: "💩", filterStyle: "hue-rotate(300deg) saturate(2.5)", color: "#db2777", splatColor: "#9d174d", unlockLevel: 8, description: "Ngọt ngào màu siro dâu tây" },
  { id: "poop9", name: "9. Cứt Băng Tuyết Bắc Cực", emoji: "💩", filterStyle: "hue-rotate(180deg) saturate(1.8) brightness(1.2)", color: "#0284c7", splatColor: "#0369a1", unlockLevel: 9, description: "Lạnh buốt như tảng băng trôi" },
  { id: "poop10", name: "10. Cứt Hổ Phách Cổ Đại", emoji: "💩", filterStyle: "sepia(0.8) hue-rotate(30deg) saturate(3)", color: "#b45309", splatColor: "#78350f", unlockLevel: 10, description: "Trong vắt màu nhựa cây hóa thạch" },
  { id: "poop11", name: "11. Cứt Than Hoạt Tính", emoji: "💩", filterStyle: "grayscale(1) brightness(0.4)", color: "#1f2937", splatColor: "#111827", unlockLevel: 11, description: "Đen tuyền như than đá núi lửa" },
  { id: "poop12", name: "12. Cứt Bạc Bạch Kim", emoji: "💩", filterStyle: "grayscale(0.9) brightness(1.4) contrast(1.1)", color: "#94a3b8", splatColor: "#64748b", unlockLevel: 12, description: "Sáng bóng ánh kim loại bạc" },
  { id: "poop13", name: "13. Cứt Cam Đào Mọng", emoji: "💩", filterStyle: "hue-rotate(330deg) saturate(2) brightness(1.1)", color: "#ea580c", splatColor: "#c2410c", unlockLevel: 13, description: "Tươi mọng màu trái đào chín" },
  { id: "poop14", name: "14. Cứt Xanh Lá Rừng Già", emoji: "💩", filterStyle: "hue-rotate(100deg) saturate(2.5)", color: "#15803d", splatColor: "#166534", unlockLevel: 14, description: "Xanh mướt như tán lá rừng Amazon" },
  { id: "poop15", name: "15. Cứt Đỏ Dung Nham", emoji: "💩", filterStyle: "hue-rotate(345deg) saturate(3) contrast(1.2)", color: "#dc2626", splatColor: "#991b1b", unlockLevel: 15, description: "Nóng bỏng như nham thạch sục sôi" },
  { id: "poop16", name: "16. Cứt Ngọc Lam Biển Sâu", emoji: "💩", filterStyle: "hue-rotate(160deg) saturate(2)", color: "#0d9488", splatColor: "#115e59", unlockLevel: 16, description: "Xanh ngọc bích của biển Maldives" },
  { id: "poop17", name: "17. Cứt Cà Phê Espresso", emoji: "💩", filterStyle: "brightness(0.5) contrast(1.3)", color: "#451a03", splatColor: "#291102", unlockLevel: 17, description: "Đậm đặc cà phê rang xay nguyên chất" },
  { id: "poop18", name: "18. Cứt Hạt Dẻ Nướng", emoji: "💩", filterStyle: "sepia(0.6) hue-rotate(10deg) saturate(1.7)", color: "#78350f", splatColor: "#451a03", unlockLevel: 18, description: "Bùi ngậy màu hạt dẻ nướng mùa đông" },
  { id: "poop19", name: "19. Cứt Bơ Đậu Phộng", emoji: "💩", filterStyle: "sepia(0.4) saturate(2) brightness(1.1)", color: "#ca8a04", splatColor: "#854d0e", unlockLevel: 19, description: "Béo ngậy như hũ bơ đậu phộng" },
  { id: "poop20", name: "20. Cứt Xanh Lục Bảo", emoji: "💩", filterStyle: "hue-rotate(120deg) saturate(3) brightness(0.9)", color: "#047857", splatColor: "#065f46", unlockLevel: 20, description: "Quý phái như viên ngọc lục bảo" },
  { id: "poop21", name: "21. Cứt Tím Khoai Môn", emoji: "💩", filterStyle: "hue-rotate(260deg) saturate(1.8) brightness(1.1)", color: "#9333ea", splatColor: "#6b21a8", unlockLevel: 21, description: "Thơm nồng màu trà sữa khoai môn" },
  { id: "poop22", name: "22. Cứt Vàng Chanh Tươi", emoji: "💩", filterStyle: "hue-rotate(45deg) saturate(3) brightness(1.2)", color: "#eab308", splatColor: "#a16207", unlockLevel: 22, description: "Chua thanh rực rỡ màu quả chanh" },
  { id: "poop23", name: "23. Cứt Bạc Hà Băng Giá", emoji: "💩", filterStyle: "hue-rotate(150deg) saturate(2.5) brightness(1.2)", color: "#14b8a6", splatColor: "#0f766e", unlockLevel: 23, description: "The mát sảng khoái vị bạc hà" },
  { id: "poop24", name: "24. Cứt Nâu Gỗ Mun", emoji: "💩", filterStyle: "brightness(0.45) contrast(1.1)", color: "#271c19", splatColor: "#17100e", unlockLevel: 24, description: "Rắn rỏi như khúc gỗ mun rừng già" },
  { id: "poop25", name: "25. Cứt Huyết Long Đỏ Rực", emoji: "💩", filterStyle: "hue-rotate(350deg) saturate(3.5)", color: "#b91c1c", splatColor: "#7f1d1d", unlockLevel: 25, description: "Đỏ đậm khí chất rồng thiêng" },
  { id: "poop26", name: "26. Cứt Xanh Neon Dạ Quang", emoji: "💩", filterStyle: "hue-rotate(80deg) saturate(4) brightness(1.3)", color: "#65a30d", splatColor: "#3f6212", unlockLevel: 26, description: "Phát sáng rực rỡ trong bóng đêm" },
  { id: "poop27", name: "27. Cứt Hồng Sen Tươi", emoji: "💩", filterStyle: "hue-rotate(290deg) saturate(2.2)", color: "#ec4899", splatColor: "#be185d", unlockLevel: 27, description: "Thanh tao như đóa hoa sen nở rộ" },
  { id: "poop28", name: "28. Cứt Gốm Nung Bát Tràng", emoji: "💩", filterStyle: "sepia(0.7) hue-rotate(355deg) saturate(2)", color: "#c2410c", splatColor: "#9a3412", unlockLevel: 28, description: "Mộc mạc màu đất nung truyền thống" },
  { id: "poop29", name: "29. Cứt Xanh Lơ Biển Lặng", emoji: "💩", filterStyle: "hue-rotate(190deg) saturate(2)", color: "#0284c7", splatColor: "#075985", unlockLevel: 29, description: "Dịu dàng màu bầu trời thu yên ả" },
  { id: "poop30", name: "30. Cứt Vàng Mật Ong", emoji: "💩", filterStyle: "hue-rotate(20deg) saturate(3) brightness(1.1)", color: "#f59e0b", splatColor: "#b45309", unlockLevel: 30, description: "Sóng sánh giọt mật ong rừng nguyên chất" },
  { id: "poop31", name: "31. Cứt Xám Khói Sương Mù", emoji: "💩", filterStyle: "grayscale(0.8) brightness(0.9)", color: "#64748b", splatColor: "#475569", unlockLevel: 31, description: "Huyền ảo như làn sương buổi sớm" },
  { id: "poop32", name: "32. Cứt Xanh Rêu Đá Cổ", emoji: "💩", filterStyle: "hue-rotate(75deg) saturate(1.5) brightness(0.8)", color: "#3f6212", splatColor: "#1a2e05", unlockLevel: 32, description: "Rêu phong cổ kính ngàn năm" },
  { id: "poop33", name: "33. Cứt Đỏ Rượu Vang Bordeaux", emoji: "💩", filterStyle: "hue-rotate(320deg) saturate(2) brightness(0.75)", color: "#831843", splatColor: "#500724", unlockLevel: 33, description: "Say đắm màu vang đỏ nước Pháp" },
  { id: "poop34", name: "34. Cứt Vàng Đồng Cổ", emoji: "💩", filterStyle: "sepia(0.9) hue-rotate(5deg) saturate(2.5)", color: "#a16207", splatColor: "#713f12", unlockLevel: 34, description: "Cổ vật chạm khắc tinh xảo" },
  { id: "poop35", name: "35. Cứt Tím Hoa Cà", emoji: "💩", filterStyle: "hue-rotate(270deg) saturate(1.9)", color: "#a855f7", splatColor: "#7e22ce", unlockLevel: 35, description: "Mộng mơ sắc tím hoa lục bình" },
  { id: "poop36", name: "36. Cứt Ngọc Bích Hoàng Gia", emoji: "💩", filterStyle: "hue-rotate(135deg) saturate(2.5)", color: "#059669", splatColor: "#064e3b", unlockLevel: 36, description: "Sang trọng chất ngọc bích quý hiếm" },
  { id: "poop37", name: "37. Cứt Cam Hoàng Hôn", emoji: "💩", filterStyle: "hue-rotate(340deg) saturate(2.5) brightness(1.05)", color: "#f97316", splatColor: "#c2410c", unlockLevel: 37, description: "Rực rỡ buổi chiều tà trên thảo nguyên" },
  { id: "poop38", name: "38. Cứt Xanh Đậm Dạ Hội", emoji: "💩", filterStyle: "hue-rotate(210deg) saturate(2.5) brightness(0.8)", color: "#1e3a8a", splatColor: "#172554", unlockLevel: 38, description: "Bí ẩn chiếc đầm dạ hội đêm đen" },
  { id: "poop39", name: "39. Cứt Socola Sữa Béo", emoji: "💩", filterStyle: "sepia(0.5) hue-rotate(350deg) saturate(1.5)", color: "#592b0c", splatColor: "#3d1b06", unlockLevel: 39, description: "Ngọt ngào thanh socola Thụy Sĩ" },
  { id: "poop40", name: "40. Cứt Trắng Sữa Chua", emoji: "💩", filterStyle: "grayscale(1) brightness(1.7) contrast(0.9)", color: "#e2e8f0", splatColor: "#94a3b8", unlockLevel: 40, description: "Trắng muốt mịn màng vị sữa chua" },
  { id: "poop41", name: "41. Cứt Cầu Vồng Thần Tiên", emoji: "💩", filterStyle: "hue-rotate(180deg) saturate(3)", color: "#06b6d4", splatColor: "#0891b2", unlockLevel: 41, description: "Sắc màu phép thuật thần thoại" },
  { id: "poop42", name: "42. Cứt Quặng Sắt Không Gỉ", emoji: "💩", filterStyle: "grayscale(0.7) contrast(1.4)", color: "#475569", splatColor: "#334155", unlockLevel: 42, description: "Cứng cáp như thép tôi luyện" },
  { id: "poop43", name: "43. Cứt Hạt Dẻ Cười Hồ Lô", emoji: "💩", filterStyle: "hue-rotate(60deg) saturate(2)", color: "#84cc16", splatColor: "#4d7c0f", unlockLevel: 43, description: "Xanh nõn hạt dẻ cười thơm giòn" },
  { id: "poop44", name: "44. Cứt Hồng Phấn Búp Bê", emoji: "💩", filterStyle: "hue-rotate(310deg) saturate(2) brightness(1.2)", color: "#f472b6", splatColor: "#db2777", unlockLevel: 44, description: "Dễ thương tông màu búp bê barbie" },
  { id: "poop45", name: "45. Cứt Lam Ngọc Sapphire", emoji: "💩", filterStyle: "hue-rotate(220deg) saturate(3)", color: "#2563eb", splatColor: "#1d4ed8", unlockLevel: 45, description: "Đá quý sapphire đại dương lấp lánh" },
  { id: "poop46", name: "46. Cứt Hạt Tiêu Đen", emoji: "💩", filterStyle: "grayscale(1) brightness(0.35) contrast(1.3)", color: "#0f172a", splatColor: "#020617", unlockLevel: 46, description: "Cay nồng hạt tiêu đen Phú Quốc" },
  { id: "poop47", name: "47. Cứt Hạt Sen Bổ Dưỡng", emoji: "💩", filterStyle: "sepia(0.3) saturate(1.2) brightness(1.3)", color: "#fde047", splatColor: "#ca8a04", unlockLevel: 47, description: "Bổ dưỡng thanh tao hạt sen hồ Tây" },
  { id: "poop48", name: "48. Cứt Tinh Thể Vũ Trụ", emoji: "💩", filterStyle: "hue-rotate(250deg) saturate(4) brightness(1.2)", color: "#8b5cf6", splatColor: "#6d28d9", unlockLevel: 48, description: "Bụi sao băng ngưng tụ hàng triệu năm" },
  { id: "poop49", name: "49. Cứt Đá Quý Ruby", emoji: "💩", filterStyle: "hue-rotate(340deg) saturate(4) brightness(1.1)", color: "#e11d48", splatColor: "#be123c", unlockLevel: 49, description: "Viên hồng ngọc ruby đắt giá nhất trần đời" },
  { id: "poop50", name: "50. Cứt Huyền Thoại Bất Tử", emoji: "💩", filterStyle: "sepia(1) saturate(8) hue-rotate(25deg) brightness(1.3) contrast(1.2)", color: "#fbbf24", splatColor: "#d97706", unlockLevel: 50, description: "Đỉnh cao tuyệt đỉnh chân kinh của thế giới cứt!" }
];
