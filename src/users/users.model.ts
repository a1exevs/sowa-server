import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {UsersRoles} from "./users_roles.model";

interface IUser {
    email: string,
    password: string
}

@Table({ tableName: 'users'})
export class User extends Model<User, IUser> {
    @ApiProperty({example: "1", description: "Уникальный идентификатор Пользователя"})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: "user@yandex.ru", description: "Адрес электронной почты Пользователя"})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty({example: "1234", description: "Пароль Пользователя от учетной записи"})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: "false", description: "Забанен ли Пользователь"})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: "Машенничество", description: "Причина попадания в бан Пользователя"})
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @BelongsToMany(() => Role, () => UsersRoles)
    roles: Role[];
}