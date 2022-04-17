import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { FilesModule } from "../files/files.module";

@Module({
  controllers: [SecurityController],
  providers: [SecurityService],
  imports: [
    FilesModule
  ]
})
export class SecurityModule {}
