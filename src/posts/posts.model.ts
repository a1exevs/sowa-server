import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import { User } from "../users/users.model";

interface IPost {
    title: string,
    content: string,
    user_id: number,
    image: string
}

@Table({ tableName: 'posts', createdAt: false, updatedAt: false})
export class Post extends Model<Post, IPost> {
    @ApiProperty({example: "1", description: "Уникальный идентификатор Поста"})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: "Пост о Post-запросах", description: "Заголовок Поста"})
    @Column({type: DataType.STRING, allowNull: false})
    title: string;

    @ApiProperty({example: "Здесь текст данного поста", description: "Контентная часть Поста"})
    @Column({type: DataType.STRING, allowNull: false})
    content: string;

    @ApiProperty({example: "Картинка.jpg", description: "Имя прикрепляемой к Посту картинки"})
    @Column({type: DataType.STRING, allowNull: false})
    image: string;

    @ForeignKey(() => User)
    @ApiProperty({example: "1", description: "Идентификатор Пользователя"})
    @Column({type: DataType.INTEGER, allowNull: false})
    user_id: number;

    @BelongsTo(() => User)
    author: User;
}