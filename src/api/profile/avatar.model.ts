import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";

interface IAvatar {
    userId: number,
    small: string,
    large: string
}

@Table({ tableName: 'avatars', createdAt: false, updatedAt: false, underscored: true, charset: 'utf8', collate: 'utf8_general_ci'})
export class Avatar extends Model<Avatar, IAvatar> {
    @ApiProperty({example: 1, description: "Уникальный идентификатор записи о аватарах пользователя"})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    /**
     * @todo НЕ РАБОТАЕТ FOREIGN kEY
     */
    @ForeignKey(() => User)
    @ApiProperty({example: 1, description: "Уникальный идентификатор пользователя"})
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;

    @ApiProperty({example: "small_avatar.jpg", description: "Ссылка на фото профиля пользователя. Мелкий формат"})
    @Column({type: DataType.STRING, allowNull: false})
    small: string;

    @ApiProperty({example: "large_avatar.jpg", description: "Ссылка на фото профиля пользователя. Крупный формат"})
    @Column({type: DataType.STRING, allowNull: false})
    large: string;
}