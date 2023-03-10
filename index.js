const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
// Check if output directory does exist and make it if doesn't
if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync("output");
}
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");
const { stringify } = require("querystring");

const team = []; // array of Employee objects (array of Manager, or Engineers, or Interns)

// Gather information about the development team members, and render the HTML file.
function createEngineer(team) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the engineer's name?",
        },
        {
            type: 'input',
            name: 'id',
            message: "Enter the engineer's ID:",
        },
        {
            type: 'input',
            name: 'email',
            message: "Enter the engineer's email address:",
        },
        {
            type: 'input',
            name: 'githubUsername',
            message: "Enter the engineer's GitHub username:",
        }
    ]).then((engineerDetails) => {
        // Initialise Engineer class to create Manager object
        const engineer = new Engineer(
            engineerDetails.name, 
            engineerDetails.id, 
            engineerDetails.email, 
            engineerDetails.githubUsername
            );
        team.push(engineer);
        createTeam(team); // at this point we add an engineer to the team array
    });
}

function createIntern(team) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the intern's name?",
        },
        {
            type: 'input',
            name: 'id',
            message: "Enter the intern's ID:",
        },
        {
            type: 'input',
            name: 'email',
            message: "Enter intern's email address:",
        },
        {
            type: 'input',
            name: 'school',
            message: "Enter intern's school:",
        }
    ]).then((internDetails) => {
        // Initialise Intern class to create Manager object
        const intern = new Intern(
            internDetails.name, 
            internDetails.id, 
            internDetails.email, 
            internDetails.school
            );
        team.push(intern);
        createTeam(team); // at this point we add an intern to the team array
    });
}

function createTeam(team) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'memberChoice',
            message: 'Which type of team member you wan to add?',
            choices: [
                'Engineer',
                'Intern',
                "I don't want to add any more team member",
            ],
        }
    ]).then((choice) => {
        if (choice.memberChoice === 'Engineer') {
            createEngineer(team);
        } else if (choice.memberChoice === 'Intern') {
            createIntern(team);
        } else {
            // at this point, team array should have a manager and however many engineers and interns the user inputted
            const html = render(team); // html will be html file as string
            // write html to a file index.html using fs library
            fs.writeFile(outputPath, html, (err) => {
                if (err) {
                    console.log('Failed to write HTML file');
                } else {
                    console.log('Your team is generated successfully!');
                }
            });
        }
    });
}

function createManager(team) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the team manager's name?",
        },
        {
            type: 'input',
            name: 'id',
            message: "Enter manager's ID?",
        },
        {
            type: "input",
            name: "email",
            message: "Enter Manager's email address:",
        },
        {
            type: "input",
            name: "officeNumber",
            message: "Enter Manager's office number:",
        }
    ]).then((managerDetails) => {
        // Initialise Manager class to create Manager object
        const manager = new Manager(
            managerDetails.name, 
            managerDetails.id, 
            managerDetails.email, 
            managerDetails.officeNumber
            );
        team.push(manager);
        createTeam(team); // at this point, team array have a manager in it
    });
}

function start() {
    // Employee can be Manager, Engineer, or Intern
    createManager(team);
}

start();