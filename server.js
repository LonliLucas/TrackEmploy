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

