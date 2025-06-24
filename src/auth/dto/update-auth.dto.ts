import { PartialType } from '@nestjs/mapped-types';
import { SingUpDto } from './auth.dto';

export class UpdateAuthDto extends PartialType(SingUpDto) {}
