import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path"
import * as fs from "fs"
import * as uuid from "uuid"

@Injectable()
export class FilesService {

  public async addJPEGFile(file: any, fileName: string = "", relativeDir: string = ""): Promise<{originalImageURL: string, smallImageURL: string}>
  {
    FilesService.checkForFileSelection(file);
    FilesService.checkForMimeType(file, 'image/jpeg');
    FilesService.checkForSize(file, 50);
    relativeDir = FilesService.correctRelativePath(relativeDir);
    if(!fileName) {
      const date = new Date();
      fileName = String(date.getTime()) + file.originalname;
    }
    const relativeStaticDir = "/activecontent/images/avatars" + relativeDir;
    const {filePath, fileURL} = await this.createFile(file, fileName, relativeStaticDir);
    const result = await this.compressImage(filePath);
    return { originalImageURL: fileURL, smallImageURL: result.fileURL };
  }

  public async createFile(file: any, fileName: string = "", relativeStaticDir: string = "") : Promise<{filePath: string, fileURL: string}>
  {
    try {
      relativeStaticDir = FilesService.correctRelativePath(relativeStaticDir);

      if(!fileName)
          fileName = uuid.v4() + ".jpg";

      const dirForSaving = path.resolve(__dirname, '../../', process.env.SERVER_STATIC + relativeStaticDir);
      if(!fs.existsSync(dirForSaving))
          fs.mkdirSync(dirForSaving, {recursive: true})
      fs.writeFileSync(path.join(dirForSaving, fileName), file.buffer);

      const filePath = dirForSaving + "/" + fileName;
      const fileURL = this.getStaticFileURLFromStaticFileFullPath(filePath);

      return {filePath, fileURL};
    }
    catch (e)
    {
      throw new e;
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

  private static checkForSize(file: any, maxMBytes: number)
  {
    if(file.size > maxMBytes * 1000000)
      throw new HttpException(`Закружаемый файл не может привышать ${maxMBytes} МБт`, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  private static checkForFileSelection(file: any)
  {
    if(!file)
      throw new HttpException(`Файл не был выбран`, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  private async compressImage(filePath: string) : Promise<{filePath: string, fileURL: string}>
  {
    const list = filePath.split("/");
    const fileName = list[list.length - 1];
    const fileDir = filePath.replace(fileName, '');
    const compressFileName = "small_" + fileName;
    const compressFilePath = fileDir + compressFileName;

    const sharp = require("sharp");
    try {
      await sharp(filePath)
        .resize({
          height: 150
        })
        .toFile(compressFilePath);
    } catch (error) {
      throw new HttpException(`Ошибка при компрессии image-файла`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { filePath: compressFilePath, fileURL: this.getStaticFileURLFromStaticFileFullPath(compressFilePath ) }
  }

  private getStaticFileURLFromStaticFileFullPath(fullFilePath: string)
  {
    const serverStaticDir = process.env.SERVER_STATIC || undefined;
    const PORT = process.env.PORT || undefined;
    const SERVER_URL = process.env.SERVER_URL || undefined;
    if(!serverStaticDir || !PORT || !SERVER_URL)
      return "";
    const list = fullFilePath.split(serverStaticDir);
    if(list.length != 2)
      return "";
    return SERVER_URL + ":" + PORT + list[1];
  }
}