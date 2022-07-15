import { existsSync, readFileSync, rmdirSync } from "fs";
import * as path from "path"

export const TEST_FILE_PATH = path.resolve(__dirname, '../', 'assets/sowa.jpg');
export const TEST_FILE_ORIGINAL_NAME = 'sowa.jpg';

interface IFile {
  buffer: Buffer,
  size: number,
  mimetype: string,
  originalname: string
}

export const loadTestFile = (filePath: string, mockSizeInBytes: number, mockMimeType: string, mockOriginalName): IFile => {
  let buffer;
  filePath.split('/');
  try {
    buffer = readFileSync(filePath);
  } catch (error) {
    throw error;
  }
  return  { buffer, mimetype: mockMimeType, size: mockSizeInBytes, originalname: mockOriginalName }
}

export const removeTestStaticDir = () => {
  if(existsSync(process.env.SERVER_STATIC))
  {
    try {
      rmdirSync(process.env.SERVER_STATIC,{ recursive: true });
    } catch(error) {
      console.log(error);
    }
    console.log(`Directory ${process.env.SERVER_STATIC} deleted successfully`);
  }
}