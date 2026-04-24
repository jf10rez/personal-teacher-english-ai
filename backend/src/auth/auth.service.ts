import * as bcrypt from 'bcryptjs';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      level: dto.level || 'beginner',
      goal: dto.goal || '',
      dailyMinutes: dto.dailyMinutes || 30,
    });

    const tokens = await this.generateTokens(user);
    return { user: { id: user._id, name: user.name, email: user.email, level: user.level, goal: user.goal, dailyMinutes: user.dailyMinutes }, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user);
    return { user: { id: user._id, name: user.name, email: user.email, level: user.level, goal: user.goal, dailyMinutes: user.dailyMinutes }, ...tokens };
  }

  async refresh(userId: string, email: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.generateTokens(user);
    return tokens;
  }

  private async generateTokens(user: User) {
    const payload = { sub: user._id, email: user.email, name: user.name };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET }),
    ]);

    await this.userModel.findByIdAndUpdate(user._id, { refreshToken });
    return { accessToken, refreshToken };
  }
}
