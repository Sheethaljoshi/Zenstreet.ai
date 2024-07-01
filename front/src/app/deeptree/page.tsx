// App.tsx or ParentComponent.tsx
import React from 'react';
import Tree from '../components/Trees';

const App: React.FC = () => {
  // Example data based on the provided tree structure
  const treeData = {
    nodes: [
      {
        id: '1-1',
        level: 1,
        value: '1',
        children: [
          { id: '2-1', level: 2, value: '2' },
          { id: '2-2', level: 2, value: '5' },
          {
            id: '2-3',
            level: 2,
            value: '6',
            children: [
              {
                id: '3-1',
                level: 3,
                value: '2',
                children: [
                  { id: '4-1', level: 4, value: '4' }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tree Component</h1>
      <Tree tree={treeData} />
    </div>
  );
};

export default App;
