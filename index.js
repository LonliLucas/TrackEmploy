const mysql = require("mysql2");
const inquirer = require("inquirer");
const ascii = require("ascii-art");
const { table } = require("table");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  // Add mysql password below
  password: "",
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
        name: "newDepartmentName",
        message: "What is the name of the new Department?:",
      },
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO departments SET ?",
        { department_name: answers.newDepartmentName },
        (err) => {
          if (err) {
            console.error(err);
          }

          console.log(`Added new department.\n`);
          menu();
        }
      );
    });
}

function addRole() {
  db.query("SELECT * FROM departments", (err, departments) => {
    if (err) {
      console.error(err);
    }
    inquirer
      .prompt([
        {
          type: "input",
          name: "newRoleName",
          message: "What is the name of the new Role?:",
        },
        {
          type: "input",
          name: "newRoleSalary",
          message: "What is the Salary for the Role?(no commas or decimal):",
        },
        {
          type: "list",
          name: "departmentList",
          message: "Which Department is the new Role for?",
          choices: departments.map((departments) => ({
            name: departments.department_name,
            value: departments.id,
          })),
        },
      ])
      .then((answers) => {
        db.query(
          "INSERT INTO roles SET ?",
          {
            title: answers.newRoleName,
            salary: answers.newRoleSalary,
            department_id: answers.departmentList,
          },
          (err) => {
            if (err) {
              console.error(err);
            }

            console.log(`Added new Role.\n`);
            menu();
          }
        );
      });
  });
}

function addEmployee() {
  db.query("SELECT * FROM roles", (err, roles) => {
    if (err) {
      console.error(err);
    }
    db.query("SELECT * FROM employees", (err, employees) => {
      if (err) {
        console.error(err);
      }
      inquirer
        .prompt([
          {
            type: "input",
            name: "newEmployeeFirstName",
            message: "What is their first name?:",
          },
          {
            type: "input",
            name: "newEmployeeLastName",
            message: "What is their last name?:",
          },
          {
            type: "list",
            name: "rolesList",
            message: "Which Role will this Employee be in?",
            choices: roles.map((roles) => ({
              name: roles.title,
              value: roles.id,
            })),
          },
          {
            type: "list",
            name: "manager",
            message: "Who will be their manager?",
            choices: employees
              .filter((employee) => {
                const selectedRole = roles.find(
                  (role) => role.id === employee.role_id
                );
                return selectedRole && selectedRole.department_id === 4;
              })
              .map((manager) => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id,
              })),
          },
        ])
        .then((answers) => {
          db.query(
            "INSERT INTO employees SET ?",
            {
              first_name: answers.newEmployeeFirstName,
              last_name: answers.newEmployeeLastName,
              role_id: answers.rolesList,
              manager_id: answers.manager,
            },
            (err) => {
              if (err) {
                console.error(err);
              }

              console.log(`Added new Employee.\n`);
              menu();
            }
          );
        });
    });
  });
}

function updateEmployee() {
  db.query("SELECT * FROM employees", (err, employees) => {
    if (err) {
      console.error(err);
    }
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeSelection",
          message: "Which employee has a new role?",
          choices: employees.map((employees) => ({
            name: `${employees.first_name} ${employees.last_name}`,
            value: employees.id,
          })),
        },
      ])
      .then((chosenEmployee) => {
        db.query("SELECT * FROM roles", (err, roles) => {
          if (err) {
            console.error(err);
          }
          inquirer.prompt([
            {
              type: "list",
              name: "newEmployeeRole",
              message: "What is their new role?",
              choices: roles.map((roles) => ({
                name: roles.title,
                value: roles.id,
              })),
            },
          ]).then((chosenRole) => {
            db.query("UPDATE employees SET role_id =? WHERE id = ?",
            [chosenRole.newEmployeeRole, chosenEmployee.employeeSelection],
            (err) => {
              if (err) {
                console.error(err);
              }
              console.log("Updated Employee's role");
              menu();
            })
          })
        });
      });
  });
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
