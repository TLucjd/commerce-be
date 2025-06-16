import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new ForbiddenException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed },
    });
    return this.getTokens(user.id, user.email);
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new ForbiddenException('Invalid credentials');
    }
    const tokens = await this.getTokens(user.id, user.email);

    // ✅ Mã hoá refresh token trước khi lưu
    const hashedRefresh = await bcrypt.hash(tokens.refresh_token, 10);

    // ✅ Cập nhật refresh token trong DB
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });
    return tokens;
  }

  async refreshTokens(userId: string, email: string, incomingToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    // ✅ So sánh token client gửi lên với token đã lưu
    const isMatch = await bcrypt.compare(incomingToken, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('Invalid refresh token');

    const tokens = await this.getTokens(user.id, user.email);
    const hashedRefresh = await bcrypt.hash(tokens.refresh_token, 10);

    // ✅ Cập nhật token mới
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    return tokens;
  }

  getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const access_token = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
    const refresh_token = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { access_token, refresh_token };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logout successful' };
  }
}
