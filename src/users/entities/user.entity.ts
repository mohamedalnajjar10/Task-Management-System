import { Table, Model, Column, HasMany } from "sequelize-typescript";
import { Comment } from "src/comments/entities/comment.entity";
import { Task } from "src/tasks/entities/task.entity";


@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false, unique: true })
  declare email: string;

  @Column({ allowNull: true })
  declare picture: string;

  @Column({ allowNull: false })
  declare password: string;

  @Column({
    type: 'ENUM',
    values: ['user', 'admin'],
    defaultValue: 'user',
    allowNull: true,
  })
  declare role: string;

  @Column({ allowNull: true })
  declare passwordChangedAt: Date;

  @Column({ allowNull: true })
  declare passwordResetCode: string;

  @Column({ allowNull: true })
  declare passwordResetExpires: Date;

  @Column({ allowNull: true })
  declare passwordResetVerified: boolean;

  @Column
  declare createdAt: Date;

  @Column
  declare updatedAt: Date;

  @HasMany(() => Task, { foreignKey: 'userId' })
  declare tasks: Task[];

  @HasMany(() => Comment, { foreignKey: 'userId' })
  declare comments: Comment[];
}
