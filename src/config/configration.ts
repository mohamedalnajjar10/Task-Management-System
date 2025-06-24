import { Sequelize } from "sequelize-typescript";
import { Comment } from "src/comments/entities/comment.entity";
import { Task } from "src/tasks/entities/task.entity";
import { User } from "src/users/entities/user.entity";

const sequelize = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123123", 
    database: "task",
    models: [User , Task , Comment],
})

sequelize.sync({ alter: false })
    .then(() => {
        console.log("Database & tables created or updated!");
    })
