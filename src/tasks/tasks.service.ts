import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'sequelize-typescript';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class TasksService {
  constructor(
    @InjectModel(User)
    private userRepository: Repository<User>,
    @InjectModel(Task)
    private taskModel: Repository<Task>,
    private readonly mailerService: MailerService
  ) { }
  async create(createTaskDto: CreateTaskDto) {
    const user = await this.userRepository.findByPk(createTaskDto.userId);
    if (!user) {
      throw new ConflictException('User not found');
    }
    const { title, description, dueDate, priority, userId } = createTaskDto;
    const newTask = await this.taskModel.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || 'Normal',
      userId,
    } as any);
    // Send email notification to the user
    await this.mailerService.sendMail({
      from: 'Task-Management Admin' + '<' + process.env.EMAIL_USER + '>',
      to: user.email,
      subject: 'New Task Created',
      text: `Hello ${user.name},\n\nYour task "${newTask.title}" has been updated.`,
      context: {
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate ? newTask.dueDate.toLocaleDateString() : 'No due date',
        priority: newTask.priority,
      },
    })
    return newTask;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new ConflictException('Task not found');
    }
    const { title, description, dueDate, priority } = updateTaskDto;
    await task.update({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || 'Normal',
    } as any);

    // Send email notification to the user
    const user = await this.userRepository.findByPk(task.userId);
    if (user) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Task Updated',
        text: `Hello ${user.name},\n\nYour task "${task.title}" has been updated.`,
      });
    }
    return task;
  }

  async delete(id: number) {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new ConflictException('Task not found');
    }
    await task.destroy();
    return { message: 'Task deleted successfully' };
  }

  async findAll() {
    const tasks = await this.taskModel.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });
    const count = await this.taskModel.count();
    return { count, tasks };
  }

  async tasksByUserId(userId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new ConflictException('User not found');
    }

    const tasks = await this.taskModel.findAll({
      where: { userId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });
    if (!tasks.length) {
      throw new ConflictException('No tasks found for this user');
    }
    const count = await this.taskModel.count({ where: { userId } });
    return { count, tasks };
  }
}
