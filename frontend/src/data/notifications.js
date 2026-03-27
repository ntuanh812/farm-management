export const notificationsData = [
  {
    id: 1,
    type: "overdue",
    title: "TK004: Tiêm vaccine lợn B3 QUÁ HẠN 3 ngày",
    content: "Nhiệm vụ tiêm vaccine cho lợn chuồng B3 đã quá hạn",
    time: "3 ngày trước",
    read: false,
    icon: "clock",
    link: "/tasks"
  },
  {
    id: 2,
    type: "health",
    title: "VN005 Gà đẻ: Health WARNING",
    content: "Gà đẻ VN005 chuyển sang trạng thái 'Theo dõi'",
    time: "1 giờ trước", 
    read: false,
    icon: "warning",
    link: "/livestock/VN005"
  },
  {
    id: 3,
    type: "feed",
    title: "TA004 Cám gạo HẾT HẠN",
    content: "Thức ăn TA004 đã hết hạn từ 2024-09-30",
    time: "5 ngày trước",
    read: true,
    icon: "alert",
    link: "/feed"
  },
  {
    id: 4,
    type: "overdue", 
    title: "TK001: Kiểm tra bò sữa A1",
    content: "Công việc kiểm tra sức khỏe bò sữa quá hạn hôm nay",
    time: "2 giờ trước",
    read: false,
    icon: "clock",
    link: "/tasks"
  },
  {
    id: 5,
    type: "health",
    title: "Chuồng C1: Cleanliness CRITICAL",
    content: "Chuồng C1 cần vệ sinh khẩn cấp",
    time: "30 phút trước",
    read: false,
    icon: "warning",
    link: "/barns/C1"
  }
];
