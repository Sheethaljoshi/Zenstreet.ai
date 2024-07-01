# Project Name

## User Instructions

1. **Backend Setup:**
    ```bash
    cd backend
    npm run start:dev
    ```
2. **Frontend Setup:**
    ```bash
    cd frontend
    npm run dev
    ```

## Milestones

### Milestone 1: Initial Setup

#### Project Setup:

- **Frontend:** Set up a new Next.js project. 🌐
- **Backend:** Set up a new NestJS project. 🔧
- **Version Control:** Initialize a Git repository for version control. 🗃️

### Milestone 2: Basic Frontend Structure

#### Project Structure:

- Follow best practices for code structure and modularization in the Next.js project.
- Create basic components (e.g., TreeNode, Tree).

#### User Authentication:

- Implement a simple username input form.
- Set up state management (e.g., React context or Redux) for managing user state.

### Milestone 3: Backend Structure and User Management

#### Backend Setup:

- Set up the basic structure for the NestJS project.

#### Database Integration:

- Integrate a database (e.g., MongoDB, PostgreSQL). 🗄️
- Design and implement a schema for storing user information and tree structures. 📝

#### API Endpoints for User Management:

- Create an endpoint to validate and register unique usernames. 🔐
- Implement robust input validation and error handling for these endpoints.

### Milestone 4: Tree Data Structure and State Management

#### Tree Data Structure:

- Implement a data structure to represent a tree with a depth of 10,000 nodes in the frontend. 🌳
- Initialize each node with the value 1.

#### State Management:

- Use appropriate state management to manage the tree's state efficiently.

### Milestone 6: API Endpoints for Tree Management

#### API Endpoints for Tree Operations:

- Implement an endpoint to save the entire tree structure for a given username.
- Create an endpoint to retrieve a saved tree structure for a username.
- Ensure robust input validation and error handling for these endpoints.

### Milestone 7: Frontend-Backend Integration

#### API Communication:

- Set up secure communication between the Next.js frontend and the NestJS backend.
- Implement proper error handling for network requests. 🚦

## Main Logic Behind the Program

The main logic behind the program is encapsulated in the `UsersService` class, which handles user and tree management in the backend. Here's a key code snippet that explains the main logic:

```typescript
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
```
Explanation of the Main Logic:
User Insertion (insertUser):

Converts the username to lowercase.
Initializes the tree with a single root node (initialNode).
Creates and saves a new user with the initial tree structure.
User Retrieval (getUser):

Finds and returns a user by their username.
Tree Structure Retrieval (getTreeStructure):

Retrieves the tree structure for a given user ID.
Throws an error if the user is not found.
Node Addition (addNode):

Finds a user by their ID.
Searches for the parent node in the tree where the new node should be added.
Generates a unique ID for the new node based on its parent's level.
Adds the new node as a child of the found parent node.
Saves the updated user with the modified tree structure.
This logic handles user creation, tree structure management, and node addition dynamically, ensuring that each node is uniquely identified and correctly placed within the tree hierarchy.
