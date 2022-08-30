import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './local/role.entity';
import { Status } from '../common/status.enum';

@Injectable()
export class RoleService {

    constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
  ) {}

  async getAll( skip: number, all: string, take: number): Promise<[Role[], Number]> {

    if (!take) {

      let [roles, totalRecords] = await this.roleRepository.findAndCount({
        where: { status: Status.ACTIVE }
      });

      return [roles, totalRecords];

    }

    else {

      if (!all) {

        const [roles, totalRecords] = await this.roleRepository.findAndCount({
          where: { status: Status.ACTIVE },
          skip,
          take
        });

        return [roles, totalRecords];

      } else {

        if (all === 'true') {

          const [roles, totalRecords] = await this.roleRepository.findAndCount({
            skip,
            take
          });

          return [roles, totalRecords];

        } else {

          const [roles, totalRecords] = await this.roleRepository.findAndCount({
            where: { status: Status.ACTIVE },
            skip,
            take
          });

          return [roles, totalRecords];

        }

      }

    }
    
  }

  async get(id: string): Promise<Role> {

    if (!id) {
      throw new BadRequestException('The resource ID was not sent')
    }

    const role: Role = await this.roleRepository.findOne(id);

    if (!role) {
      throw new NotFoundException('The requested resource was not found')
    }

    return role;
  }

  async create(role: Role): Promise<Role> {

    const roleCreated = await this.roleRepository.save(role);

    return roleCreated;
  }

  async update(id: string, role: Role): Promise<Role> {

    if (!id) {
      throw new BadRequestException('The resource ID was not sent')
    }

    const roleDb: Role =  await this.roleRepository.findOne(id, {
      where: { status: Status.ACTIVE }
    });

    if (!roleDb) {
      throw new NotFoundException('The requested resource was not found')
    }
    
    await this.roleRepository.update(id, role);

    const roleUpdated = await this.roleRepository.findOne(id);

    return roleUpdated;

  }

  async delete(id: string): Promise<Role> {

    if (!id) {
      throw new BadRequestException('The resource ID was not sent')
    }

    const roleDb: Role = await this.roleRepository.findOne(id, {
      where: { status: Status.ACTIVE }
    });

    if (!roleDb) {
      throw new NotFoundException('The requested resource was not found')
    }

    await this.roleRepository.update(id, {
      status: Status.INACTIVE
    });

    const roleDeleted = await this.roleRepository.findOne(id);

    return roleDeleted;
  }

}
