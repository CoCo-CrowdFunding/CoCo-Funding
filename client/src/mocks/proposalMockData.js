// 假資料
const mockProposals = [
  {
    _id: "1",
    category: "科技",
    title: "Smart Home Automation",
    description: "A project to develop a smart home automation system.",
    funding_goal: 10000,
    current_total_amount: 5000,
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    status: 0,
    funding_reached: 0,
    image: require("../asset/Road-mountains-thick-clouds-dusk_7680x4320.jpg"), // 使用require引入圖片
    comments: [
      {
        user_id: "user123",
        comment: "Can't wait for this to come out!",
        rate: 5,
        created: new Date(),
      },
      // More comments
    ],
  },
  {
    _id: "2",
    category: "藝術",
    title: "Modern Art Exhibition",
    description: "An exhibition showcasing modern art pieces.",
    funding_goal: 15000,
    current_total_amount: 12000,
    start_date: "2024-02-01",
    end_date: "2024-11-30",
    status: 1,
    funding_reached: 1,
    image: require("../asset/285505_0.jpg"), // 使用require引入圖片
    comments: [
      {
        user_id: "user123",
        comment: "Can't wait for this to come out!",
        rate: 5,
        created: new Date(),
      },
      // More comments
    ],
  },
  {
    _id: "3",
    category: "美食與飲品",
    title: "Organic Food Delivery Service",
    description: "A delivery service for organic food products.",
    funding_goal: 20000,
    current_total_amount: 10000,
    start_date: "2024-03-01",
    end_date: "2024-12-31",
    status: 2,
    funding_reached: 0,
    image: require("../asset/285506_0.jpg"), // 使用require引入圖片
    comments: [
      {
        user_id: "user123",
        comment: "Can't wait for this to come out!",
        rate: 5,
        created: new Date(),
      },
      // More comments
    ],
  },
  {
    _id: "4",
    category: "設計",
    title: "Innovative Furniture Design",
    description: "A project to create innovative furniture designs.",
    funding_goal: 25000,
    current_total_amount: 20000,
    start_date: "2024-04-01",
    end_date: "2024-10-31",
    status: 0,
    funding_reached: 1,
    image: require("../asset/animal_cat_4k_hd_animals_3-3840x2160.jpg"), // 使用require引入圖片
    comments: [
      {
        user_id: "user123",
        comment: "Can't wait for this to come out!",
        rate: 5,
        created: new Date(),
      },
      // More comments
    ],
  },
  {
    _id: "5",
    category: "音樂",
    title: "Live Music Festival",
    description: "A festival featuring live music performances.",
    funding_goal: 30000,
    current_total_amount: 25000,
    start_date: "2024-05-01",
    end_date: "2024-09-30",
    status: 0,
    funding_reached: 1,
    image: require("../asset/285505_0.jpg"), // 使用require引入圖片
    comments: [
      {
        user_id: "user123",
        comment: "Can't wait for this to come out!",
        rate: 5,
        created: new Date(),
      },
      // More comments
    ],
  },
  {
    _id: "6",
    category: "出版",
    title: "Children's Book Series",
    description: "A series of educational books for children.",
    funding_goal: 12000,
    current_total_amount: 8000,
    start_date: "2024-06-01",
    end_date: "2024-11-30",
    status: 1,
    funding_reached: 0,
    image: require("../asset/DJI_0736.JPG"), // 使用require引入圖片
    comments: [
      {
        user_id: "user123",
        comment: "Can't wait for this to come out!",
        rate: 5,
        created: new Date(),
      },
      // More comments
    ],
  },
  {
    _id: "7",
    category: "攝影",
    title: "Wildlife Photography Project",
    description: "A project to document wildlife through photography.",
    funding_goal: 18000,
    current_total_amount: 9000,
    start_date: "2024-07-01",
    end_date: "2024-12-31",
    status: 0,
    funding_reached: 0,
    image: require("../asset/Dog-rest-meadow-sunlight_2560x1600.jpg"), // 使用require引入圖片
    comments: [
      {
        user_id: "user123",
        comment: "Can't wait for this to come out!",
        rate: 5,
        created: new Date(),
      },
      // More comments
    ],
  },
  {
    _id: "8",
    category: "時尚",
    title: "Sustainable Fashion Line",
    description: "A fashion line focusing on sustainable materials.",
    funding_goal: 22000,
    current_total_amount: 11000,
    start_date: "2024-08-01",
    end_date: "2024-12-31",
    status: 0,
    funding_reached: 0,
    image: require("../asset/285083_0.jpg"), // 使用require引入圖片
    comments: [
      {
        user_id: "user123",
        comment: "Can't wait for this to come out!",
        rate: 5,
        created: new Date(),
      },
      // More comments
    ],
  },
  {
    _id: "9",
    category: "地方創生",
    title: "Community Garden Project",
    description: "A project to create community gardens in urban areas.",
    funding_goal: 14000,
    current_total_amount: 7000,
    start_date: "2024-09-01",
    end_date: "2024-12-31",
    status: 1,
    funding_reached: 0,
    image: require("../asset/285083_0.jpg"), // 使用require引入圖片
    comments: [
      {
        user_id: "user123",
        comment: "Can't wait for this to come out!",
        rate: 5,
        created: new Date(),
      },
      // More comments
    ],
  },
  {
    _id: "10",
    category: "科技",
    title: "Renewable Energy Solutions",
    description: "A project to develop renewable energy solutions.",
    funding_goal: 35000,
    current_total_amount: 28000,
    start_date: "2024-10-01",
    end_date: "2024-12-31",
    status: 0,
    funding_reached: 1,
    image: require("../asset/285083_0.jpg"), // 使用require引入圖片
    comments: [
      {
        user_id: "user123",
        comment: "Can't wait for this to come out!",
        rate: 5,
        created: new Date(),
      },
      // More comments
    ],
  },
];

export default mockProposals;
