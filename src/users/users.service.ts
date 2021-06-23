import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const { code, email, name, password } = userDto;
    if (code === 'uncrackableCodeForCreation#@67893247@%397643ppods;lqw')
      return this.usersRepository.save({
        email,
        name,
        passwordHash: await hash(password, 10),
      });
    throw new UnauthorizedException();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ email });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      relations: ['linkedin_profiles'],
      where: { id },
    });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
