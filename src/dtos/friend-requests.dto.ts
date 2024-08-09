import { IsString } from 'class-validator';

export class FriendRequestDto {
  @IsString()
  public targetId: string;
}

export class FriendRequestActionDto {
  @IsString()
  public requestId: string;
}
