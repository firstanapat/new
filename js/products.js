/* ==========================================================================
   Web Products — แก้ไขรายการการ์ดใน 3D carousel ที่ไฟล์นี้ไฟล์เดียว
   --------------------------------------------------------------------------
   title   : ชื่อ (ใช้ทั้งสองภาษา)
   kicker  : ข้อความเล็กเหนือชื่อการ์ด
   desc / features : ภาษาไทย  ·  en.desc / en.features : ภาษาอังกฤษ
   image   : URL รูปหน้าจอ (เช่น "assets/img/cfo-collector.jpg") — ถ้าเว้นว่าง จะวาดภาพตัวอย่างให้
   url     : ลิงก์เว็บจริง — ถ้าเว้นว่าง จะไม่แสดงปุ่ม "เปิดเว็บ"
   sample  : true = ยังเป็นการ์ดตัวอย่าง (แสดงป้าย "ตัวอย่าง")
   layout  : รูปแบบภาพตัวอย่าง: "dashboard" | "upload" | "form" | "table" | "site"
   ⚠️ รูปหน้าจอและลิงก์ต้องไม่มีข้อมูลจริงของนายจ้าง
   ========================================================================== */
window.PRODUCTS = [
  {
    title: "CFO Data Collector",
    kicker: "Web App / Google Apps Script",
    desc: "เว็บแอปให้แต่ละหน่วยงานอัปโหลดไฟล์ Excel บัญชีก๊าซเรือนกระจก แล้วดึงข้อมูลเข้าฐานข้อมูลกลางและสรุปเป็น Dashboard อัตโนมัติ",
    features: [
      "อัปโหลดไฟล์ .xlsx หลายหน่วยงานผ่านหน้าเว็บเดียว",
      "อ่านชีต Fr-04.1 / Fr-05 และแยก Scope 1, 2, 3 อัตโนมัติ",
      "เก็บข้อมูลลง Google Sheets เป็นฐานข้อมูลกลาง",
      "สรุปผลรวมและเทียบปีฐานบน Dashboard"
    ],
    en: {
      desc: "A web app where each site uploads its GHG inventory Excel file. It pulls the data into one central database and builds the dashboard automatically.",
      features: [
        "Upload .xlsx files from several sites through one page",
        "Reads the Fr-04.1 / Fr-05 sheets and splits Scope 1, 2 and 3 automatically",
        "Stores everything in Google Sheets as the central database",
        "Dashboard shows totals and the change against the base year"
      ]
    },
    tags: ["Google Apps Script", "HTML", "Google Sheets"],
    image: "",
    url: "",
    sample: false,
    layout: "upload",
    accent: "#12a05c",
    tint: "#e3f4ea"
  },
  {
    title: "Farm EF Survey",
    kicker: "Web Form / Field Data",
    desc: "แบบฟอร์มเก็บข้อมูล Life Cycle Inventory ระดับแปลงบนมือถือ พร้อมตรวจความสมเหตุสมผลของข้อมูลทันทีที่กรอก",
    features: [
      "กรอกได้ออฟไลน์ในพื้นที่สัญญาณอ่อน",
      "เตือนเมื่อปริมาณปุ๋ยต่อผลผลิตผิดปกติ",
      "คำนวณ EF รายแปลงเบื้องต้นให้เห็นทันที"
    ],
    en: {
      desc: "A mobile form for collecting farm-level Life Cycle Inventory data that checks each answer for plausibility as it is entered.",
      features: [
        "Works offline in areas with weak signal",
        "Warns when fertiliser use per kg of yield looks unusual",
        "Shows a first estimate of the plot's EF straight away"
      ]
    },
    tags: ["Web Form", "Mobile", "Data Validation"],
    image: "",
    url: "",
    sample: true,
    layout: "form",
    accent: "#1aae39",
    tint: "#d9f3e1"
  },
  {
    title: "SROI Calculator",
    kicker: "Tool / Social Impact",
    desc: "เครื่องมือคำนวณ SROI ที่ใส่ Indicator, Financial Proxy, Deadweight และ Attribution แล้วได้ผลพร้อม Sensitivity analysis",
    features: [
      "เทมเพลต Impact Map ตามหลัก Social Value",
      "ปรับค่าสมมติฐานแล้วเห็น SROI เปลี่ยนแบบเรียลไทม์",
      "ส่งออกตารางสรุปสำหรับรายงาน"
    ],
    en: {
      desc: "An SROI calculator: enter indicators, financial proxies, deadweight and attribution, and get the ratio with a sensitivity analysis.",
      features: [
        "Impact Map template based on Social Value principles",
        "Change an assumption and see the SROI update live",
        "Export a summary table for the report"
      ]
    },
    tags: ["JavaScript", "Calculator"],
    image: "",
    url: "",
    sample: true,
    layout: "table",
    accent: "#dd5b00",
    tint: "#ffe8d4"
  },
  {
    title: "ESG KPI Dashboard",
    kicker: "Dashboard / ESG Reporting",
    desc: "Dashboard ติดตามตัวชี้วัด ESG รายเดือน — พลังงาน น้ำ ของเสีย และกิจกรรมชุมชน — สำหรับรายงานผู้บริหาร",
    features: [
      "การ์ด KPI พร้อมเทียบเป้าหมายรายปี",
      "กราฟแนวโน้มรายเดือนแยกหน่วยงาน",
      "ตัวกรองตามปีและหน่วยงาน"
    ],
    en: {
      desc: "A monthly ESG KPI dashboard covering energy, water, waste and community activities, built for management reporting.",
      features: [
        "KPI cards compared against the yearly target",
        "Monthly trend charts by site",
        "Filters by year and by site"
      ]
    },
    tags: ["Dashboard", "Chart.js"],
    image: "",
    url: "",
    sample: true,
    layout: "dashboard",
    accent: "#0075de",
    tint: "#dcecfa"
  },
  {
    title: "Supplier GHG Portal",
    kicker: "Portal / Scope 3",
    desc: "พอร์ทัลให้ซัพพลายเออร์ส่งข้อมูลการปล่อยก๊าซเรือนกระจกของตนเอง เพื่อนำไปใช้คำนวณ Scope 3 ของบริษัท",
    features: [
      "ซัพพลายเออร์ล็อกอินและส่งข้อมูลรายปี",
      "ตรวจความครบถ้วนของข้อมูลก่อนส่ง",
      "สรุปอัตราการตอบกลับและคุณภาพข้อมูล"
    ],
    en: {
      desc: "A portal where suppliers submit their own emissions data, which then feeds the company's Scope 3 calculation.",
      features: [
        "Suppliers sign in and submit data once a year",
        "Checks that the data is complete before it is sent",
        "Summarises response rate and data quality"
      ]
    },
    tags: ["Portal", "Scope 3"],
    image: "",
    url: "",
    sample: true,
    layout: "table",
    accent: "#c2417f",
    tint: "#fde0ec"
  },
  {
    title: "Portfolio Website",
    kicker: "Website / HTML · CSS · JS",
    desc: "เว็บไซต์นี้ — HTML, CSS และ JavaScript ล้วน มี 3D carousel ที่เขียนเอง กราฟ Chart.js สลับไทย/อังกฤษได้ และ deploy อัตโนมัติด้วย Vercel",
    features: [
      "3D carousel เขียนเอง รองรับลาก ปัด และคีย์บอร์ด",
      "สลับภาษาไทย/อังกฤษได้ทั้งเว็บ",
      "Push ขึ้น GitHub แล้ว Vercel deploy ให้อัตโนมัติ"
    ],
    en: {
      desc: "This site: plain HTML, CSS and JavaScript, with a hand-built 3D carousel, Chart.js charts, a Thai/English switch and automatic deploys on Vercel.",
      features: [
        "Hand-built 3D carousel with drag, swipe and keyboard support",
        "The whole site switches between Thai and English",
        "Push to GitHub and Vercel deploys it automatically"
      ]
    },
    tags: ["HTML", "CSS", "JavaScript", "Vercel"],
    image: "",
    url: "",
    sample: false,
    layout: "site",
    accent: "#1f2124",
    tint: "#f1f1ef"
  }
];
