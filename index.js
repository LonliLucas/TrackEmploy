const mysql = require("mysql2");
const inquirer = require("inquirer");
const ascii = require("ascii-art");
const { table } = require("table");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  // Add mysql password below
  password: "B1nkl3",
  database: "employees_db",
});

function viewDepartments() {
  db.query(
    {
      sql: `SELECT department_name FROM departments`,
      rowsAsArray: true,
    },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        results.unshift(["Departments"]);
        console.log(table(results));
        menu();
      }
    }
  );
}

function viewRoles() {
  db.query(
    {
      sql: `SELECT title, salary FROM roles`,
      rowsAsArray: true,
    },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        results.unshift(["Role", "Salary"]);
        console.log(table(results));
        menu();
      }
    }
  );
}

function viewEmployees() {
  db.query(
    {
      sql: `SELECT first_name, last_name FROM employees`,
      rowsAsArray: true,
    },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        results.unshift(["First Name", "Last Name"]);
        console.log(table(results));
        menu();
      }
    }
  );
}

function addDepartment() {
  db.query({ sql: `` });
}

function addRole() {
  db.query({ sql: `` });
}

function addEmployee() {
  db.query({ sql: `` });
}

async function menuTitle() {
  const title = "TrackEmploy";

  return new Promise((resolve, reject) => {
  ascii.font(title, "doom", (err, rendered) => {
    if (err) {
      console.error(err);
      reject();
    }
    else {
      console.log(rendered);
      resolve();
    }
  })
})
}

async function menu() {
  await menuTitle();
  try {
    const options = await inquirer.prompt([{
      type: "list",
      name: "menu",
      message: "Pick an option from this list!",
      choices: [
        "View Departments",
        "View Roles",
        "View Employees",
        "Add a new Department",
        "Add a new Role",
        "Add a new Employee",
        "X"
      ],
    },
  ]);

  switch (options.menu) {
    case "View Departments": viewDepartments(); break;
    case "View Roles": viewRoles(); break;
    case "View Employees": viewEmployees(); break;
    case "Add a new Department": addDepartment(); break;
    case "Add a new Role": addRole(); break;
    case "Add a new Employee": addEmployee(); break;
    case "X": db.end(); console.log("Thank you"); break;
  }

  } catch (err) {
    console.error(err);
  }
}

menu();
