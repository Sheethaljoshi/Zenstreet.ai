// users.model.ts

import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tree: {
      type: Object,
      default: { nodes: [] },
    },
  },
  { timestamps: true }
);

export interface User extends mongoose.Document {
  _id: string;
  username: string;
  password: string;
  tree: {
    nodes: TreeNode[]; // Define the type of your tree structure here
  };
}

export interface TreeNode {
  id: string;
  level: number;
  value: number;
  children?: TreeNode[];
}
