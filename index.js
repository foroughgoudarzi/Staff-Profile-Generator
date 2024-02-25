const Manager = require("./assets/lib/Manager.js");
const Engineer = require("./assets/lib/Engineer.js");
const Intern = require("./assets/lib/Intern.js");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./assets/src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.
// Array of questions for user
const generalQuestions = role => {return [
    {
        type: 'input',
        name: 'name',
        message: `What is the ${role}'s name?`,
        validate(text) {
            if (text.length != 0) {
                return true;
            }
            return `Enter the ${role}'s name:`;
        },
    },
    {
        type: 'input',
        name: 'employeeId',
        message: `What is the ${role}'s ID no?`,
        validate(text) {
            if (!isNaN(text)) {
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

const addStaffQuestion = [
    {
        type: 'list',
        name: 'staff',
        message: "Add another staff?",
        choices: ["Add an engineer", "Add an intern", "Finish building the team"],

    },
]

const engineerQuestion = [
    {
        type: 'input',
        name: 'github',
        message: "What is the employee's GitHub username?",
    },
]

const internQuestion = [
    {
        type: 'input',
        name: 'school',
        message: "What is the intern's school name?",
    },
];
   
const team =[];

// Function to prompt questions
function inquire(questions, type) {

    inquirer.prompt(questions)
        .then((answers) => {
            if(type == "manager"){

                team.push(new Manager(answers.name, answers.employeeId, answers.email, answers.officeNo));
                inquire(addStaffQuestion, "addStaff");
            } else if(type == "addStaff"){
                if(answers.staff == "Add an engineer"){
                    inquire(generalQuestions("employee").concat(engineerQuestion), "engineer")

                }else if(answers.staff == "Add an intern"){
                    inquire(generalQuestions("intern").concat(internQuestion), "intern")

                } else{
                    // generate html
                    
                    const html = render(team);

                    fs.writeFile(outputPath, html, (err) => {
                        err ? console.error(err) : console.log('File created in the ./output directory!');
                    });
                }
            } else if(type == "engineer"){
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
