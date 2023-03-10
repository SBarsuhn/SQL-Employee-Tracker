// These are the requirements that let the application function
const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const app = express();
const logo = require("asciiart-logo");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// This section and the db.connect let the javascript file read information from the employee database on schema.sql
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "sqlpass",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

db.connect(function (err) {
  if (err) throw err;
});
// This function just throws up a start screen to let you know the application is running correctly
function runApp() {
  console.log(
    logo({
      name: "EMPLOYEE MANAGER",
      font: "Delta Corps Priest 1",
      lineChars: 10,
      padding: 2,
      margin: 2,
      borderColor: "bold-orange",
      logoColor: "bold-orange",
    }).render()
  );
  mainMenu();
}
// This puts up a goodbye message and then ends the connection with the database
function exit() {
  console.log(
    logo({
      name: "GOODBYE",
      font: "Roman",
      lineChars: 5,
      padding: 0,
      margin: 0,
      borderColor: "bold-pink",
      logoColor: "bold-pink",
    }).render()
  );
  db.end();
}
// This is the function for the main menu. It lets you pick what you want to do inside the application
function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please pick one of the options",
        name: "mainmenu",
        choices: [
          "View all departments",
          new inquirer.Separator(),
          "View all roles",
          new inquirer.Separator(),
          "View all employees",
          new inquirer.Separator(),
          "Add a department",
          new inquirer.Separator(),
          "Add a role",
          new inquirer.Separator(),
          "Add an employee",
          new inquirer.Separator(),
          "Update an employee role",
          new inquirer.Separator(),
          "Exit",
          new inquirer.Separator(),
        ],
      },
    ])
    .then((data) => {
      // This will launch the corresponding function to whatever option you pick
      if (data.mainmenu === "View all departments") {
        viewDepartments();
      } else if (data.mainmenu === "View all roles") {
        viewRoles();
      } else if (data.mainmenu === "View all employees") {
        viewEmployees();
      } else if (data.mainmenu === "Add a department") {
        addDepartment();
      } else if (data.mainmenu === "Add a role") {
        addRole();
      } else if (data.mainmenu === "Add an employee") {
        addEmployee();
      } else if (data.mainmenu === "Update an employee role") {
        updateEmployeeRole();
      } else if (data.mainmenu === "Exit") {
        exit();
      }
    });
}
// This just shows the departments table from the database
function viewDepartments() {
  db.query("Select * from department", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}
// This just shows the roles table from the database
function viewRoles() {
  db.query("Select * from role", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

// This one is a little more in depth. It joins together aspects of multiple tables so you can see, for example, an employees name, department, and salary at the same time.
function viewEmployees() {

  db.query("select emp.id, emp.manager_id, emp.first_name, emp.last_name, rl.title, dep.name as department, rl.salary from employee emp left join role rl on emp.role_id = rl.id left join department dep on dep.id = rl.department_id left join employee man on man.id = emp.manager_id", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });

}

// This lets you put a new row in the department table
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department that you want to add?",
        name: "departmentname",
      },
    ])
    .then((data) => {
      db.query("insert into department set ?", {
        name: data.departmentname,
      });
      mainMenu();
    });
}
// This will prompt you with a few questions and then add the responses to the role table in the database
function addRole() {
  db.query("select * from department", (err, res) => {
    if (err) throw err;
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
          type: "list",
          message:
            "What is the department ID of the role that you want to add?",
          name: "roledepartment",
          choices: res.map((department) => department.name),
        },
      ])
      .then((data) => {
        let department = res.find(
          (department) => department.name === data.roledepartment
        );
        // This section adds the responses from the prompt into the database
        db.query("insert into role set ?", {
          title: data.roletitle,
          salary: data.rolesalary,
          department_id: department.id,
        });
        mainMenu();
      });
  });
}
// This will prompt you with a few questions and then add the responses to the employee table in the database
function addEmployee() {
  db.query("select * from role", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          message:
            "What is the first name of the employee that you want to add?",
          name: "employeefirst",
        },
        {
          type: "input",
          message:
            "What is the last name of the employee that you want to add?",
          name: "employeelast",
        },
        {
          type: "list",
          message: "What is the role of the employee that you want to add?",
          name: "employeerole",
          choices: res.map((role) => role.title),
        },
        {
          type: "list",
          message: "What is the manager ID of the employee you want to add?",
          name: "employeemanager",
          choices: [
            1,
            new inquirer.Separator(),
            2,
            new inquirer.Separator(),
            3,
            new inquirer.Separator(),
            4,
            new inquirer.Separator(),
            5,
            new inquirer.Separator(),
          ],
        },
      ])
      // This section adds the responses from the prompt into the database
      .then((data) => {
        let role = res.find((role) => role.title === data.employeerole);
        db.query("insert into employee set ?", {
          first_name: data.employeefirst,
          last_name: data.employeelast,
          role_id: role.id,
          manager_id: data.employeemanager,
        });
        mainMenu();
      });
  });
}
// This lets you update the role of an employee. It works by first asking the name of the employee you want to update. Then it finds that name in the database and updates it to be in the new role
function updateEmployeeRole() {
  db.query("select * from employee", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          message:
            "What is the first name of the employee that you want to update?",
          name: "updateemployee",
          choices: res.map((employee) => employee.first_name),
        },
      ])
      .then((data) => {
        let selectedEmp = res.find(
          (employee) => employee.first_name === data.updateemployee
        );
        console.log(selectedEmp.id);
        db.query("select * from role", (err, res) => {
          inquirer
            .prompt([
              {
                type: "rawlist",
                message: "What is the new role of the employee?",
                name: "newrole",
                choices: res.map((role) => role.title),
              },
            ])
            .then((data) => {
              let selectedRole = res.find(
                (role) => role.title === data.newrole
              );
              db.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [selectedRole.id, selectedEmp.id],
                function (err) {
                  if (err) throw err;
                  mainMenu();
                }
              );
            });
        });
      });
  });
}
// This is what starts the application when you run "node server.js"
runApp();
