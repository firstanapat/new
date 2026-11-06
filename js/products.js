/* ==========================================================================
   Web Products — แก้ไขรายการการ์ดใน 3D carousel ที่ไฟล์นี้ไฟล์เดียว
   --------------------------------------------------------------------------
   image   : URL รูปหน้าจอ (เช่น "assets/img/cfo-collector.jpg") — ถ้าเว้นว่าง จะวาดภาพตัวอย่างให้
   url     : ลิงก์เว็บจริง — ถ้าเว้นว่าง จะไม่แสดงปุ่ม "เปิดเว็บ"
   sample  : true = ยังเป็นการ์ดตัวอย่าง (แสดงป้าย "ตัวอย่าง")
   kicker  : ข้อความเล็กเหนือชื่อการ์ด
   layout  : รูปแบบภาพตัวอย่าง: "dashboard" | "upload" | "form" | "table" | "site"
   ⚠️ รูปหน้าจอต้องไม่มีข้อมูลจริงของนายจ้าง
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
    tags: ["Google Apps Script", "HTML", "Google Sheets"],
    image: "",
    url: "",
    sample: false,
    layout: "upload",
    accent: "#5645d4",
    tint: "#e6e0f5"
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
    tags: ["Portal", "Scope 3"],
    image: "",
    url: "",
    sample: true,
    layout: "table",
    accent: "#ff64c8",
    tint: "#fde0ec"
  },
  {
    title: "Portfolio Website",
    kicker: "Website / HTML · CSS · JS",
    desc: "เว็บไซต์นี้ — HTML, CSS และ JavaScript ล้วน มี 3D carousel ที่เขียนเอง กราฟ Chart.js และ deploy อัตโนมัติด้วย Vercel",
    features: [
      "3D carousel ด้วย CSS 3D transforms รองรับลาก ปัด และคีย์บอร์ด",
      "รองรับมือถือและผู้ใช้ที่ตั้งค่าลดการเคลื่อนไหว",
      "Push ขึ้น GitHub แล้ว Vercel deploy ให้อัตโนมัติ"
    ],
    tags: ["HTML", "CSS", "JavaScript", "Vercel"],
    image: "",
    url: "",
    sample: false,
    layout: "site",
    accent: "#0a1530",
    tint: "#f8f5e8"
  }
];
