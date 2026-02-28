import { useCallback, useMemo } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../components/CustomNode';

const initialNodes = [
    { id: 'center', position: { x: 400, y: 300 }, data: { label: '', type: 'context' }, type: 'custom' },
    { id: 'n1', position: { x: 400, y: 50 }, data: { label: 'Tech Stack', type: 'note' }, type: 'custom' },
    { id: 'n2', position: { x: 650, y: 150 }, data: { label: 'Team Sprint', type: 'task' }, type: 'custom' },
    { id: 'n3', position: { x: 700, y: 400 }, data: { label: 'Demo Video', type: 'file' }, type: 'custom' },
    { id: 'n4', position: { x: 550, y: 600 }, data: { label: 'Submit Deadl...', type: 'deadline' }, type: 'custom' },
    { id: 'n5', position: { x: 250, y: 600 }, data: { label: 'API Integrat...', type: 'task' }, type: 'custom' },
    { id: 'n6', position: { x: 100, y: 400 }, data: { label: 'Design Syste...', type: 'note' }, type: 'custom' },
    { id: 'n7', position: { x: 150, y: 150 }, data: { label: 'Architecture...', type: 'file' }, type: 'custom' },
];

const initialEdges = [
    { id: 'e1', source: 'center', target: 'n1', animated: false, style: { stroke: '#06B6D4', strokeWidth: 3 }, className: 'animated-edge' },
    { id: 'e2', source: 'center', target: 'n2', animated: false, style: { stroke: '#06B6D4', strokeWidth: 3 }, className: 'animated-edge' },
    { id: 'e3', source: 'center', target: 'n3', animated: false, style: { stroke: '#06B6D4', strokeWidth: 3 }, className: 'animated-edge' },
    { id: 'e4', source: 'center', target: 'n4', animated: false, style: { stroke: '#06B6D4', strokeWidth: 3 }, className: 'animated-edge' },
    { id: 'e5', source: 'center', target: 'n5', animated: false, style: { stroke: '#06B6D4', strokeWidth: 3 }, className: 'animated-edge' },
    { id: 'e6', source: 'center', target: 'n6', animated: false, style: { stroke: '#06B6D4', strokeWidth: 3 }, className: 'animated-edge' },
    { id: 'e7', source: 'center', target: 'n7', animated: false, style: { stroke: '#06B6D4', strokeWidth: 3 }, className: 'animated-edge' },
];

export default function GraphView() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    return (
        <div className="w-full h-full relative animate-pop-in">

            {/* Absolute top info/legends overlays */}
            <div className="absolute top-6 left-8 z-10 flex gap-4 text-slate-400 text-sm font-medium">
                <span>10 nodes</span>
                <span>·</span>
                <span>15 relationships</span>
            </div>

            <div className="absolute top-6 right-8 z-10 flex gap-3">
                {[
                    { label: 'context', color: 'bg-primary' },
                    { label: 'note', color: 'bg-purple-500' },
                    { label: 'task', color: 'bg-green-500' },
                    { label: 'deadline', color: 'bg-red-500' },
                    { label: 'member', color: 'bg-teal-500' },
                    { label: 'file', color: 'bg-pink-500' }
                ].map(legend => (
                    <div key={legend.label} className="flex items-center gap-2 bg-surface/80 border border-slate-700/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${legend.color}`}></div>
                        <span className="text-xs text-slate-300 capitalize">{legend.label}</span>
                    </div>
                ))}
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                className="bg-transparent"
                minZoom={0.5}
                maxZoom={2}
            >
                <Background
                    color="#334155"
                    gap={24}
                    size={2}
                    className="opacity-40"
                />
                <Controls
                    className="bg-surface/80 border-slate-700/50 fill-white"
                    showInteractive={false}
                />
            </ReactFlow>

            {/* Floating UI Card Bottom Left */}
            <div className="absolute bottom-8 left-8 z-10 w-64 glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,1)]"></div>
                    <h3 className="text-white font-bold tracking-tight">Hackathon 2026</h3>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/30 rounded-full tracking-widest uppercase">
                    Context
                </span>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed font-medium">
                    Connected to 8 other nodes
                </p>
            </div>
        </div>
    );
}
