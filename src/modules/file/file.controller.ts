import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { Auth } from 'src/decorators/auth.decorator';
import { ROLE } from 'src/shared/type';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './_dto';

@Controller('file')
@ApiTags('File')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @Auth([ROLE.ADMIN, ROLE.SELLER, ROLE.BUYER])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UploadImageDto })
  @ApiOperation({ summary: 'Upload a file' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() { bucket }: UploadImageDto,
  ) {
    return this.fileService.uploadFile(file, bucket);
  }
}
