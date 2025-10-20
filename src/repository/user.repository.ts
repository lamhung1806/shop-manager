import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { RegisterDto } from 'src/modules/auth/_dto';

import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly Prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.Prisma.user.findFirst({
      where: { email },
    });
  }

  async findByUserName(username: string): Promise<User | null> {
    return this.Prisma.user.findFirst({
      where: { name: username },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.Prisma.user.findUnique({
      where: { id },
    });
  }

  async findByIdSafe(id: string) {
    return this.Prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        phoneNumber: true,
        // Không select password và refreshToken
      },
    });
  }

  async create(createAuthDto: RegisterDto): Promise<User> {
    const { email, password, username } = createAuthDto;
    createAuthDto;

    const createUserPayload: Prisma.UserCreateInput = {
      email,
      name: username,
      password: password,
    };

    if (password) {
      createUserPayload.password = password;
    }

    return this.Prisma.user.create({
      data: createUserPayload,
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    return this.Prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async updateUser(
    userId: string,
    updateData: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.Prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}
