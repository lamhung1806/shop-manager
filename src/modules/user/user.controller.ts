import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'src/decorators/user.decorator';
import { ROLE } from 'src/shared/type';
import { RegisterDto } from '../auth/_dto';
import { ChangePasswordDto, GetAllUserDto, UpdateUserDto } from './_dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth([ROLE.ADMIN, ROLE.SELLER, ROLE.FULLFILLMENT])
  @Get()
  getProfile(@User('id') id: string) {
    return this.userService.getById(id);
  }

  @Auth([ROLE.ADMIN, ROLE.SELLER, ROLE.FULLFILLMENT])
  @Patch('change-password')
  changePassword(
    @User('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, changePasswordDto);
  }

  @Post('create-admin')
  createAdmin() {
    return this.userService.createAdmin();
  }

  @Get('all')
  @Auth([ROLE.ADMIN])
  getAllUsers(@Query() params: GetAllUserDto) {
    return this.userService.getAllUsers(params);
  }

  @Put(':id')
  @Auth([ROLE.ADMIN])
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Post()
  @Auth([ROLE.ADMIN])
  @ApiOperation({ summary: 'Create new user' })
  createUser(@Body() createUserDto: RegisterDto) {
    return this.userService.create(createUserDto);
  }
}
