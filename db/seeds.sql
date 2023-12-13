INSERT INTO departments (department_name)
VALUES ("Development"),
       ("Marketting"),
       ("Human Resources"),
       ("Management");

INSERT INTO roles (department_id, title, salary)
VALUES (1, "Project Manager", 100000),
       (1, "Front End Developer", 70000),
       (1, "Back End Developer", 80000),
       (2, "Sales Rep", 85000),
       (2, "Marketting Strategist", 95000),
       (3, "Recruiter", 72000),
       (3, "Employee Relations", 83000),
       (4, "Development Head", 120000),
       (4, "Sales Manager", 11000),
       (4, "HR Director", 105000),
       (4, "CEO", 200000);

INSERT INTO employees (role_id, first_name, last_name, manager_id)
VALUES (1, "John", "Matthew", 10),
       (2, "Bill", "Withers", 10),
       (2, "Donnie", "Tello", 10),
       (3, "Michael", "Benson", 10),
       (3, "Brick", "Johnson", 10),
       (4, "Sydney", "Andrew", 11),
       (5, "Jim", "Tanaka", 11),
       (6, "Emery", "Jean", 12),
       (7, "Colby", "Stormer", 12),
       (8, "Brock", "Angels", 13),
       (9, "Mary", "Richards", 13),
       (10, "Denise", "Smucker", 13),
       (11, "Steve", "Carell", 13);
