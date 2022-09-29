import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { SetUserContactRequest } from "./dto/set-user-contact.request";
import { UserContact } from "./user-contacts.model";

@Injectable()
export class UserContactsService {
  constructor(@InjectModel(UserContact) private contactRepository: typeof UserContact) {}

  public async getContactsByUserId(userId: number): Promise<UserContact> {
    return await this.contactRepository.findOne({ where: { userId } });
  }

  public async setContacts(userId: number, dto: SetUserContactRequest.Dto) {
    await this.contactRepository.upsert({ userId, ...dto }, { returning: true });
    return await this.getContactsByUserId(userId);
  }
}