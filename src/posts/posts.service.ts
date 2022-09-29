import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePostRequest } from "./dto/create-post.request";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from './posts.model';
import { FilesService } from "../files/files.service";
import { ErrorMessages } from "../common/constants/error-messages";

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postRepository: typeof Post,
              private fileService: FilesService) {}

  async createPost(dto: CreatePostRequest.Dto, image: any, userID: number) {
    let post: Post;
    const { fileURL } = await this.fileService.createFile(image, null, 'jpg', 'posts_images');
    try {
      post = await this.postRepository.create({...dto, userId: userID, image: fileURL});
    }
    catch (e) {
      throw new HttpException(`${ErrorMessages.ru.FAILED_TO_CREATE_POST}. ${e.message}`, HttpStatus.BAD_REQUEST);
    }
    return post;
  }
}
