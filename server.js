const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// // Connect to database
// const db = mysql.createConnection(
//   {
//     host: 'localhost',
//     user: 'root',
//     password: 'sqlpass',
//     database: 'employee_db'
//   },
//   console.log(`Connected to the employee_db database.`)
// );

// // Query database
// db.query('SELECT * FROM course_names', function (err, results) {
//   console.log(results);
// });

// // Default response for any other request (Not Found)
// app.use((req, res) => {
//   res.status(404).end();
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

function runApp() {
  console.log("FIGURE OUT HOW TO GET ASCII TO WORK");
  mainMenu();
}

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please pick one of the options",
        name: "mainmenu",
        choices: [
          "view all departments",
          new inquirer.Separator(),
          "view all roles",
          new inquirer.Separator(),
          "view all employees",
          new inquirer.Separator(),
          "add a department",
          new inquirer.Separator(),
          "add a role",
          new inquirer.Separator(),
          "add an employee",
          new inquirer.Separator(),
          "update an employee role",
          new inquirer.Separator(),
        ],
      },
    ])
    .then((data) => {
      // This will launch the corresponding function to whatever option you pick
      if (data.mainmenu === "view all departments") {
        viewDepartments();
      } else if (data.mainmenu === "view all roles") {
        viewRoles();
      } else if (data.mainmenu === "view all employees") {
        viewEmployees();
      } else if (data.mainmenu === "add a department") {
        addDepartment();
      } else if (data.mainmenu === "add a role") {
        addRole();
      } else if (data.mainmenu === "add an employee") {
        addEmployee();
      } else if (data.mainmenu === "update an employee role") {
        updateEmployee();
      }
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department that you want to add?",
        name: "departmentname",
      },
      {
        type: "input",
        message: "What is the ID of the department that you want to add?",
        name: "departmentid",
      },
    ])
    .then((data) => {
      mainMenu();
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the title of the role the you want to add?",
        name: "roletitle",
      },
      {
        type: "input",
        message: "What is the salary of the role that you want to add?",
        name: "rolesalary",
      },
      {
        type: "input",
        message: "What is the ID of the role that you want to add?",
        name: "roleid",
      },
      {
        type: "input",
        message: "What is the department ID of the role that you want to add?",
        name: "roledepartment",
      },
    ])
    .then((data) => {
      mainMenu();
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the first name of the employee that you want to add?",
        name: "employeefirst",
      },
      {
        type: "input",
        message: "What is the last name of the employee that you want to add?",
        name: "employeelast",
      },
      {
        type: "input",
        message: "What is the role ID of the employee that you want to add?",
        name: "employeerole",
      },
      {
        type: "input",
        message: "What is the manager ID of the employee you want to add?",
        name: "employeemanager",
      },
    ])
    .then((data) => {
      mainMenu();
    });
}

function updateEmployee() {}

runApp();

// GIVEN a command-line application that accepts user input
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
