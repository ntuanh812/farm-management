//dashboard
export const activities = [
    {
      icon: "health",
      content: "Nhân viên A cập nhật sức khỏe cho bò #123",
      time: "5 phút trước"
    },
    {
      icon: "feed",
      content: "Đã ghi nhận cho ăn chuồng B5",
      time: "15 phút trước"
    },
    {
      icon: "vaccine",
      content: "Tiêm vaccine Lở mồm long móng cho đàn lợn khu C",
      time: "1 giờ trước"
    },
    {
      icon: "health",
      content: "Kiểm tra sức khỏe đàn gà sinh sản",
      time: "2 giờ trước"
    }
  ];

// barn
export const initialBarnsData = [
  {
    key: "1",
    id: "A1",
    name: "Chuồng A1",
    type: "cattle",
    typeName: "Gia súc",
    capacity: 50,
    currentCount: 20,
    occupancy: 40,
    cleanliness: "good",
    cleanlinessName: "Sạch sẽ",
    status: "active" },
  {
    key: "2",
    id: "A2", 
    name: "Chuồng A2",
    type: "cattle",
    typeName: "Gia súc",
    capacity: 40,
    currentCount: 15,
    occupancy: 38,
    cleanliness: "good",
    cleanlinessName: "Sạch sẽ",
    status: "active" },
  {
    key: "3",
    id: "B1",
    name: "Chuồng B1",
    type: "cattle",
    typeName: "Gia súc",
    capacity: 100,
    currentCount: 45,
    occupancy: 45,
    cleanliness: "warning",
    cleanlinessName: "Cần vệ sinh",
    status: "active"},
  {
    key: "4",
    id: "B2",
    name: "Chuồng B2",
    type: "cattle",
    typeName: "Gia súc",
    capacity: 120,
    currentCount: 80,
    occupancy: 67,
    cleanliness: "good",
    cleanlinessName: "Sạch sẽ",
    status: "active"
},
    {
    key: "5",
    id: "C1",
    name: "Chuồng C1",
    type: "poultry",
    typeName: "Gia cầm",
    capacity: 5000,
    currentCount: 3200,
    occupancy: 64,
    cleanliness: "critical",
    cleanlinessName: "Bẩn, cần xử lý",
    status: "active"
    }
];

//feedstorage
export const initialFeedData = [
  {
    key: "1",
    id: "TA001",
    name: "Cỏ voi",
    type: "grass",
    typeName: "Cỏ",
    quantity: 1250,
    unit: "kg",
    expiryDate: "2024-12-15",
    room: "P1",
    roomName: "Phòng 1 ",
    status: "good",
    progress: 75
  },
  {
    key: "2",
    id: "TA002",
    name: "Thức ăn hỗn hợp lợn",
    type: "mixed",
    typeName: "Thức ăn hỗn hợp công nghiệp",
    quantity: 350,
    unit: "kg",
    expiryDate: "2024-10-25",
    room: "P2",
    roomName: "Phòng 2 ",
    status: "warning",
    progress: 45
  },
  {
    key: "3",
    id: "TA003",
    name: "Silage bắp",
    type: "fermented",
    typeName: "Thức ăn lên men",
    quantity: 800,
    unit: "kg",
    expiryDate: "2024-11-10",
    room: "P1",
    roomName: "Phòng 1 ",
    status: "good",
    progress: 90
  },
  {
    key: "4",
    id: "TA004",
    name: "Cám gạo",
    type: "byproduct",
    typeName: "Phụ phẩm nông nghiệp",
    quantity: 500,
    unit: "kg",
    expiryDate: "2024-09-30",
    room: "P3",
    roomName: "Phòng 3 ",
    status: "critical",
  },
];

//livestock
export const initialLivestockData = [
  {
    key: "1",
    id: "VN001",
    name: "Bò sữa 01",
    type: "cattle",
    subType: "milk",
    typeName: "Gia súc - Lấy sữa",
    weight: 450,
    production: 25,
    health: "good",
    healthName: "Khỏe mạnh",
    barn: "A1",
    barnName: "Chuồng A1",
    entryDate: "2024-01-15",
    status: "active"
  },
  {
    key: "2",
    id: "VN002",
    name: "Bò thịt 01",
    type: "cattle",
    subType: "meat", 
    typeName: "Gia súc - Lấy thịt",
    weight: 520,
    production: null,
    health: "good",
    healthName: "Khỏe mạnh",
    barn: "A2",
    barnName: "Chuồng A2",
    entryDate: "2024-03-10",
    status: "active"
  },
  {
    key: "3",
    id: "VN003",
    name: "Lợn thịt 01",
    type: "cattle",
    subType: "meat",
    typeName: "Gia súc - Lấy thịt", 
    weight: 180,
    production: null,
    health: "good",
    healthName: "Khỏe mạnh",
    barn: "B1",
    barnName: "Chuồng B1",
    entryDate: "2024-01-10",
    status: "active"
  },
  {
    key: "4",
    id: "VN004",
    name: "Gà thịt 01",
    type: "poultry",
    subType: "meat",
    typeName: "Gia cầm - Lấy thịt",
    weight: 3.5,
    production: null,
    health: "good",
    healthName: "Khỏe mạnh", 
    barn: "C1",
    barnName: "Chuồng C1",
    entryDate: "2024-02-15",
    status: "active"
  },
  {
    key: "5",
    id: "VN005",
    name: "Gà đẻ 01",
    type: "poultry",
    subType: "egg",
    typeName: "Gia cầm - Lấy trứng",
    weight: 2.8,
    production: 15,
    health: "warning",
    healthName: "Theo dõi",
    barn: "C2",
    barnName: "Chuồng C2",
    entryDate: "2024-01-20",
    status: "active"
  },
  {
    key: "6",
    id: "VN006",
    name: "Vịt thịt 01", 
    type: "poultry",
    subType: "meat",
    typeName: "Gia cầm - Lấy thịt",
    weight: 3.2,
    production: null,
    health: "good",
    healthName: "Khỏe mạnh",
    barn: "C3",
    barnName: "Chuồng C3", 
    entryDate: "2024-02-01",
    status: "active"
  },
  {
    key: "7",
    id: "VN007",
    name: "Vịt đẻ 01",
    type: "poultry",
    subType: "egg",
    typeName: "Gia cầm - Lấy trứng",
    weight: 2.9,
    production: 18,
    health: "good",
    healthName: "Khỏe mạnh",
    barn: "C3",
    barnName: "Chuồng C3",
    entryDate: "2024-02-01",
    status: "active"
  }
];

//staff
export const initialStaffData = [
  {
    key: "1",
    id: "NV001",
    name: "Nguyễn Văn A",
    role: "livestock",
    roleName: "Chăn nuôi",
    phone: "0901234567",
    hireDate: "2023-01-15",
    status: "active"
  },
  {
    key: "2",
    id: "NV002",
    name: "Trần Thị B",
    role: "veterinarian",
    roleName: "Thú y",
    phone: "0902345678",
    hireDate: "2023-06-20",
    status: "active"
  },
  {
    key: "3",
    id: "NV003",
    name: "Lê Văn C",
    role: "cleaner",
    roleName: "Vệ sinh",
    phone: "0903456789",
    hireDate: "2024-01-10",
    status: "active"
  },
];
