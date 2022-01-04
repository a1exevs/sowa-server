import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePostDTO } from "./DTO/CreatePostDTO";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from './posts.model';
import { FilesService } from "../files/files.service";

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postRepository: typeof Post,
              private fileService: FilesService) {}

  async createPost(DTO: CreatePostDTO, image: any) {
    let post;
    const fileName = await this.fileService.createFile(image);
    console.log(fileName)
    console.log(DTO.user_id);
    try {
      post = await this.postRepository.create({...DTO, image: fileName});
    }
    catch (e) {
      throw new HttpException(`Не удалось создать пост. ${e.message}`, HttpStatus.BAD_REQUEST);
    }
    return post;
  }
}
