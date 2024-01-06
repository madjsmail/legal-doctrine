import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, userDocument } from './entities/user.entity';
import { FilterQuery, Model } from 'mongoose';
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
      return sendResponse(
        null,
        'Error creating User ',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortField: keyof User = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    filter: Record<string, any> = {},
  ): Promise<User[]> {
    try {
      const skip = (page - 1) * limit;
      const query: FilterQuery<userDocument> = {
        ...filter,
      };

      const users = await this.userModel
        .find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .select('-password -salt -__v')
        .exec();

        const totalCount = await this.userModel.countDocuments(query).exec();

      if (!users) {
        return sendResponse(
          null,
          'Users Not Found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        );
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
        'Error finding users',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ) as any;
    }
  }

  async findOne(userId: string) {
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
  async findOneByEmail(email: string){
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
      );
    } catch (error) {
      return sendResponse(
        null,
        'Error finding user by email',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
      

    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
