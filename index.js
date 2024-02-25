const Manager = require("./assets/lib/Manager.js");
const Engineer = require("./assets/lib/Engineer.js");
const Intern = require("./assets/lib/Intern.js");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./assets/src/page-template.js");

// Array of general questions for any type of employee
const generalQuestions = role => {
    return [
        {
            type: 'input',
            name: 'name',
            message: `What is the ${role}'s name?`,
            validate(text) {
                if (/^[a-zA-Z\s]+$/.test(text) && text.charAt(0) != ' ') {
                    return true;
                }
                return `Enter a valid name:`;
            },
        },
        {
            type: 'input',
            name: 'employeeId',
            message: `What is the ${role}'s ID no?`,
            validate(text) {
                if (!isNaN(text) && text.length>0) {
                    return true;
                }
                return 'Enter a valid number:';
            },
        },
        {
            type: 'input',
            name: 'email',
            message: `What is the ${role}'s email address?`,
            validate(text) {
                if (text.length == 0 || (text.includes("@", 1) && text.indexOf("@") < text.length - 1)) {
                    return true;
                }
                return 'Enter a valid email:';
            },
        },
    ]
}

// Question only for a manager
const managerQuestion = [
    {
        type: 'input',
        name: 'officeNo',
        message: "What is the manager's office no?",
        validate(text) {
            if (!isNaN(text)) {
                return true;
            }
            return 'Enter a valid number:';
        },
    },
]

// Options for adding employee or terminating the app
const addStaffQuestion = [
    {
        type: 'list',
        name: 'staff',
        message: "Add another staff?",
        choices: ["Add an engineer", "Add an intern", "Finish building the team"],
    },
]

// Question only for engineers
const engineerQuestion = [
    {
        type: 'input',
        name: 'github',
        message: "What is the employee's GitHub username?",
    },
]

// Question only for interns
const internQuestion = [
    {
        type: 'input',
        name: 'school',
        message: "What is the intern's school name?",
        validate(text) {
            if (/^[a-zA-Z\s]+$/.test(text) && text.charAt(0) != ' ') {
                return true;
            }
            return `Enter a valid name:`;
        },
    },
];

const team = [];

// Function to prompt questions
function inquire(questions, type) {

    inquirer.prompt(questions)
        .then((answers) => {
            if (type == "manager") {

                team.push(new Manager(answers.name, answers.employeeId, answers.email, answers.officeNo));
                inquire(addStaffQuestion, "addStaff");

            } else if (type == "addStaff") {

                if (answers.staff == "Add an engineer") {
                    inquire(generalQuestions("engineer").concat(engineerQuestion), "engineer")

                } else if (answers.staff == "Add an intern") {
                    inquire(generalQuestions("intern").concat(internQuestion), "intern")

                } else {
                    // Generates html
                    const html = render(team);

                    // Writes the html file
                    fs.writeFile(outputPath, html, (err) => {
                        err ? console.error(err) : console.log('File created in the ./output directory!');
                    });
                }
            } else if (type == "engineer") {

                team.push(new Engineer(answers.name, answers.employeeId, answers.email, answers.github));
                inquire(addStaffQuestion, "addStaff");

            } else {

                team.push(new Intern(answers.name, answers.employeeId, answers.email, answers.school));
                inquire(addStaffQuestion, "addStaff");
            }
        })
        .catch((error) => {
            if (error.isTtyError) {
                console.log("Couldn't be rendered in the current environment.");
            } else {
                console.log("Something went wrong!");
            }
        });
}

// Initiates prompting questions
inquire(generalQuestions("manager").concat(managerQuestion), "manager");
