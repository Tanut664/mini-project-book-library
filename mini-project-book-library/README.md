# Mini Project #2 — Book Library

เว็บแอปพลิเคชันจัดการข้อมูลหนังสือ (Book Library) สำหรับงาน **Selected Topics in Electronics and Computer Engineering**

## 1. แนวคิดของ Resource
เลือก Resource: **Books (หนังสือ)**

ระบบรองรับการจัดการข้อมูลหนังสือแบบ CRUD ได้แก่
- Create: เพิ่มหนังสือ
- Read: แสดง/ค้นหาข้อมูลหนังสือ
- Update: แก้ไขข้อมูลหนังสือ
- Delete: ลบข้อมูลหนังสือ

## 2. เทคโนโลยีที่ใช้
- Frontend: HTML, CSS, JavaScript (Vanilla JS)
- Backend: Node.js + Express.js
- Database: SQLite ผ่าน `better-sqlite3`
- API: REST API แบบ JSON

## 3. โครงสร้างโปรเจกต์
```text
mini-project-book-library/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server/
│   ├── server.js
│   ├── db.js
│   └── data/              # สร้างอัตโนมัติหลังรันครั้งแรก
│       └── library.db
├── screenshots/
├── package.json
└── README.md
```

## 4. วิธีติดตั้ง
ต้องติดตั้ง Node.js ก่อน จากนั้นเปิด Terminal/PowerShell ในโฟลเดอร์โปรเจกต์ แล้วใช้คำสั่ง:

```bash
npm install
```

## 5. วิธีรัน
```bash
npm start
```

เมื่อเห็นข้อความประมาณนี้ แสดงว่าเซิร์ฟเวอร์ทำงานแล้ว:

```text
Book Library running at http://localhost:3000
Database: SQLite (server/data/library.db)
```

จากนั้นเปิดเบราว์เซอร์ที่ `http://localhost:3000`

## 6. REST API Endpoints
| Method | Endpoint | รายละเอียด |
|---|---|---|
| GET | `/api/books` | ดึงข้อมูลหนังสือทั้งหมด/ค้นหา |
| GET | `/api/categories` | ดึงรายการหมวดหมู่ |
| POST | `/api/books` | เพิ่มหนังสือ |
| PUT | `/api/books/:id` | แก้ไขหนังสือ |
| DELETE | `/api/books/:id` | ลบหนังสือ |
| GET | `/api/health` | ตรวจสอบสถานะ API และฐานข้อมูล |

## 7. ตัวอย่างข้อมูลที่ระบบเตรียมไว้
เมื่อเปิดใช้งานครั้งแรก ระบบจะสร้างฐานข้อมูล SQLite และเพิ่มข้อมูลตัวอย่าง 4 รายการ เช่น Clean Code, The Pragmatic Programmer และ Introduction to Algorithms เพื่อให้สามารถทดสอบได้ทันที

## 8. การทดสอบ CRUD
1. กด **+ เพิ่มหนังสือ** แล้วกรอกข้อมูล จากนั้นกดบันทึก → Create
2. ข้อมูลที่บันทึกจะแสดงในตาราง → Read
3. กด **แก้ไข** เพื่อเปลี่ยนข้อมูล → Update
4. กด **ลบ** เพื่อลบข้อมูล → Delete
5. ใช้ช่องค้นหาและตัวกรองหมวดหมู่/สถานะเพื่อทดสอบการอ่านข้อมูลแบบมีเงื่อนไข

## 9. หลักฐานการติดตั้งและการรัน
ไฟล์ตัวอย่างสำหรับประกอบ README อยู่ในโฟลเดอร์ `screenshots/`

- `01-install.png` — หลักฐานขั้นตอนติดตั้ง dependencies
- `02-run.png` — หลักฐานเซิร์ฟเวอร์ทำงานและหน้าเว็บ
- `03-crud.png` — หลักฐานการทำงานของ CRUD

> หากนำไปส่งจริง แนะนำให้เปิดโปรเจกต์บนเครื่องของนักศึกษา แล้วถ่ายภาพหน้าจอ Terminal และ Browser จริงทับไฟล์ตัวอย่างเหล่านี้ เพื่อเป็นหลักฐานจากเครื่องของตนเอง
