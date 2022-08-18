import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";
import { UUIDV4 } from "sequelize";

export interface IFollowers {
  followerId: number,
  userId: number
}

@Table({ tableName: 'followers', createdAt: false, updatedAt: false, underscored: true})
export class Followers extends Model<Followers, IFollowers> {
  @ApiProperty({example: 1, description: "Уникальный идентификатор подписки"})
  @Column({type: DataType.UUID, unique: true, primaryKey: true, defaultValue: UUIDV4})
  uuid: string;

  @ForeignKey(() => User)
  @ApiProperty({example: "1", description: "Идентификатор подписчика"})
  @Column({type: DataType.INTEGER, allowNull: false})
  followerId: number;

  @ForeignKey(() => User)
  @ApiProperty({example: "2", description: "Идентификатор автора контента"})
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number;
}