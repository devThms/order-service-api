import { Injectable, Inject, BadRequestException, NotFoundException, Delete } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { User } from './local/user.entity';
import { Status } from '../common/status.enum';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {

    /**
     *
     */
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>
    ) { }

    async getAll( skip: number, all: string, take: number ): Promise<[User[], Number]> {

        if (!take) {

            let [users, totalRecords] = await this.userRepository.findAndCount({
                where: { status: Status.ACTIVE },
                relations: ['role']
            });

            return [users, totalRecords];

        } else {

            if (!all) {

                let [users, totalRecords] = await this.userRepository.findAndCount({
                    where: { status: Status.ACTIVE },
                    relations: ['role'],
                    skip,
                    take
                });

                return [users, totalRecords];

            } else {

                if (all === 'true') {

                    let [users, totalRecords] = await this.userRepository.findAndCount({
                        relations: ['role'],
                        skip,
                        take
                    });

                    return [users, totalRecords];

                } else {

                    let [users, totalRecords] = await this.userRepository.findAndCount({
                        where: { status: Status.ACTIVE },
                        relations: ['role'],
                        skip,
                        take
                    });

                    return [users, totalRecords];
                }
            }

        }

    }

    async getResponsibles(): Promise<User[]> {

        const userResponsibles: User[] = await this.userRepository.find({
            where: { is_responsible: true, status: Status.ACTIVE },
            relations: ['role']
        });

        return userResponsibles;

    }

    async get(id: string): Promise<User> {

        if (!id) {
            throw new BadRequestException('The resource ID was not sent')
        }

        const user: User = await this.userRepository.findOne(id, {
            where: { status: Status.ACTIVE },
            relations: ['role', 'customers', 'technicians'],
        });

        if (!user) {
            throw new NotFoundException('The requested resource was not found')
        }

        return user;

    }

    async getUserByBpId( id: string ): Promise<User> {

        const status = Status.INACTIVE;

        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.technicians', 'technicians')
            // .leftJoinAndSelect('user.customers', 'customers')
            .where('user.status <> :status', { status })
            .andWhere(new Brackets(qb => {
                qb.where('technicians.id = :id', { id })
                // .orWhere('customers.id = :id', { id })
            }))
            .orderBy('user.created_at', 'DESC')
            .getOne();

        return user;
    }

    async create(user: User): Promise<User> {

        let salt = await genSalt(10);
        user.password = await hash(user.password, salt);

        const userCreated = await this.userRepository.save(user);

        return userCreated;

    }

    async update(id: string, user: User): Promise<User> {

        if (!id) {
            throw new BadRequestException('The resource ID was not sent')
        }

        const userDb: User = await this.userRepository.findOne(id);

        if (!userDb) {
            throw new NotFoundException('The requested resource was not found')
        }

        await this.userRepository.update(id, user);

        const userUpdated = await this.userRepository.findOne(id);

        return userUpdated;

    }

    async updateDeviceToken( id: string, device_token: string ) {

        if (!id) {
            throw new BadRequestException('The resource ID was not sent')
        }

        const userDb: User = await this.userRepository.findOne(id, {
            where: { status: Status.ACTIVE }
        });

        if (!userDb) {
            throw new NotFoundException('The requested resource was not found')
        }

        await this.userRepository.update(id, {
            device_token
        });

        const userUpdated = await this.userRepository.findOne(id);

        return userUpdated;

    }

    async delete(id: string): Promise<User> {

        if (!id) {
            throw new BadRequestException('The resource ID was not sent')
        }

        const userDb: User = await this.userRepository.findOne(id, {
            where: { status: Status.ACTIVE }
        });

        if (!userDb) {
            throw new NotFoundException('The requested resource was not found')
        }

        await this.userRepository.update(id, {
            status: Status.INACTIVE
        });

        const userDeleted = await this.userRepository.findOne(id);

        return userDeleted;

        
    }



}
