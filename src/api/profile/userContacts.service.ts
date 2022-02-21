import { Injectable } from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Contact} from "./contact.model";

@Injectable()
export class UserContactsService {
    constructor(@InjectModel(Contact) private contactRepository: typeof Contact) {}

    public async getContactsByUserId(userId: string) : Promise<Contact> {
        return await this.contactRepository.findOne({ where: { userId } })
    }
}