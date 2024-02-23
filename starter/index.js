const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.
// Array of questions for user
const generalQuestions = [
    {
        type: 'input',
        name: 'name',
        message: "What is the employee's name?",
        validate(text) {
            if (text.length != 0) {
                return true;
            }
            return 'Enter the team manager\'s name:';
        },
    },
    {
        type: 'number',
        name: 'employeeId',
        message: "What is the eployee's ID no?",
        // validate(text) {
        //     if (typeof text == 'number') {
        //         return true;
        //     }
        //     return 'Enter a valid number:';
        // },
    },
    {
        type: 'input',
        name: 'email',
        message: "What is the employee's email address?",
        validate(text) {
            if (text.length == 0 || (text.includes("@", 1) && text.indexOf("@") < text.length - 1)) {
                return true;
            }
            return 'Enter a valid email:';
        },
    },
]

const managerQuestion = [
    {
        type: 'number',
        name: 'officeNo',
        message: "What is the team manager's office no?",
        // validate(text) {
        //     if (typeof text == 'number') {
        //         return true;
        //     }
        //     return 'Enter a valid office number:';
        // },

    },
]

const addQuestion = [
    {
        type: 'list',
        name: 'staff',
        message: "Add another staff?",
        choices: ["Add an engineer", "Add an intern", "Finish building the team"],

    },
]

const engineerQuestion = [
    {
        type: 'confirm',
        name: 'contents',
        message: "Do you wish to include a table of contents?",
        default() {
            return 'Y';
        },
    },
    {
        type: 'list',
        name: 'license',
        message: "Under which license is the application covered?",
        choices: ["MIT License", "GNU GPL v3 License", "GNU GPL v2 License", "Apache License 2.0", "BSD-2 License", "BSD-3 License", "Boost Software License"],

    },
    {
        type: 'input',
        name: 'contributing',
        message: "Who are the contributors and/or resources used?",

    },
    {
        type: 'input',
        name: 'tests',
        message: "How can the tests be executed?",

    },
    {
        type: 'input',
        name: 'username',
        message: "What is the GitHub username hosting this project?",
    },
    {
        type: 'input',
        name: 'email',
        message: "Please provide an email address for user inquiries:",
        validate(text) {
            if (text.length == 0 || (text.includes("@", 1) && text.indexOf("@") < text.length - 1)) {
                return true;
            }
            return 'Enter a valid email:';
        },
    },
];
