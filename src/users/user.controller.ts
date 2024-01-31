import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { ControllerBase } from 'src/core/controllers/base.controller';

@Injectable()
export class UserController extends ControllerBase {
  constructor(private readonly userService: UserService) {
    super();
  }
}
