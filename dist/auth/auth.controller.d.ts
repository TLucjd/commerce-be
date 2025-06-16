import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
declare module 'express' {
    interface Request {
        user?: any;
    }
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: AuthDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(dto: AuthDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(req: Request): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: Request): Promise<{
        message: string;
    }>;
}
