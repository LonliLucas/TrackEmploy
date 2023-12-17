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
      sql: `SELECT department_name, id FROM departments`,
      rowsAsArray: true,
    },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        results.unshift(["Departments", "Dept ID"]);
        console.log(table(results));
        menu();
      }
    }
  );
}

function viewRoles() {
  db.query(
    {
      sql: `SELECT r.title, r.id, r.salary, dep.department_name FROM roles r
      LEFT JOIN departments dep ON dep.id = r.department_id`,
      rowsAsArray: true,
    },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        results.unshift(["Role", "Role ID", "Salary", "Department"]);
        console.log(table(results));
        menu();
      }
    }
  );
}

function viewEmployees() {
  db.query(
    {
      sql: `SELECT emp.id, CONCAT(emp.first_name, ' ', emp.last_name) AS employee_name, r.title, dep.department_name, r.salary, CONCAT (man.first_name, ' ', man.last_name)
      FROM employees emp
      LEFT JOIN roles r ON r.id = emp.role_id
      LEFT JOIN departments dep ON dep.id = r.department_id
      LEFT JOIN employees man ON man.id = emp.manager_id`,
      rowsAsArray: true,
    },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        results.unshift([
          "ID",
          "Full Name",
          "Title",
          "Department",
          "Salary",
          "Reports To",
        ]);
        console.log(table(results));
        menu();
      }
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "What is the name of the new Department?:",
      }
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO departments SET ?",
        { department_name: answers.newDepartment },
        (err) => {
          if (err) {
            console.error(err);
          }
          
          console.log("Added new department.")
          menu();
        }
      );
    });
}

function addRole() {
  db.query({ sql: `` });
}

function addEmployee() {
  db.query({ sql: `` });
}

function updateEmployee() {
  db.query({ sql: `` });
}

async function menuTitle() {
  const title = "TrackEmploy";

  return new Promise((resolve, reject) => {
    ascii.font(title, "doom", (err, rendered) => {
      if (err) {
        console.error(err);
        reject();
      } else {
        console.log(rendered);
        resolve();
      }
    });
  });
}

async function menu() {
  const options = await inquirer.prompt([
    {
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
        "Update an Employee",
        "X",
      ],
    },
  ]);

  switch (options.menu) {
    case "View Departments":
      viewDepartments();
      break;
    case "View Roles":
      viewRoles();
      break;
    case "View Employees":
      viewEmployees();
      break;
    case "Add a new Department":
      addDepartment();
      break;
    case "Add a new Role":
      addRole();
      break;
    case "Add a new Employee":
      addEmployee();
      break;
    case "Update an Employee":
      updateEmployee();
      break;
    case "X":
      db.end();
      console.log("Closing Trackemploy...");
      break;
  }
}

async function application() {
  await menuTitle();
  try {
    menu();
  } catch (err) {
    console.error(err);
  }
}

application();
