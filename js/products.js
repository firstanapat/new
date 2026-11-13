/* ==========================================================================
   Tools I built — แก้ไขรายการการ์ดใน 3D carousel ที่ไฟล์นี้ไฟล์เดียว
   --------------------------------------------------------------------------
   title   : ชื่อ (ใช้ทั้งสองภาษา)
   kicker  : ข้อความเล็กเหนือชื่อการ์ด
   desc / features : ภาษาไทย  ·  en.desc / en.features : ภาษาอังกฤษ
   image   : URL รูปหน้าจอ (เช่น "assets/img/cfo-dashboard.jpg") — ถ้าเว้นว่าง จะวาดภาพตัวอย่างให้
   url     : ลิงก์เว็บจริง — ถ้าเว้นว่าง จะไม่แสดงปุ่ม "เปิดเว็บ"
   wip     : true = กำลังพัฒนา (แสดงป้าย "กำลังพัฒนา")
   layout  : รูปแบบภาพตัวอย่าง: "dashboard" | "upload" | "form" | "table" | "site"
   ⚠️ ทุกการ์ดต้องเป็นงานที่สร้างเองจริง และรูป/ลิงก์ต้องไม่มีข้อมูลจริงของนายจ้าง
   ========================================================================== */
window.PRODUCTS = [
  {
    title: "CFO Dashboard",
    kicker: "Google Apps Script / Google Sheets",
    desc: "รวมไฟล์คาร์บอนฟุตพริ้นท์องค์กรตามแบบฟอร์ม TGO ของทุกหน่วยงานไว้ในที่เดียว แล้วแสดงเป็น Dashboard บนเว็บ แทนการเปิดไฟล์ Excel ทีละไฟล์",
    features: [
      "นำเข้าไฟล์ .xlsx ผ่านเมนูใน Google Sheets หรือ Import อัตโนมัติทุกเช้าจากโฟลเดอร์ใน Google Drive",
      "อ่านชีต Fr-04.1 และ Fr-05 อัตโนมัติ แล้วแยกตาม Scope 1, 2 และ 3",
      "แตก tCO₂e เป็นรายเดือนตามสัดส่วนกิจกรรม โดยผลรวมตรงกับ Fr-04.1 เสมอ",
      "Dashboard เลือกหน่วยงานและปี เทียบปีฐาน แสดง 10 รายการที่ปล่อยมากที่สุด และค้นหารายการได้"
    ],
    en: {
      desc: "Brings every site's corporate carbon footprint file (TGO forms) into one place and shows it as a web dashboard, instead of opening Excel files one by one.",
      features: [
        "Import .xlsx files from a Google Sheets menu, or automatically every morning from a Google Drive folder",
        "Reads the Fr-04.1 and Fr-05 sheets automatically and splits them by Scope 1, 2 and 3",
        "Spreads tCO₂e across months by activity share, so the total always matches Fr-04.1",
        "Dashboard with site and year filters, base-year comparison, the top 10 sources and a searchable item table"
      ]
    },
    tags: ["Google Apps Script", "Google Sheets", "Chart.js"],
    image: "",
    url: "",
    layout: "upload",
    accent: "#12a05c",
    tint: "#e3f4ea"
  },
  {
    title: "CarbonMate TH",
    kicker: "Python / AI · Personal project",
    desc: "โปรเจกต์ส่วนตัว: เครื่องคำนวณคาร์บอนฟุตพริ้นท์องค์กรตามแนวทาง TGO ที่ตรวจสอบย้อนกลับได้ และใช้ AI ช่วยจับคู่กิจกรรมกับค่า EF ทดสอบกับบริษัทสมมติ \"Northern Valley Foods\" ซึ่งเป็นข้อมูลจำลองทั้งหมด",
    features: [
      "Engine คำนวณจากตาราง EF ของ TGO (AR5) ที่ระบุแหล่งที่มาและเวอร์ชันทุกค่า ตรวจเทียบกับการคำนวณมือแล้ว ต่างกันไม่เกิน 0.0015%",
      "ปฏิเสธข้อมูลผิดอัตโนมัติ: Scope ไม่ตรง หน่วยไม่ตรง รหัส EF ที่ไม่มีอยู่ หรือปริมาณติดลบ",
      "กำลังพัฒนา: AI จับคู่ข้อความภาษาไทยกับค่า EF โดยเลือกได้เฉพาะจากตาราง ตอบได้ 3 แบบ (ตรง / ถามกลับ / ไม่พบ) พร้อมชุดทดสอบ 113 กรณี",
      "แผนต่อไป: Dashboard บน Streamlit ส่งออกแบบฟอร์ม Fr-04.1 และบันทึก Audit log"
    ],
    en: {
      desc: "Personal project: an auditable corporate carbon footprint calculator that follows Thailand's TGO guidelines, with AI help to match activities to emission factors. Tested on a fictional company, \"Northern Valley Foods\", using only synthetic data.",
      features: [
        "Calculation engine on the TGO (AR5) EF table, with source and version recorded for every value; checked against a hand calculation to within 0.0015%",
        "Rejects bad input automatically: scope mismatch, unit mismatch, unknown EF ID or negative quantity",
        "In progress: an AI matcher that maps Thai activity text to an EF, choosing only from the table and answering match / clarify / not found, with a 113-case test set",
        "Next: a Streamlit dashboard, Fr-04.1 export and an audit log"
      ]
    },
    tags: ["Python", "Claude API", "Streamlit", "pytest"],
    image: "",
    url: "",
    wip: true,
    layout: "dashboard",
    accent: "#0075de",
    tint: "#dcecfa"
  },
  {
    title: "Farm EF Workbook",
    kicker: "Excel Model / LCA",
    desc: "สมุดงาน Excel ที่แปลงคำตอบแบบสอบถามเกษตรกรเป็นค่า Emission Factor รายแปลง (kgCO₂e/kg) ใช้จริงกับข้อมูลเกษตรกร 60 ราย",
    features: [
      "แยกคำตอบแบบสอบถามจากชีต Raw Data อัตโนมัติด้วยสูตร LET, TEXTSPLIT และ INDEX",
      "ดึงค่า EF อ้างอิงจากตาราง แล้วคำนวณ Activity Data × EF × GWP",
      "คำนวณแยกตามแหล่งปล่อย เช่น ปุ๋ยเคมี ปุ๋ยคอก สารเคมีเกษตร ไฟฟ้า และน้ำมันเชื้อเพลิง",
      "การ์ดนี้ไม่แสดงตัวเลขหรือข้อมูลเกษตรกร เพราะเป็นข้อมูลของบริษัท"
    ],
    en: {
      desc: "An Excel workbook that turns farmer survey answers into a plot-level emission factor (kgCO₂e/kg). Used on real data from 60 farmers.",
      features: [
        "Parses raw survey answers automatically with LET, TEXTSPLIT and INDEX formulas",
        "Looks up reference EFs from a table and calculates Activity Data × EF × GWP",
        "Breaks emissions down by source, such as chemical fertiliser, manure, agrochemicals, electricity and fuel",
        "No numbers or farmer data are shown here, because they belong to the company"
      ]
    },
    tags: ["Excel", "LCA", "ISO 14067"],
    image: "",
    url: "",
    layout: "table",
    accent: "#dd5b00",
    tint: "#ffe8d4"
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
    layout: "site",
    accent: "#1f2124",
    tint: "#f1f1ef"
  }
];
