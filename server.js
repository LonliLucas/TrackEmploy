// server file for testing get routes
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

// Read all Roles
app.get("/api/roles", (req, res) => {
  const sql = `SELECT id, department_id, title, salary FROM roles`;

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

// Read all employees
app.get("/api/employees", (req, res) => {
  const sql = `SELECT id, role_id, first_name, last_name, manager_id FROM employees`;

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

// Response for any other request
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
