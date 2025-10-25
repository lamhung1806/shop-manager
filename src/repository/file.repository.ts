import { Injectable } from '@nestjs/common';
import { Bucket } from 'src/modules/file/_dto';
import * as path from 'path';
import * as fs from 'fs/promises';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileRepository {
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File, bucket: Bucket): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads', bucket);
    await this.ensureDirectoryExists(uploadDir);

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    const relativePath = `/uploads/${bucket}/${fileName}`;
    const fullUrl = `${this.getBaseUrl()}${relativePath}`;
    return fullUrl;
  }

  private getBaseUrl(): string {
    // Lấy base URL từ environment variable hoặc default localhost
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }
}
