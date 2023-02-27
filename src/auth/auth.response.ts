import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
    @ApiProperty({ description: 'Jwt Access Token', example: 'your_acc_token' })
    accessToken;

    @ApiProperty({ description: 'Jwt Refresh Token', example: 'your_ref_token' })
    refreshToken;
}
