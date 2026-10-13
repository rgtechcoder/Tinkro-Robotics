const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const headers = [
  "sku", "name", "category", "categoryId", "categoryIds", "price", "description", "overview", "subCategory", "brand",
  "metaTitle", "metaDescription", "focusKeyword", "keywords", "seoSlug", "canonicalUrl", "openGraphTitle", "openGraphDescription",
  "twitterTitle", "twitterDescription", "features", "specifications", "compatibility", "applications", "packageContents",
  "kitContents", "useCases", "reviewsArray", "demoVideoUrl", "faq", "tags", "skillLevel", "stock", "originalPrice", "discount",
  "availability", "currency", "imageAltText", "gtin", "mpn", "warranty", "material", "weight", "dimensions", "countryOfOrigin",
  "manufacturer", "difficulty", "images", "gallery", "downloads", "documents", "certifications"
];

const rows = [
  headers,
  [
    "DEMO-DELETE-001", "DEMO - Arduino UNO R3 Board", "Microcontrollers & Development Boards", "", "", 299,
    "DEMO ROW - Delete or replace this row before real import. Beginner-friendly Arduino UNO board for robotics and electronics projects.",
    "A practical Arduino UNO development board for learning electronics, programming, and building hands-on robotics projects.",
    "Development Boards", "Tinkro", "Arduino UNO R3 Board | Tinkro", "Buy Arduino UNO R3 development board for robotics, STEM, and electronics projects from Tinkro.",
    "arduino uno r3 board", "arduino, uno, microcontroller, robotics, stem", "demo-arduino-uno-r3-board", "", "Arduino UNO R3 Board for Robotics | Tinkro",
    "Beginner-friendly Arduino board for electronics, coding, and STEM projects.", "Arduino UNO R3 Board | Tinkro", "Build robotics projects with this Arduino-compatible development board.",
    "ATmega328P microcontroller | 14 digital I/O pins | 6 analog inputs | USB programming | Arduino IDE compatible",
    "Microcontroller: ATmega328P\nOperating Voltage: 5V\nInput Voltage: 7-12V\nDigital I/O Pins: 14\nAnalog Input Pins: 6\nFlash Memory: 32 KB\nInterface: USB",
    "Arduino IDE | Arduino sensors | Servo motors | Motor drivers | ESP8266 modules", "Robotics projects | Home automation | Sensor experiments | STEM classroom projects", "Arduino UNO board x 1 | USB cable x 1",
    "", "Beginner electronics | Robotics prototyping | Arduino learning", "[{\"name\":\"Demo Reviewer\",\"rating\":5,\"content\":\"Demo review - replace this row content with a real verified review.\"}]",
    "", "What is this Arduino UNO board?: A beginner-friendly development board for electronics and robotics projects.|Is it compatible with Arduino IDE?: Yes, it is designed for Arduino IDE projects.",
    "arduino, uno, robotics, beginner", "Beginner", 25, 349, 14, "available", "INR", "Arduino UNO R3 development board for Tinkro robotics projects", "", "", "Standard warranty as per Tinkro policy", "PCB", "", "", "Tinkro", "Beginner",
    "https://tinkro.in/assets/brand/logo.png", "", "", "", "Arduino"
  ],
  [
    "DEMO-DELETE-002", "DEMO - 0.96 inch OLED Display SSD1306", "Displays & Indicators", "", "", 179,
    "DEMO ROW - Delete or replace this row before real import. Compact I2C OLED display for Arduino, ESP32, and Raspberry Pi projects.",
    "A crisp 0.96-inch 128x64 OLED display using the SSD1306 driver over I2C, ideal for showing sensor readings and project status.",
    "OLED Displays", "Tinkro", "0.96 inch OLED Display SSD1306 | Tinkro", "Shop a 0.96 inch I2C OLED display for Arduino and ESP32 projects from Tinkro.",
    "0.96 inch oled display", "oled, ssd1306, i2c, arduino display, esp32", "demo-096-inch-oled-display-ssd1306", "", "0.96 inch I2C OLED Display for Arduino | Tinkro",
    "Compact high-contrast OLED display with simple two-wire I2C communication.", "0.96 inch OLED Display SSD1306 | Tinkro", "Display sensor data and project status in your next electronics build.",
    "128x64 resolution | SSD1306 driver | I2C two-wire interface | High contrast OLED | Low power consumption",
    "Display Size: 0.96 inch\nResolution: 128x64\nDriver: SSD1306\nInterface: I2C\nOperating Voltage: 3.3-5V",
    "Arduino UNO | Arduino Nano | ESP32 | Raspberry Pi", "Sensor data display | IoT dashboards | Robotics status screens | Portable electronics", "OLED display module x 1",
    "", "Sensor dashboards | Robotics interfaces | IoT prototypes", "", "", "What is this OLED display used for?: It displays text, icons, and graphics in electronics and robotics projects.|Which boards work with it?: It works with Arduino, ESP32, and Raspberry Pi boards.",
    "oled, display, ssd1306, i2c", "Beginner", 40, 399, 55, "available", "INR", "0.96 inch I2C OLED SSD1306 display module", "", "", "Standard warranty as per Tinkro policy", "PCB", "", "", "Tinkro", "Beginner",
    "https://tinkro.in/assets/brand/logo.png", "", "", "", ""
  ]
];

const instructions = [
  ["Tinkro Bulk Product Import Template", "Version 1.0"],
  ["Before upload", "Delete the two DEMO-DELETE rows or replace every demo value with real product data."],
  ["Safe workflow", "Admin Panel > Bulk Product Import > upload this file > review mapping > Run Dry Run > fix errors/warnings > Import Products."],
  ["Required fields", "sku, name, and a valid category/categoryId are required or strongly recommended. Category names are matched to existing Admin categories."],
  ["List fields", "Use |, comma, semicolon, or a new line between values. Example: Arduino UNO | ESP32 | Raspberry Pi"],
  ["Specifications", "Use one Key: Value pair per line. Example: Operating Voltage: 5V"],
  ["FAQs", "Use Question: Answer pairs separated by |. Do not use | inside an answer."],
  ["Reviews", "Use JSON: [{\"name\":\"Asha\",\"rating\":5,\"content\":\"Great product\"}] or Name|5|Review text per line."],
  ["Images", "Use publicly accessible image URLs separated by |. The first URL becomes the main product image. Prefer compressed WebP/JPG URLs."],
  ["SEO", "Fill metaTitle, metaDescription, focusKeyword, keywords, and seoSlug for best search visibility. Missing SEO values can be generated by the importer."],
  ["Update safety", "SKU is the safest identifier for updating an existing product. Use Dry Run before every real import."],
  ["Important", "Do not invent technical specifications, ratings, reviews, warranty claims, or certifications. Enter only verified product information."],
];

const guide = [
  ["Field", "Product page area", "Format", "Example"],
  ["description", "Hero summary", "Plain text", "Compact 5V sensor module for Arduino projects."],
  ["overview", "Product Overview", "Plain text", "A practical module for learning and prototyping."],
  ["features", "Key Features", "List with |", "5V operation | Beginner friendly | USB programming"],
  ["specifications", "Technical Specifications", "Key: Value per line", "Voltage: 5V\nInterface: I2C"],
  ["compatibility", "Works With", "List with |", "Arduino UNO | ESP32 | Raspberry Pi"],
  ["applications", "What can you build?", "List with |", "IoT dashboard | Robotics project"],
  ["packageContents", "What's in the box", "List with |", "Module x 1 | Cable x 1"],
  ["kitContents", "Kit contents", "List with |", "Controller x 1 | Sensor x 2"],
  ["useCases", "Use Cases", "List with |", "Classroom learning | Rapid prototyping"],
  ["reviewsArray", "Reviews", "JSON or Name|Rating|Text", "[{\"name\":\"Ravi\",\"rating\":5,\"content\":\"Useful\"}]"],
  ["demoVideoUrl", "Product Demo", "YouTube URL", "https://www.youtube.com/watch?v=VIDEO_ID"],
  ["faq", "FAQs + FAQ schema", "Question: Answer | ...", "Is it beginner friendly?: Yes"],
  ["images", "Product gallery", "Public URLs with |", "https://example.com/product.webp"],
];

const workbook = XLSX.utils.book_new();
const productSheet = XLSX.utils.aoa_to_sheet(rows);
productSheet["!cols"] = headers.map((header) => ({ wch: Math.min(32, Math.max(12, header.length + 2)) }));
XLSX.utils.book_append_sheet(workbook, productSheet, "Products");
XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(instructions), "Instructions");
XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(guide), "Field Guide");

const output = path.resolve(__dirname, "..", "Tinkro_Product_Bulk_Import_Demo.xlsx");
XLSX.writeFile(workbook, output);
console.log(output);
