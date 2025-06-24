import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './entities/comment.entity';
import { Repository } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';


@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment) private commentRepository: Repository<Comment>,
    @InjectModel(User) private userRepository: Repository<User>,
    @InjectModel(Task) private taskModel: Repository<Task>,
  ) { }

  async create(createCommentDto: CreateCommentDto) {
    const userExists = await this.userRepository.findByPk(createCommentDto.userId);
    if (!userExists) {
      throw new ConflictException('User does not exist');
    }
    const taskExists = await this.taskModel.findByPk(createCommentDto.taskId);
    if (!taskExists) {
      throw new ConflictException('Task does not exist');
    }
    // Check if the user is the owner of the task
    if (taskExists.userId !== createCommentDto.userId) {
      throw new ConflictException('Only the task owner can add a comment');
    }
    const comment = await this.commentRepository.create(createCommentDto as Comment);
    return comment;
  }
  
  async findAllCommentsForOneTask(taskId: number) {
  const task = await this.taskModel.findByPk(taskId);
  if (!task) {
    throw new ConflictException('Task does not exist');
  }

  const comments = await this.commentRepository.findAll({
    where: { taskId },
    order: [['createdAt', 'ASC']],
  });
  return comments;
}

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const userExists = await this.userRepository.findByPk(updateCommentDto.userId);
    if (!userExists) {
      throw new ConflictException('User does not exist');
    }
    const taskExists = await this.taskModel.findByPk(updateCommentDto.taskId);
    if (!taskExists) {
      throw new ConflictException('Task does not exist');
    }
    const comment = await this.commentRepository.findByPk(id);
    if (!comment) {
      throw new ConflictException('Comment not found');
    }
    // Check if the user is the owner of the task
    if (taskExists.userId !== updateCommentDto.userId) {
      throw new ConflictException('Only the task owner can update a comment');
    }
    await comment.update({
      content: updateCommentDto.content,
      taskId: updateCommentDto.taskId,
      userId: updateCommentDto.userId,
    } as Comment);
    return comment;
  }

  async remove(id: number) {
    const userExists = await this.userRepository.findByPk(id);
    if (!userExists) {
      throw new ConflictException('User does not exist');
    }

    const taskExists = await this.taskModel.findByPk(id);
    if (!taskExists) {
      throw new ConflictException('Task does not exist');
    }
    const createCommentDto = { userId: userExists.id, taskId: taskExists.id } as CreateCommentDto;
    // Check if the user is the owner of the task
    if (taskExists.userId !== createCommentDto.userId) {
      throw new ConflictException('Only the task owner can delete a comment');
    }

    const comment = await this.commentRepository.findByPk(id);
    if (!comment) {
      throw new ConflictException('Comment not found');
    }
    await comment.destroy();
    return { message: 'Comment deleted successfully' };
  }
}
