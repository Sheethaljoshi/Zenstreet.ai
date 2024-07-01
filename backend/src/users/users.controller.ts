import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Param,
  } from '@nestjs/common';
  import * as bcrypt from 'bcrypt';
  import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
  import { LocalAuthGuard } from 'src/auth/local.auth.guard';
  import { UsersService } from './users.service';
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    //signup
    @Post('/signup')
    async addUser(
      @Body('password') userPassword: string,
      @Body('username') userName: string,
    ) {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
      const result = await this.usersService.insertUser(
        userName,
        hashedPassword,
      );
      return {
        msg: 'User successfully registered',
        userId: result.id,
        userName: result.username
      };
    }

  // Add node to tree
  @Post('/addNodeToNode/:userId/:parentId')
  async addNodeToNode(
    @Param('userId') userId: string,
    @Param('parentId') parentId: string,
    @Body() newNode: any,
  ) {
    const result = await this.usersService.addNode(userId, parentId, newNode);
    return {
      msg: 'Node added under specific node successfully',
      user: result,
    };
  }

 
  @Get('/tree/:userId')
  async getTreeStructure(@Param('userId') userId: string) {
    const tree = await this.usersService.getTreeStructure(userId);
    return {
      tree,
    };
  }

    //Post / Login
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req): any {
      return {User: req.user,
              msg: 'User logged in'};
    }
     //Get / protected
    @UseGuards(AuthenticatedGuard)
    @Get('/protected')
    getHello(@Request() req): string {
      return req.user;
    }
     //Get / logout
    @Get('/logout')
      logout(@Request() req): any {
        req.session.destroy();
        return { msg: 'The user session has ended' }
      }
  }