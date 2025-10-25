import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FileRepository } from 'src/repository/file.repository';
import { Bucket } from './_dto';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async uploadFile(file: Express.Multer.File, bucket: Bucket): Promise<string> {
    try {
      return this.fileRepository.saveFile(file, bucket);
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), fileUrl);
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file: ${error.message}`);
    }
  }
}
