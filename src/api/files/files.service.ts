import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path"
import * as fs from "fs"
import * as uuid from "uuid"

@Injectable()
export class FilesService {

  public async addJPEGFile(file: any, fileName: string = "", relativePath: string = ""): Promise<string> {
    FilesService.checkForMimeType(file, 'image/jpeg');
    relativePath = FilesService.correctRelativePath(relativePath);
    const {fileURL} = await this.createFile(file, fileName, "/activecontent/images" + relativePath);
    return fileURL;
  }

  async createFile(file: any, fileName: string = "", relativePath: string = ""): Promise<{filePath: string, fileURL: string}> {
    try {
      relativePath = FilesService.correctRelativePath(relativePath);

      if(!fileName)
          fileName = uuid.v4() + ".jpg";

      const pathForSaving = path.resolve(__dirname, '../../', 'static' + relativePath);
      if(!fs.existsSync(pathForSaving))
          fs.mkdirSync(pathForSaving, {recursive: true})
      fs.writeFileSync(path.join(pathForSaving, fileName), file.buffer);
      const PORT = process.env.PORT || undefined;
      const SERVER_URL = process.env.SERVER_URL || undefined;
      const fileURL = SERVER_URL + ":" + PORT + relativePath + fileName;
      const filePath = pathForSaving + "/" + fileName;
      return {filePath, fileURL};
    }
    catch (e)
    {
      throw new HttpException("Произошла ошибка при записи файла", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private static correctRelativePath(path: string)
  {
    if(path.charAt(0) != "/") path = "/" + path;
    if(path.charAt(path.length - 1) != "/") path += "/";
    return path;
  }

  private static checkForMimeType(file: any, haystack: string)
  {
    if(file.mimetype != haystack)
      throw new HttpException("Произошла ошибка при записи файла", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
