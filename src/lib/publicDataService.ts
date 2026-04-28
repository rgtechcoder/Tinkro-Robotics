// // Firebase disabled temporarily — all hooks return static mock data
// // Will be re-integrated with real Firebase once the app is stable.

// import type {
//   AdminBanner,
//   AdminBlogPost,
//   AdminCategory,
//   AdminCoupon,
//   AdminLabSetup,
//   AdminProduct,
// } from "@/types/admin";

// // ─── Mock Data ────────────────────────────────────────────────────────────────

// export const MOCK_PRODUCTS: AdminProduct[] = [
//   {
//     id: "tinkro-starter-kit",
//     name: "Tinkro Starter Robotics Kit",
//     description:
//       "The perfect entry point into robotics. Build your first robot, learn programming fundamentals, and explore electronics — all in one complete kit designed for students aged 10 and above.",
//     price: 4999,
//     originalPrice: 6999,
//     image: "/images/products/starter-kit.jpg",
//     images: ["/images/products/starter-kit.jpg"],
//     category: "Robotics Kits",
//     categoryId: "robotics-kits",
//     categoryIds: ["robotics-kits", "starter-kits"],
//     badge: "Best Seller",
//     rating: 4.8,
//     reviews: 342,
//     inStock: true,
//     stock: 150,
//     discount: 28,
//     sku: "TKR-STR-001",
//     tags: ["starter", "beginner", "Arduino", "robotics"],
//     isActive: true,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "tinkro-ai-vision",
//     name: "Tinkro AI Vision Kit",
//     description:
//       "Explore the future of artificial intelligence with computer vision. This advanced kit teaches object detection, face recognition, and real-time AI processing — perfect for students aged 14 and above and STEM labs.",
//     price: 12999,
//     originalPrice: 16999,
//     image: "/images/products/ai-vision-kit.jpg",
//     images: ["/images/products/ai-vision-kit.jpg"],
//     category: "AI & Vision Kits",
//     categoryId: "ai-kits",
//     categoryIds: ["ai-kits", "advanced-kits"],
//     badge: "Premium",
//     rating: 4.9,
//     reviews: 128,
//     inStock: true,
//     stock: 75,
//     discount: 23,
//     sku: "TKR-AIV-001",
//     tags: ["AI", "computer vision", "machine learning", "advanced"],
//     isActive: true,
//     createdAt: "2024-01-02T00:00:00Z",
//   },
//   {
//     id: "tinkro-iot-smarthome",
//     name: "Tinkro IoT Smart Home Kit",
//     description:
//       "Build and automate a smart home model with sensors, actuators, and Wi-Fi connectivity. Learn IoT concepts, cloud integration, and real-world automation through hands-on projects.",
//     price: 7499,
//     originalPrice: 9999,
//     image: "/images/products/iot-smarthome-kit.jpg",
//     images: ["/images/products/iot-smarthome-kit.jpg"],
//     category: "IoT & Smart Kits",
//     categoryId: "iot-kits",
//     categoryIds: ["iot-kits", "smart-kits"],
//     badge: "Popular",
//     rating: 4.7,
//     reviews: 215,
//     inStock: true,
//     stock: 100,
//     discount: 25,
//     sku: "TKR-IOT-001",
//     tags: ["IoT", "smart home", "Wi-Fi", "sensors", "automation"],
//     isActive: true,
//     createdAt: "2024-01-03T00:00:00Z",
//   },
//   {
//     id: "tinkro-sensor-pack",
//     name: "Tinkro Sensor Explorer Pack",
//     description:
//       "A comprehensive collection of 30+ sensors for hands-on learning. Includes ultrasonic, infrared, temperature, flame, gas, and more. Perfect for school projects, hackathons, and STEM experiments.",
//     price: 2999,
//     originalPrice: 3999,
//     image: "/images/products/sensor-pack.jpg",
//     images: ["/images/products/sensor-pack.jpg"],
//     category: "Sensors & Components",
//     categoryId: "sensors",
//     categoryIds: ["sensors", "components"],
//     badge: "Value Pack",
//     rating: 4.6,
//     reviews: 189,
//     inStock: true,
//     stock: 200,
//     discount: 25,
//     sku: "TKR-SEN-001",
//     tags: ["sensors", "components", "experiments", "school projects"],
//     isActive: true,
//     createdAt: "2024-01-04T00:00:00Z",
//   },
//   {
//     id: "tinkro-arduino-pro",
//     name: "Tinkro Arduino Pro Learning Kit",
//     description:
//       "Master Arduino programming with 50+ guided projects. From LED blink to advanced robotics control — this comprehensive kit takes students from zero to hero in embedded programming.",
//     price: 5999,
//     originalPrice: 7999,
//     image: "/images/products/arduino-pro-kit.jpg",
//     images: ["/images/products/arduino-pro-kit.jpg"],
//     category: "Arduino & Programming",
//     categoryId: "arduino-kits",
//     categoryIds: ["arduino-kits", "programming-kits"],
//     badge: "Top Rated",
//     rating: 4.8,
//     reviews: 276,
//     inStock: true,
//     stock: 120,
//     discount: 25,
//     sku: "TKR-ARD-001",
//     tags: ["Arduino", "programming", "embedded", "projects", "learning"],
//     isActive: true,
//     createdAt: "2024-01-05T00:00:00Z",
//   },
//   {
//     id: "tinkro-drone-kit",
//     name: "Tinkro Drone Build Kit",
//     description:
//       "Build, program, and fly your own drone from scratch. Learn aerodynamics, flight controllers, PID tuning, and drone programming. Ideal for advanced students and school drone clubs.",
//     price: 15999,
//     originalPrice: 19999,
//     image: "/images/products/drone-kit.jpg",
//     images: ["/images/products/drone-kit.jpg"],
//     category: "Drones & Aerial",
//     categoryId: "drone-kits",
//     categoryIds: ["drone-kits", "advanced-kits"],
//     badge: "Advanced",
//     rating: 4.9,
//     reviews: 87,
//     inStock: true,
//     stock: 50,
//     discount: 20,
//     sku: "TKR-DRN-001",
//     tags: ["drone", "flight", "aerodynamics", "advanced", "programming"],
//     isActive: true,
//     createdAt: "2024-01-06T00:00:00Z",
//   },
// ];

// export const MOCK_CATEGORIES: AdminCategory[] = [
//   {
//     id: "robotics-kits",
//     name: "Robotics Kits",
//     description: "Complete robotics learning systems",
//     slug: "robotics-kits",
//     imageUrl: "/images/categories/robotics.jpg",
//     color: "#F47B20",
//     productCount: 12,
//     isActive: true,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "ai-kits",
//     name: "AI & Vision Kits",
//     description: "Artificial intelligence and computer vision",
//     slug: "ai-kits",
//     imageUrl: "/images/categories/ai-kits.jpg",
//     color: "#8B5CF6",
//     productCount: 8,
//     isActive: true,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "iot-kits",
//     name: "IoT & Smart Kits",
//     description: "Internet of Things and connected devices",
//     slug: "iot-kits",
//     imageUrl: "/images/categories/iot-kits.jpg",
//     color: "#3BBFBF",
//     productCount: 10,
//     isActive: true,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "arduino-kits",
//     name: "Arduino & Programming",
//     description: "Arduino boards, shields, and learning kits",
//     slug: "arduino-kits",
//     imageUrl: "/images/categories/arduino.jpg",
//     color: "#2E6DA4",
//     productCount: 15,
//     isActive: true,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "sensors",
//     name: "Sensors & Components",
//     description: "Individual sensors and electronic components",
//     slug: "sensors",
//     imageUrl: "/images/categories/sensors.jpg",
//     color: "#10B981",
//     productCount: 30,
//     isActive: true,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "drone-kits",
//     name: "Drones & Aerial",
//     description: "Build and program your own drones",
//     slug: "drone-kits",
//     imageUrl: "/images/categories/drones.jpg",
//     color: "#EC4899",
//     productCount: 6,
//     isActive: true,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
// ];

// export const MOCK_BLOG_POSTS: AdminBlogPost[] = [
//   {
//     id: "getting-started-with-robotics",
//     title: "Getting Started with Robotics: A Complete Guide for Students",
//     slug: "getting-started-with-robotics",
//     category: "Getting Started",
//     content: `# Getting Started with Robotics: A Complete Guide for Students\n\nRobotics doesn't have to be complicated. Whether you're 10 or 18, this guide walks you through your first robot build — from unboxing to your first autonomous move.\n\n## What Is Robotics?\nRobotics is the intersection of electronics, programming, and mechanical engineering. When you build a robot, you're learning all three simultaneously — which is why it's one of the most powerful STEM disciplines.\n\n## What You'll Need\n- A beginner-friendly robotics kit (like the Tinkro Starter Kit)\n- A laptop or computer with the Arduino IDE installed\n- Curiosity and patience — it's a skill, not magic\n\n## Your First Build\nStart with the simplest project: an LED blink. It sounds boring, but it teaches you how to connect components, write code, and upload it to a microcontroller. Every robotics expert started here.\n\n## From Blink to Bot\nOnce your LED blinks, you're ready to build. Connect a motor driver, attach a chassis, add IR sensors — and within hours, you have a robot that follows a line on the floor automatically.\n\n## Why Start Now?\nSchool robotics competitions like WRO, Robo Olympiad, and national science fairs give students massive opportunities. Starting early means you'll be competition-ready in months, not years.\n\nThe best time to start? Right now.`,
//     excerpt:
//       "Robotics doesn't have to be complicated. Whether you're 10 or 18, this guide walks you through your first robot build — from unboxing to your first autonomous move.",
//     featuredImage: "/images/blog/getting-started-robotics.jpg",
//     author: "Tinkro Team",
//     status: "published",
//     publishedAt: "2024-01-15T08:00:00Z",
//     tags: ["robotics", "beginners", "students", "guide"],
//     views: 5842,
//     createdAt: "2024-01-15T08:00:00Z",
//   },
//   {
//     id: "atl-lab-setup-guide",
//     title: "Setting Up an ATL Lab: What Every School Needs to Know",
//     slug: "atl-lab-setup-guide",
//     category: "Lab Setup",
//     content: `# Setting Up an ATL Lab: What Every School Needs to Know\n\nAtal Tinkering Labs are transforming STEM education across India. Here's a comprehensive guide to setting up, managing, and maximising your ATL lab investment.\n\n## What Is an ATL?\nAn Atal Tinkering Lab (ATL) is a dedicated innovation workspace set up under NITI Aayog's Atal Innovation Mission. It provides students from Classes 6–12 with access to tools like 3D printers, robotics kits, IoT devices, and electronics workstations.\n\n## Eligibility & Application\nAny school affiliated with a recognised board (CBSE, ICSE, State) can apply through the AIM portal. The grant covers equipment, training, and operational costs over 5 years.\n\n## What Equipment Is Required?\nThe AIM guidelines specify a detailed equipment list — 3D printers, laser cutters, robotics kits, soldering stations, and electronics components. Tinkro supplies fully compliant ATL packages that meet every item on the official list.\n\n## Maximising Your ATL Investment\n- Run weekly tinkering sessions — not just exam-time projects\n- Involve students in competition prep (WRO, Robo Olympiad, IRIS)\n- Get teachers trained before students use the equipment\n- Document student projects for AIM quarterly reports\n\n## How Tinkro Helps\nTinkro provides end-to-end ATL setup: compliant equipment, professional installation, 3-day teacher training, 1-year curriculum access, and dedicated ongoing support. We've set up labs in 200+ schools across India.`,
//     excerpt:
//       "Atal Tinkering Labs are transforming STEM education across India. Here's a comprehensive guide to setting up, managing, and maximising your ATL lab investment.",
//     featuredImage: "/images/blog/atl-lab-setup.jpg",
//     author: "Riya Sharma",
//     status: "published",
//     publishedAt: "2024-02-03T09:00:00Z",
//     tags: ["ATL", "school lab", "STEM", "Atal Tinkering Lab"],
//     views: 4211,
//     createdAt: "2024-02-03T09:00:00Z",
//   },
//   {
//     id: "ai-in-school-education",
//     title: "Why Every School Should Teach AI in 2024",
//     slug: "ai-in-school-education",
//     category: "AI & Education",
//     content: `# Why Every School Should Teach AI in 2024\n\nArtificial intelligence is no longer a future concept — it's a present skill. Discover how schools across India are introducing AI education and why your school should too.\n\n## AI Is Already Everywhere\nFrom your phone's face unlock to YouTube recommendations, AI is embedded in daily life. Students who understand how it works have a massive advantage — in college admissions, careers, and problem-solving.\n\n## What AI Education Looks Like in Schools\nYou don't need a computer science degree to teach AI. Modern tools like Tinkro's AI Vision Kit let students experiment with object detection, facial recognition, and real-time image processing using pre-built hardware — no complex setup needed.\n\n## The National Education Policy (NEP 2020) Mandate\nNEP 2020 explicitly calls for AI and coding education from Class 6 onwards. Schools that act now are ahead of mandatory curriculum changes that are coming regardless.\n\n## What Students Learn\n- How machine learning models are trained\n- Real-time object and face detection using cameras\n- Python programming for AI applications\n- Ethical AI: bias, fairness, and responsible deployment\n\n## Starting Small\nYou don't need a full AI lab to start. One Tinkro AI Vision Kit and 5 students is enough to run a successful after-school AI club — and create projects that genuinely impress at science fairs and competitions.\n\nThe schools teaching AI today are building India's AI engineers for tomorrow.`,
//     excerpt:
//       "Artificial intelligence is no longer a future concept — it's a present skill. Discover how schools across India are introducing AI education and why your school should too.",
//     featuredImage: "/images/blog/ai-in-schools.jpg",
//     author: "Dr. Anish Kapoor",
//     status: "published",
//     publishedAt: "2024-02-20T10:00:00Z",
//     tags: ["AI", "education", "schools", "future skills"],
//     views: 7834,
//     createdAt: "2024-02-20T10:00:00Z",
//   },
//   {
//     id: "stem-vs-steam-education",
//     title: "STEM vs STEAM: What's the Difference and Why It Matters",
//     slug: "stem-vs-steam-education",
//     category: "Education Insights",
//     content: `# STEM vs STEAM: What's the Difference and Why It Matters\n\nIs your school teaching STEM or STEAM? Understanding the difference could transform how students approach problem solving, creativity, and innovation in the classroom.\n\n## STEM Defined\nSTEM stands for Science, Technology, Engineering, and Mathematics. It's the foundation of technical education — the hard skills that power engineering, medicine, research, and technology careers.\n\n## What STEAM Adds\nSTEAM adds Arts to the equation. This isn't about painting or music for its own sake — it's about design thinking, creative problem-solving, and human-centred engineering. The world's best engineers and technologists are creative thinkers first.\n\n## Why the 'A' Matters in Robotics\nWhen students build a robot, they need to think about aesthetics, usability, and user experience — not just whether it works. The most impactful STEM inventions succeed because they're beautifully designed and easy to use. That's STEAM in action.\n\n## Practical Implications for Schools\n- Include design challenges in robotics projects (not just function, but form)\n- Run cross-disciplinary projects between art, computer science, and engineering classes\n- Evaluate projects on creativity and presentation, not just technical correctness\n\n## The Tinkro Approach\nAll Tinkro kits include open-ended creative challenges alongside structured technical projects — because we believe the best engineers are also creative thinkers.`,
//     excerpt:
//       "Is your school teaching STEM or STEAM? Understanding the difference could transform how students approach problem solving, creativity, and innovation in the classroom.",
//     featuredImage: "/images/blog/stem-steam.jpg",
//     author: "Priya Mehta",
//     status: "published",
//     publishedAt: "2024-03-05T10:00:00Z",
//     tags: ["STEM", "STEAM", "education", "learning"],
//     views: 3102,
//     createdAt: "2024-03-05T10:00:00Z",
//   },
//   {
//     id: "top-robotics-competitions-india",
//     title: "Top Robotics Competitions for Students in India 2024",
//     slug: "top-robotics-competitions-india",
//     category: "Competitions",
//     content: `# Top Robotics Competitions for Students in India 2024\n\nFrom WRO to RoboTech, here's your complete guide to the best robotics competitions for school students in India — with tips on how to prepare and win.\n\n## 1. World Robot Olympiad (WRO)\nThe world's largest robotics competition for students, with national rounds leading to the international finals. Teams of 2–3 students build LEGO or custom robots to solve mission challenges. India's national round happens mid-year.\n\n## 2. Robo Olympiad — STEMROBO\nIndia's largest school-level robotics competition with 50,000+ participants. Categories span beginner to advanced, with STEM challenges, drone events, and AI projects.\n\n## 3. IRIS National Science Fair\nNot just robotics — this science and innovation fair gives students from Classes 6–12 a platform to showcase real engineering projects. Robotics projects regularly win top honours.\n\n## 4. FIRST LEGO League (FLL)\nA global programme teaching systems thinking and teamwork through LEGO Mindstorms robotics. Teams research a real-world problem and build a robot to solve it.\n\n## 5. Tinkro Robotics Challenge (TRC)\nTinkro's own annual competition for schools using Tinkro equipment. Open to all skill levels, with prizes, trophies, and scholarship opportunities for top performers.\n\n## How to Prepare\n- Start building 6 months before the competition\n- Focus on one or two core skills rather than everything\n- Practice robot programming and mechanical reliability equally\n- Enter smaller local competitions first to build confidence\n\nWith a Tinkro kit and a dedicated team, your school can be competition-ready within a semester.`,
//     excerpt:
//       "From WRO to RoboTech, here's your complete guide to the best robotics competitions for school students in India — with tips on how to prepare and win.",
//     featuredImage: "/images/blog/robotics-competitions.jpg",
//     author: "Tinkro Team",
//     status: "published",
//     publishedAt: "2024-03-18T09:00:00Z",
//     tags: ["robotics competitions", "WRO", "students", "India", "2024"],
//     views: 6423,
//     createdAt: "2024-03-18T09:00:00Z",
//   },
// ];

// export const MOCK_BANNERS: AdminBanner[] = [
//   {
//     id: "summer-stem-sale",
//     title: "Summer STEM Sale — Up to 30% Off",
//     description:
//       "Level up your skills this summer. Save big on robotics kits, AI kits, and STEM lab packages.",
//     imageUrl: "/assets/generated/hero-robot.png",
//     ctaText: "Shop the Sale",
//     ctaLink: "/products",
//     type: "banner",
//     position: "top",
//     isActive: false,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "school-lab-setup",
//     title: "Set Up Your School's Robotics Lab",
//     description:
//       "Turnkey ATL, STEM, and Robotics lab solutions for schools across India. GST invoices, training, and ongoing support included.",
//     imageUrl: "/assets/brand/banner-lab.jpg",
//     ctaText: "Explore Lab Packages",
//     ctaLink: "/contact?subject=Lab+Setup+Enquiry%3A+General",
//     type: "banner",
//     position: "center",
//     isActive: false,
//     createdAt: "2024-01-02T00:00:00Z",
//   },
//   {
//     id: "new-ai-kit-launch",
//     title: "New: Tinkro AI Vision Kit",
//     description:
//       "India's most advanced school AI kit is here. Explore computer vision, face recognition, and real-time object detection.",
//     imageUrl: "/images/products/ai-vision-kit.jpg",
//     ctaText: "Explore the Kit",
//     ctaLink: "/products/tinkro-ai-vision",
//     type: "banner",
//     position: "center",
//     isActive: false,
//     createdAt: "2024-01-03T00:00:00Z",
//   },
// ];

// export const MOCK_LAB_SETUPS: AdminLabSetup[] = [
//   {
//     id: "atl-lab",
//     name: "Atal Tinkering Lab (ATL)",
//     type: "atl",
//     description:
//       "Fully compliant ATL lab setup aligned with NITI Aayog guidelines. Includes all required equipment, furniture, tools, and training to get your ATL certified and operational.",
//     priceRange: { min: 450000, max: 600000 },
//     includedItems: [
//       "3D Printer (FDM)",
//       "Laser Cutter",
//       "Robotics Kits × 15",
//       "Electronics Workstations × 10",
//       "Tool Cabinet",
//       "ATL Furniture Set",
//       "Teacher Training (3 days)",
//       "Installation & Setup",
//       "1-year curriculum access",
//       "NITI Aayog compliance documentation",
//     ],
//     targetAudience: "Schools with NITI Aayog ATL grant",
//     isActive: true,
//     order: 1,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "stem-lab",
//     name: "School STEM Lab",
//     type: "stem",
//     description:
//       "A comprehensive STEM learning environment designed for Indian schools that want to deliver hands-on science, technology, engineering, and mathematics education. Scalable for classes 6–12.",
//     priceRange: { min: 250000, max: 350000 },
//     includedItems: [
//       "Robotics Kits × 10",
//       "Electronics Components Kit",
//       "Science Experiment Kits",
//       "Student Workbenches × 8",
//       "Teacher Station",
//       "Storage Cabinets",
//       "Curriculum Package",
//       "Teacher Resource Kit",
//       "Student Experiment Workbooks",
//     ],
//     targetAudience: "Primary and secondary schools",
//     isActive: true,
//     order: 2,
//     createdAt: "2024-01-02T00:00:00Z",
//   },
//   {
//     id: "robotics-lab",
//     name: "Advanced Robotics Lab",
//     type: "robotics",
//     description:
//       "Built for schools that want to compete at national and international robotics competitions. Includes advanced robots, drone systems, AI hardware, and competition preparation support.",
//     priceRange: { min: 650000, max: 900000 },
//     includedItems: [
//       "Advanced Robot Systems × 8",
//       "Drone Build Kits × 4",
//       "AI Vision Systems × 5",
//       "Competition Arena (3m × 3m)",
//       "Professional Tools Set",
//       "Training Program (10 days)",
//       "Online Competition Prep",
//       "Dedicated competition coach access",
//     ],
//     targetAudience: "Schools competing in WRO, Robo Olympiad, IRIS",
//     isActive: true,
//     order: 3,
//     createdAt: "2024-01-03T00:00:00Z",
//   },
//   {
//     id: "pm-shri-lab",
//     name: "PM SHRI Schools Lab",
//     type: "pmshri",
//     description:
//       "Customised lab solution for PM SHRI schools with CBSE curriculum alignment, NEP 2020 compliance, and all documentation required for PM SHRI certification and reporting.",
//     priceRange: { min: 350000, max: 500000 },
//     includedItems: [
//       "STEM Equipment Kit",
//       "Robotics Kits × 12",
//       "Digital Classroom Tools",
//       "Student Tablets × 10",
//       "PM SHRI Documentation Package",
//       "Teacher Training (5 days)",
//       "Annual Reporting Support",
//       "Quarterly progress reports",
//     ],
//     targetAudience: "PM SHRI designated schools",
//     isActive: true,
//     order: 4,
//     createdAt: "2024-01-04T00:00:00Z",
//   },
// ];

// export const MOCK_COUPONS: AdminCoupon[] = [
//   {
//     id: "coup-1",
//     code: "TINKRO10",
//     discountType: "percent",
//     discountValue: 10,
//     minOrderAmount: 500,
//     isActive: true,
//     expiresAt: "2025-12-31T23:59:59Z",
//     usageLimit: 0,
//     usedCount: 0,
//     description: "10% off on all orders",
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "coup-2",
//     code: "STEM20",
//     discountType: "percent",
//     discountValue: 20,
//     minOrderAmount: 1000,
//     isActive: true,
//     expiresAt: "2025-12-31T23:59:59Z",
//     usageLimit: 0,
//     usedCount: 0,
//     description: "20% off on STEM kit purchases",
//     createdAt: "2024-01-01T00:00:00Z",
//   },
// ];

// // ─── Hooks ────────────────────────────────────────────────────────────────────

// export function useProducts(): {
//   products: AdminProduct[];
//   loading: boolean;
//   error: string | null;
// } {
//   return { products: MOCK_PRODUCTS, loading: false, error: null };
// }

// export function useProductsByCategory(categoryId: string | null): {
//   products: AdminProduct[];
//   loading: boolean;
//   error: string | null;
// } {
//   const products = categoryId
//     ? MOCK_PRODUCTS.filter((p) => {
//         if (Array.isArray(p.categoryIds) && p.categoryIds.length > 0) {
//           return p.categoryIds.includes(categoryId);
//         }
//         return p.categoryId === categoryId || p.category === categoryId;
//       })
//     : MOCK_PRODUCTS;
//   return { products, loading: false, error: null };
// }

// export function useCategories(): {
//   categories: AdminCategory[];
//   loading: boolean;
//   error: string | null;
// } {
//   return { categories: MOCK_CATEGORIES, loading: false, error: null };
// }

// export function useLabSetups(): {
//   labSetups: AdminLabSetup[];
//   loading: boolean;
//   error: string | null;
// } {
//   return { labSetups: MOCK_LAB_SETUPS, loading: false, error: null };
// }

// export function useBanners(): {
//   banners: AdminBanner[];
//   loading: boolean;
//   error: string | null;
// } {
//   return { banners: MOCK_BANNERS, loading: false, error: null };
// }

// export function useBlogPosts(): {
//   posts: AdminBlogPost[];
//   loading: boolean;
//   error: string | null;
// } {
//   return { posts: MOCK_BLOG_POSTS, loading: false, error: null };
// }

// export function useCoupons(): {
//   coupons: AdminCoupon[];
//   loading: boolean;
//   error: string | null;
// } {
//   return { coupons: MOCK_COUPONS, loading: false, error: null };
// }

// export function useProductById(id: string): {
//   product: AdminProduct | null;
//   loading: boolean;
//   error: string | null;
// } {
//   const product = MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
//   return { product, loading: false, error: null };
// }

// export function useBlogPostById(id: string): {
//   post: AdminBlogPost | null;
//   loading: boolean;
//   error: string | null;
// } {
//   const post =
//     MOCK_BLOG_POSTS.find((p) => p.id === id || p.slug === id) ?? null;
//   return { post, loading: false, error: null };
// }


// Firebase ENABLED version — real data from Firestore




// Firebase ENABLED version — real data from Firestore

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

import type {
  AdminBanner,
  AdminBlogPost,
  AdminCategory,
  AdminCoupon,
  AdminLabSetup,
  AdminProduct,
} from "@/types/admin";

// ─── Hooks (NOW FIREBASE ENABLED) ─────────────────────────────────────────────

type StoreState<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
};

function createCollectionStore<T>(collectionName: string) {
  const store = {
    data: [] as T[],
    loading: true,
    error: null as string | null,
    initialized: false,
    inflight: false,
    listeners: new Set<(state: StoreState<T>) => void>(),
  };

  const notify = () => {
    const state = {
      data: store.data,
      loading: store.loading,
      error: store.error,
    };
    store.listeners.forEach((listener) => listener(state));
  };

  const load = async () => {
    if (store.inflight) return;
    store.inflight = true;
    store.loading = true;
    notify();
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      store.data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      store.error = null;
      store.initialized = true;
    } catch {
      store.error = "Failed to load data";
    } finally {
      store.loading = false;
      store.inflight = false;
      notify();
    }
  };

  const useCollection = (): StoreState<T> => {
    const [state, setState] = useState<StoreState<T>>({
      data: store.data,
      loading: !store.initialized,
      error: store.error,
    });

    useEffect(() => {
      store.listeners.add(setState);
      if (!store.initialized) {
        void load();
      }
      return () => {
        store.listeners.delete(setState);
      };
    }, []);

    return state;
  };

  return { useCollection };
}

const productsStore = createCollectionStore<AdminProduct>("products");
const categoriesStore = createCollectionStore<AdminCategory>("categories");
const labSetupsStore = createCollectionStore<AdminLabSetup>("labSetups");
const bannersStore = createCollectionStore<AdminBanner>("banners");
const blogsStore = createCollectionStore<AdminBlogPost>("blogs");
const couponsStore = createCollectionStore<AdminCoupon>("coupons");

// PRODUCTS
export function useProducts(): {
  products: AdminProduct[];
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } = productsStore.useCollection();
  return { products: data, loading, error };
}

// PRODUCTS BY CATEGORY
export function useProductsByCategory(categoryId: string | null) {
  const { products, loading } = useProducts();

  const filtered = categoryId
    ? products.filter((p) =>
        Array.isArray(p.categoryIds)
          ? p.categoryIds.includes(categoryId)
          : p.categoryId === categoryId
      )
    : products;

  return { products: filtered, loading, error: null };
}

// CATEGORIES
export function useCategories(): {
  categories: AdminCategory[];
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } = categoriesStore.useCollection();
  return { categories: data, loading, error };
}

// LAB SETUPS
export function useLabSetups(): {
  labSetups: AdminLabSetup[];
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } = labSetupsStore.useCollection();
  return { labSetups: data, loading, error };
}
// BANNERS
export function useBanners(): {
  banners: AdminBanner[];
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } = bannersStore.useCollection();
  return { banners: data, loading, error };
}

// BLOG POSTS
export function useBlogPosts(): {
  posts: AdminBlogPost[];
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } = blogsStore.useCollection();
  return { posts: data, loading, error };
}

// COUPONS
export function useCoupons(): {
  coupons: AdminCoupon[];
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } = couponsStore.useCollection();
  return { coupons: data, loading, error };
}

// SINGLE PRODUCT
export function useProductById(id: string) {
  const { products } = useProducts();
  const product = products.find((p) => p.id === id) ?? null;

  return { product, loading: false, error: null };
}

// SINGLE BLOG
export function useBlogPostById(id: string) {
  const { posts } = useBlogPosts();
  const post =
    posts.find((p) => p.id === id || p.slug === id) ?? null;

  return { post, loading: false, error: null };
}