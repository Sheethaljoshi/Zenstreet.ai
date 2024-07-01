import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, TreeNode } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async insertUser(userName: string, password: string) {
    const username = userName.toLowerCase();
    const initialNode: TreeNode = {
      id: '1-1',  // Initial node id
      level: 1,
      value: 1,
      children: [],
    };
    const newUser = new this.userModel({
      username,
      password,
      tree: { nodes: [initialNode] }, // Initialize with one node
    });
    await newUser.save();
    return newUser;
  }

  async getUser(userName: string) {
    const username = userName.toLowerCase();
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async getTreeStructure(userId: string): Promise<TreeNode[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.tree.nodes;
  }

  async addNode(userId: string, parentId: string, newNode: any) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    function generateUniqueId(nodes: TreeNode[], parentLevel: number): string {
      const id = nodes.length > 0 ? String(nodes.length + 1) : '1';
      return `${parentLevel + 1}-${id}`; // Level is parentLevel + 1
    }

    function findAndAddNode(nodes: TreeNode[], parentId: string, newNode: any): boolean {
      for (const node of nodes) {
        if (node.id === parentId) {
          if (!node.children) {
            node.children = [];
          }
          newNode.id = generateUniqueId(node.children, node.level); // Generate unique ID based on parent's level
          newNode.level = node.level + 1; // Set level correctly based on parent's level
          node.children.push(newNode);
          return true;
        } else if (node.children && findAndAddNode(node.children, parentId, newNode)) {
          return true;
        }
      }
      return false;
    }

    if (!findAndAddNode(user.tree.nodes, parentId, newNode)) {
      throw new Error('Parent node not found');
    }

    user.markModified('tree');
    await user.save();
    return user;
  }
}
