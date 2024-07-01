
import React from 'react';

interface TreeNodeProps {
  node: TreeNode;
}

interface TreeNode {
  id: string;
  level: number;
  value: string;
  children?: TreeNode[];
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  return (
    <div className="p-2 m-5 border border-gray-300 rounded-md shadow-md">
      <div className="font-semibold text-lg mb-1">Node {node.value}</div>
      {node.children && (
        <div className="ml-4">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
