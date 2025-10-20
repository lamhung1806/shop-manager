import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'src/decorators/user.decorator';
import { ROLE } from 'src/shared/type';
import { UserService } from './user.service';
import { ChangePasswordDto } from './user-response-dto';

@ApiTags('user')
@Controller('user')
@Auth([ROLE.ADMIN, ROLE.SELLER, ROLE.BUYER])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getProfile(@User('id') id: string) {
    return this.userService.getById(id);
  }

  @Patch('change-password')
  changePassword(
    @User('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, changePasswordDto);
  }
}
