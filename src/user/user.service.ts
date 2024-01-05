import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, userDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { sendResponse } from 'src/utils/response.helper';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<userDocument>,
  ) {}
  async create(_createUserDto: CreateUserDto): Promise<any> {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
    } = _createUserDto;

    if (password !== confirmPassword) {
      return sendResponse(
        null,
        "Password don't match",
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
      );
    }

    const userExists = await this.userModel.findOne({ email });

    if (userExists) {
      return sendResponse(
        null,
        'User  with this email existe',
        ReasonPhrases.CONFLICT,
        StatusCodes.CONFLICT,
      );
    }

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phoneNumber = phoneNumber;

    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    // user.emailValidationCode = AuthHelpers.getRandomEmailValidationCode();
    // user.phoneValidationCode = AuthHelpers.getRandomPhoneValidationCode();

    try {
      const createdUser = new this.userModel(user);
      await createdUser.save();

      return sendResponse(
        createdUser,
        'User Created',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
      return sendResponse(
        null,
        'Error creating User ',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel
        .find()
        .select('-password -salt -__v')
        .exec();
      if (!users) {
        return sendResponse(
          users,
          'User Not Found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        ) as any;
      }
      return sendResponse(
        users,
        'Users retrieved ',
        ReasonPhrases.OK,
        StatusCodes.OK,
      ) as any;
    } catch (error) {
      // Handle errors here, e.g., log the error or return a custom error response
      return sendResponse(
        null,
        'User Not Found',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ) as any;
      throw new Error('Error finding users');
    }
  }

  async findOne(userId: string): Promise<User> {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-password -salt -__v')
        .exec();

      if (!user) {
        return sendResponse(
          user,
          'User Not Found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        ) as any;
      }

      return sendResponse(
        user,
        'User retrieved',
        ReasonPhrases.OK,
        StatusCodes.OK,
      ) as any;
    } catch (error) {
      // Handle errors here, e.g., log the error or return a custom error response
      throw new Error('Error finding user');
    }
  }
  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({ email })
        .select('-password -salt -__v')
        .exec();

      if (!user) {
        return sendResponse(
          user,
          'User Not Found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        ) as any;
        throw new Error('User not found');
      }
      return sendResponse(
        user,
        'User retrieved',
        ReasonPhrases.OK,
        StatusCodes.OK,
      ) as any;
    } catch (error) {
      // Handle errors here, e.g., log the error or return a custom error response
      throw new Error('Error finding user by email');
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
