const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();
const logo = require('asciiart-logo');
const config = require('./package.json');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'sqlpass',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

db.connect(function(err){
  if(err) throw err 
})

function runApp() {
  // const logoText = logo({ name: "Employee Manager" }.render());

  // console.log(logoText);
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
        updateEmployeeRole();
      }
    });
}

function viewDepartments() {
  db.query ('Select * from department',(err, res) => {
    if(err) throw err
console.table(res)
mainMenu()
  })
}
function viewRoles() {
  db.query ('Select * from role',(err, res) => {
    if(err) throw err
console.table(res)
mainMenu()
  })
}
function viewEmployees() {
  db.query ('Select * from employee',(err, res) => {
    if(err) throw err
console.table(res)
mainMenu()
  })
}


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
      db.query('insert into department set ?', {
        name: data.departmentname
      })
      mainMenu();
    });
}

function addRole() {
  db.query('select * from department', (err, res) => {
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
        message: "What is the department ID of the role that you want to add?",
        name: "roledepartment",
        choices: res.map(department => department.name)
      },
    ])
    .then((data) => {
      let department = res.find(department => department.name === data.roledepartment)
      db.query('insert into role set ?', {
        title: data.roletitle,
        salary: data.rolesalary,
        department_id: department.id
      } )
      mainMenu();
    });
  })
}

function addEmployee() {
  db.query('select * from role', (err, res) => {
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
        type: "list",
        message: "What is the role ID of the employee that you want to add?",
        name: "employeerole",
        choices: res.map(role => role.title)
      },
      {
        type: "list",
        message: "What is the manager ID of the employee you want to add?",
        name: "employeemanager",
        choices: [1, 2, 3]
      },
    ])
    .then((data) => {
      let role = res.find(role => role.title === data.employeerole)
      db.query('insert into employee set ?', {
        first_name: data.employeefirst,
        last_name: data.employeelast,
        role_id: role.id,
        manager_id: data.employeemanager,
      } )
      mainMenu();
    });
  })
}

function updateEmployeeRole() {
dbquery('select * from employee', (err, res) =>{
  inquirer
  .prompt([
    {
      type: "list",
      message: "What is the first name of the employee that you want to add?",
      name: "employeefirst",
      choices: res.map(role => role.title)
    },
  ])
  .then((data) => {
    // bring answer from first question into the scope of this .then (let employee = data.employeefirst)
    // query the role table and select the role to give to the employee similar to 189
    .then((data) => {
      // db.query(update the employee table with the selected employee and the selected role for that employee)
    })
  })
})
}

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
