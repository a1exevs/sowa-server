import { Injectable } from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Contact} from "./contact.model";
import { SetContactReqDTO } from "./ReqDTO/SetContactReqDTO";

@Injectable()
export class UserContactsService {
    constructor(@InjectModel(Contact) private contactRepository: typeof Contact) {}

    public async getContactsByUserId(userId: number) : Promise<Contact> {
        return await this.contactRepository.findOne({ where: { userId } })
    }

    public async setContacts(userId: number, dto: SetContactReqDTO) {
        await this.contactRepository.upsert({userId, ...dto}, {returning: true} )
        return await this.getContactsByUserId(userId);
    }
}