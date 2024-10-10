import {
  Controller,
  Get,
  Post,
  Body,
  Response,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from 'src/jwt-auth/auth.guard';
import { Messages } from 'src/utils/constMessages';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post('/register')
  async RegisterUser(@Body() createUserDto: CreateUserDto, @Response() res: any) {
    try {
      await this.usersService.RegisterUser(createUserDto);
      res.status(Messages.SUCCESS).json({ status: Messages.REGISTER_SUCCESS, message: Messages.SUCCESS_MESSAGE });
    } catch (error) {
      res.status(error.code).json({ status: error.code, message: error.message });
    }

  }

  @Post('/login')
  async login(@Body() signInDto: SignInDto, @Response() res: any) {
    try {
      const result = await this.usersService.login(signInDto);
      res.status(Messages.SUCCESS).json({ status: Messages.SUCCESS, message: Messages.LOGIN_SUCCESS, data: result });
    } catch (error) {
      res.status(error.code).json({ status: error.code, message: error.message });
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('user-details')
  async GetLoggedUser(@Req() req: any, @Response() res: any) {
    try {
      const result = await this.usersService.GetLoggedUser(req);
      res.status(Messages.SUCCESS).json({ status: Messages.SUCCESS, message: Messages.SUCCESS_MESSAGE, data: result });
    } catch (error) {
      res.status(error.code).json({ status: error.code, message: error.message });
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('update-user')
  async UpdateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: any, @Response() res: any) {
    try {
      const result = await this.usersService.UpdateUser(req.user, updateUserDto);
      res.status(Messages.SUCCESS).json({ status: Messages.SUCCESS, message: Messages.SUCCESS_MESSAGE, data: result });
    } catch (error) {
      res.status(error.code).json({ status: error.code, message: error.message });
    }
  }
}
