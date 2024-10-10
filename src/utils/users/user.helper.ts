

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Messages } from '../constMessages';


@Injectable()
export class UsersHelper {

    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async createNewUser(createUserDto: CreateUserDto) {
        try {
            let user = await this.GetSingaleRecord({ email: createUserDto.email })
            if (user) throw ({ message: Messages.USER_EXIST, code: Messages.CONFLICT });

            user = await this.GetSingaleRecord({ username: createUserDto.username })
            if (user) throw ({ message: Messages.USER_EXIST_USERNAME, code: Messages.CONFLICT });

            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            createUserDto.password = hashedPassword;
            return await this.CreateRecord(createUserDto);
        } catch (error) {
            throw ({ message: error.message, code: error.code });
        }
    }

    async ValidateUser(email: string, password: string): Promise<any> {
        try {
            let userData = await this.GetSingaleRecord([{ email: email }, { username: email }])
            if (!userData) throw ({ message: Messages.INVALID_CREDENTIALS, code: Messages.UNAUTHORIZED });

            // console.log("==================", userData)
            // const user = await this.userRepo.createQueryBuilder('user')
            //     .select([
            //         'user.id',
            //         'user.email',
            //         'user.phone',
            //         'user.createdAt',
            //         'user.updatedAt'
            //     ])
            //     .where('user.email = :email', { email })
            //     .orWhere('user.username = :username', { username:email })
            //     .printSql()  // Print SQL for debugging
            //     .getOne()
            // console.log("==================", user)

            if (! await bcrypt.compare(password, userData.password)) {
                throw ({ message: Messages.INVALID_PASSWORD, code: Messages.UNAUTHORIZED });
            }
            const { ...result } = userData;
            return result;
        } catch (error) {
            throw ({ message: error.response, code: error.status });
        }

    }

    async UpdateUser(data: any, user: any) {
        try {
            await this.ValidateUserBeforeUpdate(data);
            let updateableJson = await this.GetJsonObject(data);
            return await this.userRepo.save({ ...updateableJson, id: user.id });
        } catch (error) {
            throw ({ message: error.message, code: error.code });
        }
    }

    async ValidateUserBeforeUpdate(data: any) {
        try {
            let exist: any
            if (data && data.email) {
                exist = await this.GetSingaleRecord({ email: data.email })
                if (exist) throw ({ message: Messages.USER_EXIST_USERNAME, code: Messages.CONFLICT });
            }
            if (data && data.username) {
                exist = await this.GetSingaleRecord({ username: data.username })
                if (exist) throw ({ message: Messages.USER_EXIST_USERNAME, code: Messages.CONFLICT });
            }
            return true
        } catch (error) {
            throw ({ message: error.message, code: error.code });
        }


    }

    async GetJsonObject(input: JSON) {
        const filtered = Object.fromEntries(
            Object.entries(input).filter(([key, value]) => value !== "")
        );
        return filtered
    }



    async GetSingaleRecord(whereCondition: any) {
        return await this.userRepo.findOne({ where: whereCondition });
    }

    async CreateRecord(data: any) {
        return await this.userRepo.save(data);
    }

}




