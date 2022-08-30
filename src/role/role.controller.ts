import { Controller, Get, Param, Post, Body, Put, Delete, Res, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './local/role.entity';
// import { AuthGuard } from '@nestjs/passport';

// @UseGuards(AuthGuard('jwt'))
@Controller('roles')
export class RoleController {

    /**
     *
     */
    constructor(
        private readonly _roleService: RoleService
    ) { }

    @Get()
    async getRoles( @Res() res, @Query('skip') skip: number, @Query('all') all: string, @Query('take') take: number ) {

        const [roles, totalRecords] = await this._roleService.getAll(skip, all, take);

        res.status(HttpStatus.OK).json({
            roles,
            totalRecords
        });
        
    }

    @Get('/:id')
    async getRole( @Res() res, @Param('id') id: string ) {

        const role = await this._roleService.get(id);

        res.status(HttpStatus.OK).json({
            role
        });
    }

    @Post()
    async createRole( @Res() res, @Body() role: Role ) {

        const roleCreated = await this._roleService.create(role);

        res.status(HttpStatus.CREATED).json({
            message: 'Role successfully created',
            roleCreated
        });
    }

    @Put('/:id')
    async update( @Res() res, @Param('id') id: string, @Body() role: Role ) {

        const roleUpdated = await this._roleService.update(id, role);

        res.status(HttpStatus.OK).json({
            message: 'Role successfully updated',
            roleUpdated
        });

    }

    @Delete('/:id')
    async delete( @Res() res, @Param('id') id: string ) {

        const roleDeleted = await this._roleService.delete(id);

        res.status(HttpStatus.OK).json({
            message: 'Role successfully deleted',
            roleDeleted
        });
    }

}
