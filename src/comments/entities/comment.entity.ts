import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Task } from "src/tasks/entities/task.entity";
import { User } from "src/users/entities/user.entity";

@Table({tableName: "comments", timestamps: true})
export class Comment extends Model<Comment> {
    @Column({ primaryKey: true, autoIncrement: true })
    declare id: number;

    @Column({ allowNull: false })
    declare content: string;

    @ForeignKey(() => Task)
    @Column({ allowNull: false })
    declare taskId: number;

    @BelongsTo(() => Task)
    declare task: Task;

    @ForeignKey(() => User)
    @Column({ allowNull: false })
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;
}
