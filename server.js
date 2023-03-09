const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const app = express();
const logo = require('asciiart-logo');

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
  console.log(
    logo({
        name: 'EMPLOYEE MANAGER',
        font: 'Delta Corps Priest 1',
        lineChars: 10,
        padding: 2,
        margin: 2,
        borderColor: 'bold-orange',
        logoColor: 'bold-orange',
    })
    .render())
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
        message: "What is the role of the employee that you want to add?",
        name: "employeerole",
        choices: res.map(role => role.title)
      },
      {
        type: "list",
        message: "What is the manager ID of the employee you want to add?",
        name: "employeemanager",
        choices: 
        [1,
        new inquirer.Separator(),
        2,
        new inquirer.Separator(),
        3,
        new inquirer.Separator(),
        4,
        new inquirer.Separator(),
        5,
        new inquirer.Separator(),]
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
        let selectedEmp = res.find(employee => employee.first_name === data.updateemployee);
        console.log(selectedEmp.id)
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
              let selectedRole = res.find(role => role.title === data.newrole);
              db.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [selectedRole.id, selectedEmp.id],
                function (error) {
                  if (err) throw err;
                  mainMenu()
                  
                }
              );
            });
        });
      });
  });
}

runApp();
