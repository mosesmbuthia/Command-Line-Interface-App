import { Command } from 'commander';
import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'
import chalk from 'chalk';
import Table from 'cli-table3'
import prompts from 'prompts';


const program = new Command();
const client = new PrismaClient();

program.name("CLI-ToDo-Manager")
program.version("1.0.0")
program.description("Manage your ToDo lists in the Terminal")

const addTodoCommand = program.command("add-todo")
addTodoCommand.description("adds a ToDo to your ToDo list")
addTodoCommand.requiredOption("-t, --title <value>", "Todo title")
addTodoCommand.requiredOption("-d, --description <value>", "ToDo description")
addTodoCommand.requiredOption("-s, --status <value>", "status of the ToDo")

addTodoCommand.action(async function (options) {
    const title = options.title;
    const description = options.description;
    const status = options.status;

    try {
        const newTodo = await client.todo.create({
            data: {
                id: nanoid(5),
                title,
                description,
                status,
            }
        })
        console.log(chalk.green('Todo added successfully', newTodo))
    } catch (e) {
        console.log(chalk.bgRed("There was an error adding the todo, please try again"))
    }

})

program.command("show-todo")
    .description("Show all the todos or the specified todo")
    .option("-s, --status <value>", "The status of the specific todo")
    .action(async function (options) {
        const status = options.status;
        try {
            if (status) {
                const foundTodo = await client.todo.findFirst({
                    where: { status: status },
                });
                if (!foundTodo) {
                    console.log(chalk.bgYellow(`Todo with status ${status} was not found`));
                } else {
                    const table = new Table({
                        head: ["id", "Title", "Description", "Status"],
                    });
                    table.push([
                        foundTodo.id,
                        foundTodo.title,
                        foundTodo.description,
                        foundTodo.status,
                    ]);
                    console.log(table.toString());
                }
            } else {
                const todos = await client.todo.findMany();
                if (todos.length === 0) {
                    console.log(chalk.bgYellow("No todos found."));
                } else {
                    const table = new Table({
                        head: ["id", "Title", "Description", "Status"],
                    });
                    todos.forEach((todo) => {
                        table.push([todo.id, todo.title, todo.description, todo.status]);
                    });
                    console.log(table.toString());
                }
            }
        } catch (e) {
            console.error(chalk.bgRed("Error getting todos:", e));
        }
    });

program.command("update-todo")
.description("Updates a specified todo")
.requiredOption("-i, --id", "id of the todo")
.option("-t, --title <value>", "New title")
.option("-d, --description <value>", "New description")
.option("-s, --status <vlaue>", "New status")
.action(async function(options){
    const id = options.id;
    const newTitle = options.title;
    const newDescription = options.description;
    const newStatus = options.status;
    
    try {
        await client.todo.update({
            where: {id},
            data: {
                title: newTitle && newTitle,
                description: newDescription && newDescription,
                status: newStatus && newStatus

            }
        })
        console.log(chalk.green(`Todo with ${id} has been updated succesfully`))

    } catch (e) {
        console.log(chalk.bgRed(`Error updating todo`))
    }
})


program.command("delete-todo")
.description("Delete a specific todo")
.requiredOption("-i, --id <value>", "The id of the todo to be deleted")
.action(async function(options) {
    const id = options.id;
    try {
        await client.todo.delete({
            where: {id}

        })
        console.log(chalk.green(`Todo deleted successfully`))
        
    } catch (e) {
        console.log(chalk.bgRed(`Error deleting todo`))
    }
})


program.command("delete-all")
.description("Delete all the todos")
.action(async function() {
    console.log(chalk.red(`!!!!!!HOLD IT RIGHT THERE. YOU ARE ABOUT TO PERFORM A DANGEROUS COMMAND!!!!`))
    try {
       const response = await prompts({
            type: "multiselect",
            name: "decision",
            message: "Are you sure you want to delete all todos?",
            choices: [
                {title: "Yes", value: "yes"},
                {title: "No", value: "no"}
            ]
        })
        if (response.decision[0] === 'yes') {
            await client.todo.deleteMany();
            console.log(chalk.green(`All the todos have been deleted successfully`))
        }

    } catch (e) {
        console.log(chalk.bgRed(`There was an error!`))
    }
})


program.parse();