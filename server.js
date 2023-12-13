const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    // Add mysql password below
    password: "B1nkl3",
    database: "employees_db",
  },
  console.log("Connected to employee database")
);

// Create a new department
app.post("/api/new-department", ({ body }, res) => {
  const sql = `INSERT INTO departments (department_name) 
      VALUES (?)`;
  const params = [body.department_name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ err: err.message });
      return;
    }
    res.json({
      message: "Success",
      data: body,
    });
  });
});

// Read all departments
app.get("/api/departments", (req, res) => {
  const sql = `SELECT id, department_name FROM departments`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "Success",
      data: rows,
    });
  });
});
