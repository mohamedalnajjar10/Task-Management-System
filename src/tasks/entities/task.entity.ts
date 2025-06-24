import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Comment } from "src/comments/entities/comment.entity";
import { User } from "src/users/entities/user.entity";


@Table({ tableName: 'tasks', timestamps: true })
export class Task extends Model<Task> {

    @Column({ primaryKey: true, autoIncrement: true })
    declare id: number;

    @Column({ allowNull: false })
    declare title: string;

    @Column({ allowNull: false })
    declare description: string;

    @Column({ type: DataType.ENUM('pending', 'in_progress', 'completed'), defaultValue: 'pending' })
    status: 'pending' | 'in_progress' | 'completed';


    @Column({ allowNull: true })
    declare dueDate: Date;

    @Column({ allowNull: true })
    declare priority: string;

    @ForeignKey(() => User)
    @Column({ allowNull: true })
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;

    @HasMany(() => Comment, { foreignKey: 'taskId' })
    declare comments: Comment[];
}