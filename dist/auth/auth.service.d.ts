import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: AuthDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(dto: AuthDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshTokens(userId: string, email: string, incomingToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getTokens(userId: string, email: string): {
        access_token: string;
        refresh_token: string;
    };
    logout(userId: string): Promise<{
        message: string;
    }>;
}
