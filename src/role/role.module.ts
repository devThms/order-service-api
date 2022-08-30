import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { roleProviders } from './role.provider';

@Module({
  imports: [DatabaseModule],
  providers: [...roleProviders, RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
