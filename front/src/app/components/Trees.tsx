// Tree.tsx
import React from 'react';
import TreeNode from './Node';

interface TreeProps {
  tree: {
    nodes: TreeNode[];
  };
}

const Tree: React.FC<TreeProps> = ({ tree }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {tree.nodes.map(node => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};

export default Tree;
