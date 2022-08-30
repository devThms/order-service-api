import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { MinLength, MaxLength } from 'class-validator';
import { Status } from '../../common/status.enum';

// Model-Relations
import { Role } from '../../role/local/role.entity';
// import { Order } from '../../core/order/local/order.entity';
// import { Customer } from '../../customer/local/customer.entity';
// import { Technical } from '../../technical/local/technical.entity';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    @MinLength(3, {
        message: 'El campo $property debe tener al menos $constraint1 caracteres.',
    })
    @MaxLength(75, {
        message:
            'El campo $property debe tener como máximo $constraint1 caracteres.',
    })
    first_name: string;

    @Column({ type: 'varchar', length: 100 })
    @MinLength(3, {
        message: 'El campo $property debe tener al menos $constraint1 caracteres.',
    })
    @MaxLength(100, {
        message:
            'El campo $property debe tener como máximo $constraint1 caracteres.',
    })
    last_name: string;

    @Column({ type: 'varchar', length: 100 })
    username: string;

    @Column({ type: 'varchar', length: 200 })
    password: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    device_token: string;

    @Column({ type: 'boolean', default: false })
    is_responsible: boolean;

    @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
    status: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(
        type => Role,
        role => role.users,
        {
            nullable: false
        }
    )
    @JoinColumn({ name: 'role_id' })
    role: Role;

    // @OneToMany(
    //     type => Order,
    //     order => order.user
    // )
    // orders: Order[];

    // @OneToMany(
    //     type => Customer,
    //     customer => customer.user
    // )
    // customers: Customer[];

    // @OneToMany(
    //     type => Technical,
    //     technical => technical.user
    // )
    // technicians: Technical[];

}