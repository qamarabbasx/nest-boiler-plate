import { HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { AuthHelper } from 'src/jwt-auth/auth.helper';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersHelper } from 'src/utils/users/user.helper';
import { Messages } from 'src/utils/constMessages';


@Injectable()
export class UsersService {

  constructor(
    // @InjectRepository(User)
    // private userRepo: Repository<User>,
    private readonly helper: AuthHelper,
    private readonly userHelper: UsersHelper,
  ) { }

  async RegisterUser(createUserDto) {
    try {
      return await this.userHelper.createNewUser(createUserDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(signInDto: SignInDto) {
    try {
      const user = await this.userHelper.ValidateUser(signInDto.email, signInDto.password);
      if (!user) throw new Error(Messages.INVALID_CREDENTIALS)

      const token = this.helper.generateToken(user);
      return { token, user };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async GetLoggedUser(req) {
    return req.user;
  }

  async UpdateUser(user, updateUserDto: UpdateUserDto) {
    try {
      let { username, email } = updateUserDto;
      if (!username && !email) throw new Error(Messages.UPDATE_PROFILE_ERROR);

      const updatedUser = await this.userHelper.UpdateUser(updateUserDto, user);
      console.log(updatedUser)
    } catch (error) {
      throw new Error(error.message);
    }
  }

}
