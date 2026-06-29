import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { calculateGrade, Student, Marks, Result } from "./src/types.ts";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

app.use(express.json());

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ students: [], marks: {} }));
}

function getDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Admin Login (Mock)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    res.json({ success: true, token: "fake-jwt-token" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Student Management
app.get("/api/students", (req, res) => {
  const db = getDB();
  res.json(db.students);
});

app.post("/api/students", (req, res) => {
  const db = getDB();
  const newStudent: Student = {
    id: Date.now().toString(),
    ...req.body
  };
  db.students.push(newStudent);
  saveDB(db);
  res.json(newStudent);
});

app.put("/api/students/:id", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const index = db.students.findIndex((s: Student) => s.id === id);
  if (index !== -1) {
    db.students[index] = { ...db.students[index], ...req.body };
    saveDB(db);
    res.json(db.students[index]);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
});

app.delete("/api/students/:id", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  
  const studentExists = db.students.some((s: Student) => s.id === id);
  if (!studentExists) {
    return res.status(404).json({ message: "Student not found" });
  }

  db.students = db.students.filter((s: Student) => s.id !== id);
  if (db.marks && db.marks[id]) {
    delete db.marks[id];
  }
  
  saveDB(db);
  res.json({ success: true });
});

// Marks Management
app.post("/api/marks/:studentId", (req, res) => {
  const db = getDB();
  const { studentId } = req.params;
  const marks: Marks = req.body;
  
  db.marks[studentId] = marks;
  saveDB(db);
  res.json({ success: true });
});

// Results
app.get("/api/results", (req, res) => {
  const db = getDB();
  const results: Result[] = db.students.map((s: Student) => {
    const marks = db.marks[s.id] || { math: 0, science: 0, english: 0, history: 0, computer: 0 };
    const { gpa, grade } = calculateGrade(marks);
    return { ...s, marks, gpa, grade };
  });
  res.json(results);
});

// Summary for Dashboard
app.get("/api/dashboard", (req, res) => {
  const db = getDB();
  const totalStudents = db.students.length;
  const results = db.students.map((s: Student) => {
    const marks = db.marks[s.id] || { math: 0, science: 0, english: 0, history: 0, computer: 0 };
    return calculateGrade(marks);
  });
  
  const passed = results.filter(r => r.grade !== "F").length;
  const averageGPA = results.length > 0 
    ? (results.reduce((sum, r) => sum + r.gpa, 0) / results.length).toFixed(2)
    : 0;

  res.json({
    totalStudents,
    passed,
    failed: totalStudents - passed,
    averageGPA
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
