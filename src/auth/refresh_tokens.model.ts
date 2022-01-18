import { Table, Column, Model, DataType } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

@Table({ tableName: 'refresh_tokens', createdAt: false, updatedAt: false, underscored: true})
export class RefreshToken extends Model<RefreshToken> {
  @ApiProperty({example: 1, description: "Уникальный идентификатор токенов"})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: 1, description: "Уникальный идентификатор Пользователя"})
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number

  @ApiProperty({example: true, description: "Отозван ли токен"})
  @Column({type: DataType.BOOLEAN, defaultValue: false})
  isRevoked: boolean

  @ApiProperty({example: "162222222", description: "Дата истекания срока работы токена"})
  @Column({type: DataType.DATE, allowNull: false})
  expires: Date
}