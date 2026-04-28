import type {
  Category,
  HowItWorksStep,
  LabTier,
  Product,
  ProductDetailProduct,
  Testimonial,
} from "../types";

// ADMIN: Update product images, names, prices below.
// All image paths use /images/products/ for easy replacement via admin panel.
export const products: Product[] = [
  {
    id: "tinkro-starter-kit",
    name: "Tinkro Starter Robotics Kit",
    price: 4999,
    originalPrice: 6999,
    image: "/images/products/starter-kit.jpg",
    category: "Robotics Kits",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 342,
    description:
      "The perfect entry point into robotics. Build your first robot, learn programming fundamentals, and explore electronics — all in one complete kit designed for students aged 10 and above.",
    inStock: true,
  },
  {
    id: "tinkro-ai-vision",
    name: "Tinkro AI Vision Kit",
    price: 12999,
    originalPrice: 16999,
    image: "/images/products/ai-vision-kit.jpg",
    category: "AI & Vision Kits",
    badge: "Premium",
    rating: 4.9,
    reviews: 128,
    description:
      "Explore the future of artificial intelligence with computer vision. This advanced kit teaches object detection, face recognition, and real-time AI processing — perfect for students aged 14 and above.",
    inStock: true,
  },
  {
    id: "tinkro-iot-smarthome",
    name: "Tinkro IoT Smart Home Kit",
    price: 7499,
    originalPrice: 9999,
    image: "/images/products/iot-smarthome-kit.jpg",
    category: "IoT & Smart Kits",
    badge: "Popular",
    rating: 4.7,
    reviews: 215,
    description:
      "Build and automate a smart home model with sensors, actuators, and Wi-Fi connectivity. Learn IoT concepts, cloud integration, and real-world automation through hands-on projects.",
    inStock: true,
  },
  {
    id: "tinkro-sensor-pack",
    name: "Tinkro Sensor Explorer Pack",
    price: 2999,
    originalPrice: 3999,
    image: "/images/products/sensor-pack.jpg",
    category: "Sensors & Components",
    badge: "Value Pack",
    rating: 4.6,
    reviews: 189,
    description:
      "A comprehensive collection of 30+ sensors for hands-on learning. Includes ultrasonic, infrared, temperature, flame, gas, and more. Perfect for school projects, hackathons, and STEM experiments.",
    inStock: true,
  },
  {
    id: "tinkro-arduino-pro",
    name: "Tinkro Arduino Pro Learning Kit",
    price: 5999,
    originalPrice: 7999,
    image: "/images/products/arduino-pro-kit.jpg",
    category: "Arduino & Programming",
    badge: "Top Rated",
    rating: 4.8,
    reviews: 276,
    description:
      "Master Arduino programming with 50+ guided projects. From LED blink to advanced robotics control — this comprehensive kit takes students from zero to hero in embedded programming.",
    inStock: true,
  },
  {
    id: "tinkro-drone-kit",
    name: "Tinkro Drone Build Kit",
    price: 15999,
    originalPrice: 19999,
    image: "/images/products/drone-kit.jpg",
    category: "Drones & Aerial",
    badge: "Advanced",
    rating: 4.9,
    reviews: 87,
    description:
      "Build, program, and fly your own drone from scratch. Learn aerodynamics, flight controllers, PID tuning, and drone programming. Ideal for advanced students and school drone clubs.",
    inStock: true,
  },
  {
    id: "tinkro-stem-lab-pack",
    name: "Tinkro School STEM Pack",
    price: 24999,
    originalPrice: 34999,
    image: "/images/products/stem-lab-pack.jpg",
    category: "Lab Kits",
    badge: "School Pack",
    rating: 5.0,
    reviews: 64,
    description:
      "Everything a school needs to kickstart a STEM lab. Includes 5 Starter Kits, sensor packs, and curriculum guide for 20 students. Comes with GST invoice and installation support.",
    inStock: true,
  },
  {
    id: "tinkro-raspberry-kit",
    name: "Tinkro Raspberry Pi AI Kit",
    price: 8999,
    originalPrice: 11999,
    image: "/images/products/raspberry-kit.jpg",
    category: "AI & Vision Kits",
    badge: "New",
    rating: 4.8,
    reviews: 94,
    description:
      "Complete Raspberry Pi 4 bundle with 4GB RAM, pre-configured AI environment, camera module, and 10 guided AI projects. Ideal for IoT and machine learning applications.",
    inStock: true,
  },
];

// ADMIN: Update category images and names below.
export const categories: Category[] = [
  {
    id: "robotics-kits",
    name: "Robotics Kits",
    description: "Complete robotics learning systems",
    image: "/images/categories/robotics.jpg",
    productCount: 12,
    slug: "robotics-kits",
  },
  {
    id: "ai-kits",
    name: "AI & Vision Kits",
    description: "Artificial intelligence and computer vision",
    image: "/images/categories/ai-kits.jpg",
    productCount: 8,
    slug: "ai-kits",
  },
  {
    id: "iot-kits",
    name: "IoT & Smart Kits",
    description: "Internet of Things and connected devices",
    image: "/images/categories/iot-kits.jpg",
    productCount: 10,
    slug: "iot-kits",
  },
  {
    id: "arduino-kits",
    name: "Arduino & Programming",
    description: "Arduino boards, shields, and learning kits",
    image: "/images/categories/arduino.jpg",
    productCount: 15,
    slug: "arduino-kits",
  },
  {
    id: "sensors",
    name: "Sensors & Components",
    description: "Individual sensors and electronic components",
    image: "/images/categories/sensors.jpg",
    productCount: 30,
    slug: "sensors",
  },
  {
    id: "drone-kits",
    name: "Drones & Aerial",
    description: "Build and program your own drones",
    image: "/images/categories/drones.jpg",
    productCount: 6,
    slug: "drone-kits",
  },
];

export const labTiers: LabTier[] = [
  {
    id: "stem-lab",
    name: "School STEM Lab",
    tagline: "Modern STEM lab for progressive schools",
    priceRange: "₹2,50,000 – ₹3,50,000",
    color: "from-primary/10 to-primary/5",
    borderColor: "border-primary/20",
    glowColor: "shadow-primary/10",
    features: [
      "25–35 student workstations",
      "Robotics Kits × 10",
      "Electronics Components Kit",
      "Curriculum-aligned projects",
      "Teacher Resource Kit",
      "Technical support",
      "2-year warranty",
    ],
  },
  {
    id: "atl-lab",
    name: "Atal Tinkering Lab (ATL)",
    tagline: "Government-aligned innovation labs for India's schools",
    priceRange: "₹4,50,000 – ₹6,00,000",
    color: "from-accent/10 to-accent/5",
    borderColor: "border-accent/20",
    glowColor: "shadow-accent/10",
    features: [
      "30–40 student capacity",
      "NITI Aayog compliant",
      "3D Printer + Laser Cutter",
      "Robotics Kits × 15",
      "Teacher Training (3 days)",
      "1-year curriculum access",
      "GST invoice included",
    ],
  },
  {
    id: "pm-shri-lab",
    name: "PM SHRI Schools Lab",
    tagline: "Specially designed for PM SHRI certified schools",
    priceRange: "₹3,50,000 – ₹5,00,000",
    color: "from-primary/10 to-accent/5",
    borderColor: "border-primary/40",
    glowColor: "shadow-primary/15",
    highlight: true,
    features: [
      "30–40 student capacity",
      "NEP 2020 aligned",
      "CBSE curriculum mapped",
      "PM SHRI compliance docs",
      "Teacher Training (5 days)",
      "Quarterly progress reports",
      "Government subsidy guidance",
    ],
  },
  {
    id: "robotics-lab",
    name: "Advanced Robotics Lab",
    tagline: "Professional-grade robotics for competitive schools",
    priceRange: "₹6,50,000 – ₹9,00,000",
    color: "from-secondary/20 to-secondary/10",
    borderColor: "border-secondary/40",
    glowColor: "shadow-secondary/10",
    features: [
      "20–30 student capacity",
      "Competition-ready equipment",
      "Drone Build Kits × 4",
      "AI Vision Systems × 5",
      "Competition arena (3m × 3m)",
      "Dedicated competition coach",
      "Lifetime support",
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Dr. Priya Sharma",
    role: "Principal",
    organization: "Delhi Public School, Bengaluru",
    content:
      "Tinkro transformed our STEM lab into a genuine innovation hub. Students are building robots from day one. The curriculum is brilliant and teacher support is excellent.",
    avatar: "/assets/generated/avatar-principal.jpg",
    rating: 5,
  },
  {
    id: "t2",
    name: "Arjun Mehta",
    role: "Student, Grade 10",
    organization: "Ryan International School",
    content:
      "I built my first self-driving robot in just 3 weeks using Tinkro's Starter Kit. The step-by-step guide made it super easy. Now I want to do engineering!",
    avatar: "/assets/generated/avatar-student.jpg",
    rating: 5,
  },
  {
    id: "t3",
    name: "Sunita Reddy",
    role: "Parent",
    organization: "Hyderabad",
    content:
      "My daughter was afraid of technology. After 2 months with Tinkro kits, she coded her own weather station. The quality is outstanding and completely worth every rupee.",
    avatar: "/assets/generated/avatar-parent.jpg",
    rating: 5,
  },
  {
    id: "t4",
    name: "Vikram Nair",
    role: "STEM Coordinator",
    organization: "Kendriya Vidyalaya, Pune",
    content:
      "Tinkro's advanced lab setup with AI and IoT modules puts us ahead of any school in the region. The post-installation support team is incredibly responsive.",
    avatar: "/assets/generated/avatar-coordinator.jpg",
    rating: 5,
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    title: "Unbox",
    description:
      "Everything arrives pre-sorted in premium packaging. All components labeled, no missing parts, no guesswork.",
    icon: "📦",
  },
  {
    step: 2,
    title: "Build",
    description:
      "Follow our illustrated, video-guided instructions. Build your first robot in under 2 hours — no prior experience needed.",
    icon: "🔧",
  },
  {
    step: 3,
    title: "Code",
    description:
      "Program using block-based Scratch or Python. See your creation move, sense, and respond to the real world.",
    icon: "💻",
  },
];

// ADMIN: Flagship product data for product detail page
export const tinkroStarterKit: ProductDetailProduct = {
  id: "tinkro-starter-kit",
  name: "Tinkro Starter Robotics Kit",
  price: 4999,
  originalPrice: 6999,
  rating: 4.8,
  reviewCount: 342,
  image: "/images/products/starter-kit.jpg",
  galleryImages: [
    "/images/products/starter-kit.jpg",
    "/images/products/starter-kit-contents.jpg",
    "/images/products/starter-kit-built.jpg",
    "/assets/brand/product-robot-chassis.jpg",
    "/assets/brand/product-arduino-r4.jpg",
  ],
  category: "Robotics Kits",
  badge: "Best Seller",
  tagline: "Your First Step Into the World of Robotics",
  benefitDescription:
    "The Tinkro Starter Robotics Kit is designed for students aged 10 and above who want to begin their robotics journey the right way. No prior experience needed — just curiosity and enthusiasm. Everything you need to go from unboxing to your first autonomous robot is inside.",
  inStock: true,
  problemStatement:
    "Robotics kits are expensive and complicated. Most beginner kits leave you with a pile of components, a vague instruction sheet, and no idea where to start. You end up frustrated, not inspired.",
  solutionStatement:
    "Tinkro simplifies everything. Every component in the Starter Kit is pre-matched to work together, with a step-by-step illustrated guidebook and guided video projects that take you from blinking an LED all the way to building a line-following robot — all in the right order.",
  outcomeStatement:
    "Within 2 hours of unboxing, you'll have a working circuit. Within a weekend, you'll have a fully autonomous 2WD robot navigating your floor. By week 4, you'll understand sensors, motor control, and embedded programming — skills that open the door to engineering, AI, and beyond.",
  kitContents: [
    {
      iconName: "cpu",
      label: "Arduino Uno R3",
      description:
        "The brain of your robot — an industry-standard microcontroller used by engineers worldwide",
      quantity: 1,
    },
    {
      iconName: "truck",
      label: "Chassis & Wheels Kit",
      description:
        "Transparent acrylic body with TT motors, rubber wheels, and battery mount",
      quantity: 1,
    },
    {
      iconName: "zap",
      label: "Motor Driver Module",
      description:
        "L298N dual H-bridge driver to control both DC motors independently",
      quantity: 1,
    },
    {
      iconName: "radio",
      label: "Ultrasonic Sensor",
      description:
        "HC-SR04 distance sensor for obstacle detection up to 4 meters",
      quantity: 1,
    },
    {
      iconName: "activity",
      label: "IR Sensors",
      description: "Pair of infrared sensors for line-following robot projects",
      quantity: 2,
    },
    {
      iconName: "bluetooth",
      label: "Servo Motor",
      description:
        "SG90 micro servo for sensor mounting and articulation projects",
      quantity: 1,
    },
    {
      iconName: "layers",
      label: "Breadboard & Jumper Wires",
      description: "Full-size breadboard with 65 premium dupont jumper cables",
      quantity: 1,
    },
    {
      iconName: "link",
      label: "USB Cable",
      description: "USB-A to USB-B cable for Arduino programming from your PC",
      quantity: 1,
    },
    {
      iconName: "book-open",
      label: "Quick-Start Guide",
      description:
        "Full-colour illustrated guidebook with 8 step-by-step robot projects",
      quantity: 1,
    },
    {
      iconName: "shield",
      label: "Sticker Pack",
      description:
        "Tinkro branding stickers to personalise your robot and storage box",
      quantity: 1,
    },
  ],
  useCases: [
    {
      id: "uc1",
      audience: "students",
      title: "For Students",
      description:
        "Build real projects for school science fairs, coding competitions, and personal portfolios. Go from beginner to confident maker in weeks, not years. The kit includes competition-ready projects compatible with ATL and PM SHRI programmes.",
      icon: "🎓",
      benefit: "First robot built in under 2 hours",
    },
    {
      id: "uc2",
      audience: "schools",
      title: "For Schools",
      description:
        "STEM-aligned curriculum projects compatible with ATL, PM SHRI, and Atal Tinkering Labs. Comes with teacher notes and assessment rubrics. Order in bulk for your entire class or lab.",
      icon: "🏫",
      benefit: "ATL & PM SHRI curriculum aligned",
    },
    {
      id: "uc3",
      audience: "beginners",
      title: "For Parents",
      description:
        "The perfect holiday project or birthday gift for curious kids aged 10 and above. Zero experience needed — the guidebook starts at the very beginning. Watch your child's confidence grow with every build.",
      icon: "🚀",
      benefit: "Age 10+ friendly, no prior experience needed",
    },
  ],
  reviews: [
    {
      id: "r1",
      name: "Arjun Mehta",
      role: "Student, Grade 10",
      rating: 5,
      date: "March 2026",
      title: "Built my first robot in one weekend!",
      content:
        "I had zero experience with electronics before this. The step-by-step guide is crystal clear — I had my line-following robot working in less than 3 hours. The Bluetooth control project blew my friends' minds. Worth every rupee.",
      verified: true,
    },
    {
      id: "r2",
      name: "Dr. Priya Sharma",
      role: "Principal, DPS Bengaluru",
      rating: 5,
      date: "February 2026",
      title: "Perfect for our ATL lab rollout",
      content:
        "We ordered 15 kits for our Atal Tinkering Lab. Every single component arrived correctly labeled and organized. Students were building within 20 minutes of opening the box. The teacher guide is a lifesaver.",
      verified: true,
    },
    {
      id: "r3",
      name: "Sunita Reddy",
      role: "Parent, Hyderabad",
      rating: 5,
      date: "January 2026",
      title: "My daughter built a weather station!",
      content:
        "My 13-year-old daughter was hesitant about 'tech stuff'. Two months later, she's coded a weather station and is asking for the advanced AI kit. The quality of the components is exceptional — nothing feels cheap or fragile.",
      verified: true,
    },
    {
      id: "r4",
      name: "Rahul Krishnamurthy",
      role: "STEM Teacher, Bengaluru",
      rating: 5,
      date: "December 2025",
      title: "The best beginner kit I've ever used in class",
      content:
        "I've tried 4 other robotics kits. This one wins on component quality, documentation clarity, and the video project library. Students stay engaged because projects actually work on first try. Ordering 10 more kits next semester.",
      verified: true,
    },
    {
      id: "r5",
      name: "Ananya Patel",
      role: "Engineering Student, NIT Surat",
      rating: 4,
      date: "November 2025",
      title: "Great foundation kit for beginners",
      content:
        "Solid quality components, the chassis is sturdy, and the Arduino is genuine. Removed one star because I wish the Bluetooth range was slightly better for advanced projects. But for a beginner kit? Absolutely perfect.",
      verified: true,
    },
    {
      id: "r6",
      name: "Vikram Nair",
      role: "STEM Coordinator, KV Pune",
      rating: 5,
      date: "October 2025",
      title: "School-ready, curriculum-aligned",
      content:
        "The teacher notes and assessment rubrics that come with this kit saved us weeks of curriculum planning. Students compete at district-level fairs using these projects. Tinkro's after-sales support is also outstanding.",
      verified: true,
    },
  ],
};
