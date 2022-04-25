import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Followers, IFollowers } from "./followers.model";
import { UsersService } from "../users/users.service";

@Injectable()
export class FollowersService {
  constructor(@InjectModel(Followers) private followerRepository: typeof Followers,
              private usersService: UsersService) {}

  public async follow(followData: IFollowers): Promise<boolean> {
    const uuid = await this.validateFollowRequest(followData);
    if(uuid)
      throw new HttpException(`Пользователь id=${followData.followerId}уже является подписчиком пользователя id=${followData.userId}`, HttpStatus.BAD_REQUEST);

    return !!await this.followerRepository.create(followData);
  }

  public async unfollow(unfollowData: IFollowers): Promise<boolean> {
    const uuid = await this.validateFollowRequest(unfollowData);
    if(!uuid)
      throw new HttpException(`Пользователь id=${unfollowData.followerId} не является подписчиком пользователя id=${unfollowData.userId}`, HttpStatus.BAD_REQUEST);

    return !!await this.followerRepository.destroy({ where: unfollowData })
  }

  public async findFollowRows(followData: IFollowers): Promise<Followers[]> {
    return await this.followerRepository.findAll( {where: followData} );
  }

  private async validateFollowRequest(followData: IFollowers): Promise<string | null> {
    if(followData.followerId === followData.userId)
      throw new BadRequestException;

    const follower = await this.usersService.getUserById(followData.followerId);
    const user = await this.usersService.getUserById(followData.userId);
    if(!follower || !user)
      throw new BadRequestException;

    return await this.existRow(followData);
  }

  private async existRow(followData: IFollowers): Promise<string | null> {
    const row: Followers = await this.followerRepository.findOne({ where: followData });
    return row ? row.uuid : null;
  }
}
